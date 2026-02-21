import React, { useState, useEffect } from 'react';
import { Trash2, Eye, RefreshCw, MapPin, UserCheck, Copy, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [acceptingId, setAcceptingId] = useState(null);
  const [credentialsModal, setCredentialsModal] = useState(null);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${BACKEND_URL}/api/applications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Fehler beim Laden der Bewerbungen');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Möchten Sie diese Bewerbung wirklich löschen?')) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${BACKEND_URL}/api/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Bewerbung gelöscht');
      fetchApplications();
    } catch (error) {
      toast.error('Fehler beim Löschen');
    }
  };

  const handleAccept = async (app) => {
    if (!window.confirm(`Möchten Sie die Bewerbung von "${app.name}" akzeptieren und einen Mitarbeiter-Account erstellen?`)) {
      return;
    }

    setAcceptingId(app.id);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(
        `${BACKEND_URL}/api/applications/${app.id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success('Bewerbung akzeptiert! Mitarbeiter-Account erstellt.');
      setCredentialsModal(response.data.employee);
      fetchApplications();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Fehler beim Akzeptieren';
      toast.error(errorMsg);
    } finally {
      setAcceptingId(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('In Zwischenablage kopiert');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Akzeptiert':
        return (
          <span className="px-2 py-1 bg-[#9ece6a]/20 text-[#9ece6a] rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle size={12} />
            Akzeptiert
          </span>
        );
      case 'Neu':
      default:
        return (
          <span className="px-2 py-1 bg-[#7aa2f7]/20 text-[#7aa2f7] rounded-full text-xs font-medium">
            Neu
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7aa2f7]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-applications-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#c0caf5]">Bewerbungen</h1>
          <p className="text-[#9aa5ce] mt-1">
            {applications.length} Bewerbung{applications.length !== 1 ? 'en' : ''} insgesamt
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="flex items-center space-x-2 px-4 py-2 bg-[#7aa2f7] text-white rounded-lg hover:bg-[#7aa2f7]/80 transition-colors"
          data-testid="refresh-applications-btn"
        >
          <RefreshCw size={18} />
          <span>Aktualisieren</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#16161e] border border-[#292e42] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1a1b26] border-b border-[#292e42]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">E-Mail</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Position</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#565f89]">
                    Noch keine Bewerbungen vorhanden
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-[#292e42] hover:bg-[#1a1b26] transition-colors"
                    data-testid={`application-row-${app.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-[#c0caf5] font-medium">{app.name}</div>
                      <div className="text-xs text-[#565f89] mt-1">
                        {formatDate(app.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#9aa5ce]">{app.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#bb9af7]/10 text-[#bb9af7] rounded-full text-sm font-medium">
                        {app.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 text-[#7dcfff] hover:bg-[#7dcfff]/10 rounded-lg transition-colors"
                          title="Details ansehen"
                          data-testid={`view-application-${app.id}`}
                        >
                          <Eye size={18} />
                        </button>
                        {app.status !== 'Akzeptiert' && (
                          <button
                            onClick={() => handleAccept(app)}
                            disabled={acceptingId === app.id}
                            className="p-2 text-[#9ece6a] hover:bg-[#9ece6a]/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Bewerbung akzeptieren"
                            data-testid={`accept-application-${app.id}`}
                          >
                            {acceptingId === app.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#9ece6a]"></div>
                            ) : (
                              <UserCheck size={18} />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 text-[#f7768e] hover:bg-[#f7768e]/10 rounded-lg transition-colors"
                          title="Löschen"
                          data-testid={`delete-application-${app.id}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-[#16161e] border border-[#292e42] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#292e42] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#c0caf5]">Bewerbungsdetails</h2>
              {getStatusBadge(selectedApp.status)}
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-semibold text-[#c0caf5] mb-4">Persönliche Daten</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#565f89]">Name</p>
                    <p className="text-[#c0caf5] font-medium">{selectedApp.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#565f89]">Geburtsdatum</p>
                    <p className="text-[#c0caf5]">{selectedApp.geburtsdatum}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#565f89]">E-Mail</p>
                    <p className="text-[#c0caf5]">{selectedApp.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#565f89]">Mobilnummer</p>
                    <p className="text-[#c0caf5]">{selectedApp.mobilnummer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#565f89]">Staatsangehörigkeit</p>
                    <p className="text-[#c0caf5]">{selectedApp.staatsangehoerigkeit}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-[#c0caf5] mb-4">Anschrift</h3>
                <div className="flex items-start space-x-2 text-[#9aa5ce]">
                  <MapPin className="text-[#7aa2f7] mt-1 flex-shrink-0" size={18} />
                  <div>
                    <p>{selectedApp.strasse}</p>
                    <p>{selectedApp.postleitzahl} {selectedApp.stadt}</p>
                  </div>
                </div>
              </div>

              {/* Position */}
              <div>
                <h3 className="text-lg font-semibold text-[#c0caf5] mb-4">Bewerbung</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-[#565f89]">Position</p>
                    <p className="text-[#c0caf5] font-medium">{selectedApp.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#565f89]">Anschreiben</p>
                    <p className="text-[#9aa5ce] whitespace-pre-wrap">{selectedApp.message}</p>
                  </div>
                  {selectedApp.cv_filename && (
                    <div>
                      <p className="text-sm text-[#565f89]">Lebenslauf</p>
                      <p className="text-[#7dcfff]">{selectedApp.cv_filename}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-[#292e42] flex justify-end space-x-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-6 py-2 bg-[#292e42] text-[#c0caf5] rounded-lg hover:bg-[#414868] transition-colors"
              >
                Schließen
              </button>
              {selectedApp.status !== 'Akzeptiert' && (
                <button
                  onClick={() => {
                    handleAccept(selectedApp);
                    setSelectedApp(null);
                  }}
                  className="px-6 py-2 bg-[#9ece6a] text-white rounded-lg hover:bg-[#9ece6a]/80 transition-colors flex items-center gap-2"
                >
                  <UserCheck size={18} />
                  Akzeptieren
                </button>
              )}
              <button
                onClick={() => {
                  handleDelete(selectedApp.id);
                  setSelectedApp(null);
                }}
                className="px-6 py-2 bg-[#f7768e] text-white rounded-lg hover:bg-[#f7768e]/80 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {credentialsModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setCredentialsModal(null)}
        >
          <div
            className="bg-[#16161e] border border-[#9ece6a]/30 rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
            data-testid="credentials-modal"
          >
            <div className="p-6 border-b border-[#292e42] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#9ece6a]/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-[#9ece6a]" size={24} />
                </div>
                <h2 className="text-xl font-bold text-[#c0caf5]">Mitarbeiter erstellt!</h2>
              </div>
              <button
                onClick={() => setCredentialsModal(null)}
                className="p-2 text-[#565f89] hover:text-[#c0caf5] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-[#9aa5ce] text-sm">
                Die folgenden Zugangsdaten wurden für <span className="text-[#c0caf5] font-medium">{credentialsModal.name}</span> erstellt:
              </p>

              <div className="bg-[#1a1b26] border border-[#292e42] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#565f89]">E-Mail</p>
                    <p className="text-[#c0caf5] font-mono">{credentialsModal.email}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(credentialsModal.email)}
                    className="p-2 text-[#7aa2f7] hover:bg-[#7aa2f7]/10 rounded-lg transition-colors"
                    title="Kopieren"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#565f89]">Passwort</p>
                    <p className="text-[#9ece6a] font-mono font-bold">{credentialsModal.password}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(credentialsModal.password)}
                    className="p-2 text-[#7aa2f7] hover:bg-[#7aa2f7]/10 rounded-lg transition-colors"
                    title="Kopieren"
                  >
                    <Copy size={16} />
                  </button>
                </div>

                <div className="pt-2 border-t border-[#292e42]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#565f89]">Mitarbeiternummer:</span>
                    <span className="text-[#c0caf5]">{credentialsModal.employee_number}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-[#565f89]">Position:</span>
                    <span className="text-[#c0caf5]">{credentialsModal.position}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f7768e]/10 border border-[#f7768e]/30 rounded-lg p-3">
                <p className="text-sm text-[#f7768e]">
                  ⚠️ <strong>Wichtig:</strong> Notieren Sie das Passwort jetzt! Es kann später nicht mehr angezeigt werden.
                </p>
              </div>

              <div className="text-sm text-[#565f89]">
                Der Mitarbeiter kann sich jetzt unter <span className="text-[#7aa2f7]">/mitarbeiter/login</span> anmelden.
              </div>
            </div>

            <div className="p-6 border-t border-[#292e42]">
              <button
                onClick={() => {
                  copyToClipboard(`E-Mail: ${credentialsModal.email}\nPasswort: ${credentialsModal.password}`);
                  toast.success('Zugangsdaten kopiert');
                }}
                className="w-full px-4 py-2 bg-[#7aa2f7] text-white rounded-lg hover:bg-[#7aa2f7]/80 transition-colors flex items-center justify-center gap-2"
              >
                <Copy size={18} />
                Alle Zugangsdaten kopieren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
