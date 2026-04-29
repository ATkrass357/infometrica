import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Clock, MessageSquare, Mail, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TestSession = () => {
  const { token } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [data, setData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const timerRef = useRef(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/test-sessions/public/${token}`);
      setSession(res.data);
      if (res.data.status === 'active') {
        const dataRes = await axios.get(`${BACKEND_URL}/api/test-sessions/public/${token}/data`);
        setData(dataRes.data);
      }
    } catch (e) {
      setError('Sitzung nicht gefunden');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/test-sessions/public/${token}/data`);
      setData(res.data);
    } catch (e) {
      if (e.response?.status === 400) {
        setSession(prev => ({ ...prev, status: 'expired' }));
        clearInterval(pollRef.current);
      }
    }
  }, [token]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  useEffect(() => {
    if (session?.status === 'active') {
      fetchData();
      pollRef.current = setInterval(fetchData, 10000);
      return () => clearInterval(pollRef.current);
    }
  }, [session?.status, fetchData]);

  // Countdown timer
  useEffect(() => {
    if (session?.status === 'active' && session?.expires_at) {
      const updateTimer = () => {
        const exp = new Date(session.expires_at).getTime();
        const now = Date.now();
        const diff = Math.max(0, exp - now);
        if (diff <= 0) {
          setSession(prev => ({ ...prev, status: 'expired' }));
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          setTimeLeft('00:00');
        } else {
          const mins = Math.floor(diff / 60000);
          const secs = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        }
      };
      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [session?.status, session?.expires_at]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/test-sessions/public/${token}/start`);
      setSession(prev => ({ ...prev, ...res.data }));
      // Immediately fetch data after starting
      const dataRes = await axios.get(`${BACKEND_URL}/api/test-sessions/public/${token}/data`);
      setData(dataRes.data);
    } catch (e) {
      setError(e.response?.data?.detail || 'Fehler beim Starten');
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Fehler</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Expired
  if (session?.status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center">
          <Clock size={48} className="text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Sitzung abgelaufen</h1>
          <p className="text-gray-600">Diese Test-Sitzung ist nicht mehr verfügbar.</p>
        </div>
      </div>
    );
  }

  // Waiting - show start button
  if (session?.status === 'waiting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play size={36} className="text-emerald-600 ml-1" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{session.title}</h1>
          <p className="text-gray-600 mb-8">Klicken Sie auf Start um die Test-Sitzung zu beginnen. Sie haben dann <strong>1 Stunde</strong> Zeit.</p>
          <button
            onClick={handleStart}
            disabled={starting}
            className="w-full px-6 py-4 bg-emerald-500 text-white font-bold text-lg rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-colors"
            data-testid="start-session-btn"
          >
            {starting ? 'Wird gestartet...' : 'Start'}
          </button>
        </div>
      </div>
    );
  }

  // Active - show data
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header with timer */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">{session.title}</h1>
              <p className="text-sm text-gray-500">Test-Sitzung aktiv</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Clock size={18} className="text-emerald-600" />
              <span className="font-mono font-bold text-emerald-700 text-lg">{timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Login Data */}
        {(data?.test_ident_link || data?.test_login_email) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-4">
            <h2 className="font-semibold text-gray-900 mb-4">Zugangsdaten</h2>
            <div className="space-y-3">
              {data.test_ident_link && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Ident Link</p>
                  <a href={data.test_ident_link} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline text-sm break-all font-medium">{data.test_ident_link}</a>
                </div>
              )}
              {data.test_login_email && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">E-Mail</p>
                    <p className="font-mono text-gray-900 text-sm">{data.test_login_email}</p>
                  </div>
                  {data.test_login_password && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Passwort</p>
                      <p className="font-mono text-gray-900 text-sm">{data.test_login_password}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SMS Section */}
        {data?.anosim_number && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-blue-500" />
                <h2 className="font-semibold text-gray-900">SMS Codes</h2>
              </div>
              <button onClick={fetchData} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500">Telefonnummer</p>
              <p className="font-mono text-gray-900 font-medium">{data.anosim_number}</p>
            </div>
            {data.sms_messages?.length > 0 ? (
              <div className="space-y-2">
                {data.sms_messages.map((sms, i) => (
                  <div key={i} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-blue-600 font-medium">{sms.sender || 'SMS'}</span>
                      <span className="text-xs text-gray-400">{sms.received_at || ''}</span>
                    </div>
                    <p className="text-sm text-gray-900">{sms.text || sms.message || ''}</p>
                    {sms.code && (
                      <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full">
                        <CheckCircle size={12} className="text-blue-600" />
                        <span className="font-mono font-bold text-blue-800">{sms.code}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Noch keine SMS empfangen</p>
            )}
          </div>
        )}

        {/* Email Section */}
        {data?.email_address && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-purple-500" />
                <h2 className="font-semibold text-gray-900">Codes</h2>
              </div>
              <button onClick={fetchData} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <RefreshCw size={16} />
              </button>
            </div>
            {data.emails?.length > 0 ? (
              <div className="space-y-2">
                {data.emails.map((em, i) => (
                  <div key={i} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-purple-600 font-medium truncate">{em.sender || ''}</span>
                      <span className="text-xs text-gray-400">{em.received_at || ''}</span>
                    </div>
                    <p className="text-sm text-gray-700 truncate">{em.subject || ''}</p>
                    {em.codes?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {em.codes.map((code, j) => (
                          <span key={j} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 rounded-full">
                            <CheckCircle size={12} className="text-purple-600" />
                            <span className="font-mono font-bold text-purple-800">{code}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Noch keine Codes empfangen</p>
            )}
          </div>
        )}

        {/* No data assigned */}
        {!data?.anosim_number && !data?.email_address && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
            <p>Keine Nummer oder E-Mail für diese Sitzung konfiguriert.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSession;
