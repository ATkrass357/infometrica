import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MitarbeiterAuftrage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('employee_token');
      const response = await axios.get(`${BACKEND_URL}/api/employee/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Fehler beim Laden der Aufträge');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('employee_token');
      await axios.patch(
        `${BACKEND_URL}/api/employee/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status aktualisiert');
      fetchTasks();
    } catch (error) {
      toast.error('Fehler beim Aktualisieren');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'open') return task.status === 'Offen';
    if (filter === 'in_progress') return task.status === 'In Bearbeitung';
    if (filter === 'completed') return task.status === 'Abgeschlossen';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meine Aufträge</h1>
          <p className="text-gray-600 mt-1">{tasks.length} Aufgabe(n) insgesamt</p>
        </div>
        <button
          onClick={fetchTasks}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <RefreshCw size={18} />
          <span>Aktualisieren</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'all'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Alle ({tasks.length})
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'open'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Offen ({tasks.filter(t => t.status === 'Offen').length})
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'in_progress'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          In Bearbeitung ({tasks.filter(t => t.status === 'In Bearbeitung').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'completed'
              ? 'text-orange-600 border-b-2 border-orange-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Abgeschlossen ({tasks.filter(t => t.status === 'Abgeschlossen').length})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Clock size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Keine Aufträge in dieser Kategorie</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-gray-600">{task.description}</p>
                </div>
                <div className="ml-4 flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.priority === 'Hoch' ? 'bg-red-100 text-red-600' :
                    task.priority === 'Normal' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {task.due_date && (
                    <div className="text-sm text-gray-600">
                      <Clock size={16} className="inline mr-1" />
                      Fällig: {task.due_date}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {task.status !== 'In Bearbeitung' && task.status !== 'Abgeschlossen' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'In Bearbeitung')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Starten
                    </button>
                  )}
                  {task.status === 'In Bearbeitung' && (
                    <button
                      onClick={() => updateTaskStatus(task.id, 'Abgeschlossen')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Abschließen
                    </button>
                  )}
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    task.status === 'Offen' ? 'bg-orange-100 text-orange-600' :
                    task.status === 'In Bearbeitung' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MitarbeiterAuftrage;
