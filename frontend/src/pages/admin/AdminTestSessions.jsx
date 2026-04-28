import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Copy, Clock, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const SITE_URL = window.location.origin;

const AdminTestSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [emailAccounts, setEmailAccounts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    anosim_number: '',
    anosim_booking_id: '',
    email_account_id: '',
    notes: '',
  });

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    try {
      const [sessRes, emailRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/test-sessions/`, { headers }),
        axios.get(`${BACKEND_URL}/api/email-inbox/accounts`, { headers }).catch(() => ({ data: [] }))
      ]);
      setSessions(sessRes.data || []);
      setEmailAccounts(emailRes.data || []);
    } catch (e) {
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Titel erforderlich');
      return;
    }
    try {
      const res = await axios.post(`${BACKEND_URL}/api/test-sessions/create`, formData, { headers });
      toast.success('Test-Sitzung erstellt');
      setShowForm(false);
      setFormData({ title: '', anosim_number: '', anosim_booking_id: '', email_account_id: '', notes: '' });
      fetchData();
    } catch (e) {
      toast.error('Fehler beim Erstellen');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Sitzung löschen?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/test-sessions/${id}`, { headers });
      toast.success('Gelöscht');
      fetchData();
    } catch (e) {
      toast.error('Fehler');
    }
  };

  const copyLink = (sessionToken) => {
    const link = `${SITE_URL}/test/${sessionToken}`;
    navigator.clipboard.writeText(link);
    toast.success('Link kopiert!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'waiting':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs"><Clock size={12} />Wartend</span>;
      case 'active':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs"><CheckCircle size={12} />Aktiv</span>;
      case 'expired':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-400 rounded-full text-xs"><XCircle size={12} />Abgelaufen</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7aa2f7]"></div></div>;
  }

  return (
    <div className="space-y-6" data-testid="admin-test-sessions">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#c0caf5]">Test-Sitzungen</h1>
          <p className="text-[#565f89] mt-1">Erstelle zeitlich begrenzte Test-Links für Mitarbeiter</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="p-2 bg-[#1a1b26] hover:bg-[#292e42] text-[#7aa2f7] rounded-lg transition-colors">
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7aa2f7] text-[#1a1b26] rounded-lg font-medium hover:bg-[#89b4fa] transition-colors"
            data-testid="create-session-btn"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Neue Sitzung</span>
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="bg-[#16161e] border border-[#292e42] rounded-xl p-12 text-center text-[#565f89]">
            Noch keine Test-Sitzungen erstellt
          </div>
        ) : (
          sessions.map((s) => (
            <div key={s.id} className="bg-[#16161e] border border-[#292e42] rounded-xl p-4 sm:p-5" data-testid={`session-${s.id}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[#c0caf5]">{s.title}</h3>
                    {getStatusBadge(s.status)}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-[#565f89]">
                    {s.anosim_number && <span>Nr: {s.anosim_number}</span>}
                    {s.email_address && <span>Mail: {s.email_address}</span>}
                    {s.expires_at && <span>Ablauf: {new Date(s.expires_at).toLocaleString('de-DE')}</span>}
                  </div>
                  {s.notes && <p className="text-xs text-[#9aa5ce] mt-1">{s.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyLink(s.token)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#292e42] text-[#7aa2f7] rounded-lg hover:bg-[#343b58] transition-colors text-sm"
                    data-testid={`copy-link-${s.id}`}
                  >
                    <Copy size={14} />
                    Link
                  </button>
                  <a
                    href={`/test/${s.token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-[#9ece6a] hover:bg-[#9ece6a]/10 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} />
                  </a>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 text-[#f7768e] hover:bg-[#f7768e]/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1b26] border border-[#292e42] rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-[#292e42]">
              <h2 className="text-xl font-bold text-[#c0caf5]">Neue Test-Sitzung</h2>
              <p className="text-sm text-[#565f89] mt-1">Erstelle einen zeitlich begrenzten Test-Link</p>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-2">Titel *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="z.B. Ident-Test Bank XY"
                  className="w-full px-4 py-3 bg-[#16161e] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                  required
                  data-testid="session-title-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-2">Anosim Nummer</label>
                <input
                  type="text"
                  value={formData.anosim_number}
                  onChange={(e) => setFormData({ ...formData, anosim_number: e.target.value })}
                  placeholder="+420..."
                  className="w-full px-4 py-3 bg-[#16161e] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-2">Anosim Booking ID</label>
                <input
                  type="text"
                  value={formData.anosim_booking_id}
                  onChange={(e) => setFormData({ ...formData, anosim_booking_id: e.target.value })}
                  placeholder="Booking ID für SMS-Abruf"
                  className="w-full px-4 py-3 bg-[#16161e] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-2">E-Mail Konto</label>
                <select
                  value={formData.email_account_id}
                  onChange={(e) => setFormData({ ...formData, email_account_id: e.target.value })}
                  className="w-full px-4 py-3 bg-[#16161e] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                >
                  <option value="">Kein E-Mail Konto</option>
                  {emailAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-2">Notizen (optional)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Interne Notizen..."
                  className="w-full px-4 py-3 bg-[#16161e] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 bg-[#292e42] text-[#c0caf5] rounded-lg hover:bg-[#343b58] transition-colors">
                  Abbrechen
                </button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#7aa2f7] text-[#1a1b26] rounded-lg font-medium hover:bg-[#89b4fa] transition-colors" data-testid="save-session-btn">
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestSessions;
