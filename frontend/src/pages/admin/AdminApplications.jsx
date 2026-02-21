import React, { useState, useEffect } from 'react';
import { Trash2, Eye, RefreshCw, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7aa2f7]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Geburtsdatum</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Mobilnummer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">E-Mail</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Ort & Anschrift</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Position</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#565f89]">
                    Noch keine Bewerbungen vorhanden
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-[#292e42] hover:bg-[#1a1b26] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="text-[#c0caf5] font-medium">{app.name}</div>
                      <div className="text-xs text-[#565f89] mt-1">
                        {formatDate(app.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#9aa5ce]">{app.geburtsdatum}</td>
                    <td className="px-6 py-4 text-[#9aa5ce]">{app.mobilnummer}</td>
                    <td className="px-6 py-4 text-[#9aa5ce]">{app.email}</td>
                    <td className="px-6 py-4">
                      <div className="text-[#9aa5ce]">{app.stadt}</div>
                      <div className="text-xs text-[#565f89]">
                        {app.strasse}, {app.postleitzahl}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#7aa2f7]/10 text-[#7aa2f7] rounded-full text-sm font-medium">
                        {app.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 text-[#7dcfff] hover:bg-[#7dcfff]/10 rounded-lg transition-colors"
                          title="Details ansehen"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 text-[#f7768e] hover:bg-[#f7768e]/10 rounded-lg transition-colors"
                          title="Löschen"
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
            <div className="p-6 border-b border-[#292e42]">
              <h2 className="text-2xl font-bold text-[#c0caf5]">Bewerbungsdetails</h2>
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
              <button
                onClick={() => {
                  handleDelete(selectedApp.id);
                  setSelectedApp(null);
                }}
                className="px-6 py-2 bg-[#f7768e] text-white rounded-lg hover:bg-[#f7768e]/80 transition-colors"
              >
                Bewerbung löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
