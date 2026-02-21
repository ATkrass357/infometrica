import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProtectedEmployeeRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('employee_token');
      const loginTime = localStorage.getItem('employee_login_time');

      if (!token || !loginTime) {
        setIsValid(false);
        return;
      }

      // Check if 30 minutes have passed
      const timeElapsed = Date.now() - parseInt(loginTime);
      const thirtyMinutes = 30 * 60 * 1000;

      if (timeElapsed > thirtyMinutes) {
        localStorage.removeItem('employee_token');
        localStorage.removeItem('employee_data');
        localStorage.removeItem('employee_login_time');
        setIsValid(false);
        return;
      }

      try {
        await axios.get(`${BACKEND_URL}/api/employee/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsValid(true);
      } catch (error) {
        localStorage.removeItem('employee_token');
        localStorage.removeItem('employee_data');
        localStorage.removeItem('employee_login_time');
        setIsValid(false);
      }
    };

    verifyToken();
  }, [location]);

  if (isValid === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/mitarbeiter/login" replace />;
  }

  return children;
};

export default ProtectedEmployeeRoute;
