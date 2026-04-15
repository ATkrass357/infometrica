import React, { useState, useEffect } from 'react';
import { Trash2, Eye, RefreshCw, MapPin, UserCheck, CheckCircle, X, Clock, Shield, Unlock, Search, CheckSquare, Square, ClipboardList } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const QUIZ_QUESTIONS = {
  1: 'Deutscher Staatsbürger?',
  2: 'Gültiger Personalausweis/Reisepass?',
  3: 'Mindestens 18 Jahre alt?',
  4: 'Test-Ident-Verfahren Info verstanden',
  5: 'Einverstanden mit echtem Ausweis?',
  6: 'Hauptaufgabe Web App Tester?',
  7: 'Was ist ein Bug?',
  8: 'Was ist responsives Design?',
  9: 'Was tun bei Fehlerfund?',
  10: 'Was ist eine IP-Adresse?',
  11: 'Was bedeutet Cache leeren?',
  12: 'Was ist ein Testbericht?',
  13: 'Warum Vertraulichkeit?',
  14: 'Was bei Unklarheiten tun?',
  15: 'Fragen/Anmerkungen',
};

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);

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

  const fetchQuizAnswers = async (appId) => {
    setLoadingQuiz(true);
    setQuizAnswers(null);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${BACKEND_URL}/api/quiz/admin/${appId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizAnswers(response.data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const openAppDetail = (app) => {
    setSelectedApp(app);
    if (app.quiz_completed) {
      fetchQuizAnswers(app.id);
    } else {
      setQuizAnswers(null);
    }
  };

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
    if (!window.confirm(`Möchten Sie die Bewerbung von "${app.name}" akzeptieren? Der Bewerber kann dann seine Ausweisdokumente hochladen.`)) {
      return;
    }

    setProcessingId(app.id);

    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(
        `${BACKEND_URL}/api/applications/${app.id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success('Bewerbung akzeptiert! Der Bewerber kann nun seine Verifizierung durchführen.');
      fetchApplications();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Fehler beim Akzeptieren';
      toast.error(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  // Bulk accept selected applications
  const handleBulkAccept = async () => {
    const newApplicationIds = selectedIds.filter(id => {
      const app = applications.find(a => a.id === id);
      return app && app.status === 'Neu';
    });

    if (newApplicationIds.length === 0) {
      toast.error('Keine neuen Bewerbungen ausgewählt');
      return;
    }

    if (!window.confirm(`Möchten Sie ${newApplicationIds.length} Bewerbung(en) akzeptieren?`)) {
      return;
    }

    setBulkProcessing(true);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.post(
        `${BACKEND_URL}/api/applications/bulk-accept`,
        { application_ids: newApplicationIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const { accepted, failed } = response.data;
      
      if (accepted > 0) {
        toast.success(`${accepted} Bewerbung(en) erfolgreich akzeptiert!`);
      }
      if (failed > 0) {
        toast.error(`${failed} Bewerbung(en) konnten nicht akzeptiert werden`);
      }
      
      setSelectedIds([]);
      fetchApplications();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Fehler bei der Bulk-Akzeptierung';
      toast.error(errorMsg);
    } finally {
      setBulkProcessing(false);
    }
  };

  // Toggle selection of a single application
  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  // Toggle select all (only "Neu" applications from filtered list)
  const toggleSelectAll = () => {
    const newAppIds = filteredApplications
      .filter(app => app.status === 'Neu')
      .map(app => app.id);
    
    const allSelected = newAppIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      // Deselect all new applications
      setSelectedIds(prev => prev.filter(id => !newAppIds.includes(id)));
    } else {
      // Select all new applications
      setSelectedIds(prev => [...new Set([...prev, ...newAppIds])]);
    }
  };

  // Count of selected "Neu" applications
  const selectedNewCount = selectedIds.filter(id => {
    const app = applications.find(a => a.id === id);
    return app && app.status === 'Neu';
  }).length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Freigeschaltet':
        return (
          <span className="px-2 py-1 bg-[#9ece6a]/20 text-[#9ece6a] rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle size={12} />
            Freigeschaltet
          </span>
        );
      case 'Verifiziert':
        return (
          <span className="px-2 py-1 bg-[#7dcfff]/20 text-[#7dcfff] rounded-full text-xs font-medium flex items-center gap-1">
            <Shield size={12} />
            Verifiziert
          </span>
        );
      case 'Akzeptiert':
        return (
          <span className="px-2 py-1 bg-[#bb9af7]/20 text-[#bb9af7] rounded-full text-xs font-medium flex items-center gap-1">
            <Clock size={12} />
            Wartet auf ID
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

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchQuery === '' || 
      app.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.stadt?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#c0caf5]">Bewerbungen</h1>
          <p className="text-[#9aa5ce] mt-1">
            {filteredApplications.length} von {applications.length} Bewerbung{applications.length !== 1 ? 'en' : ''}
            {selectedIds.length > 0 && (
              <span className="ml-2 text-[#7aa2f7]">
                ({selectedIds.length} ausgewählt)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedNewCount > 0 && (
            <button
              onClick={handleBulkAccept}
              disabled={bulkProcessing}
              className="flex items-center space-x-2 px-4 py-2 bg-[#9ece6a] text-white rounded-lg hover:bg-[#9ece6a]/80 transition-colors disabled:opacity-50"
              data-testid="bulk-accept-btn"
            >
              {bulkProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <CheckSquare size={18} />
              )}
              <span>{selectedNewCount} akzeptieren</span>
            </button>
          )}
          <button
            onClick={fetchApplications}
            className="flex items-center space-x-2 px-4 py-2 bg-[#7aa2f7] text-white rounded-lg hover:bg-[#7aa2f7]/80 transition-colors"
            data-testid="refresh-applications-btn"
          >
            <RefreshCw size={18} />
            <span>Aktualisieren</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#565f89]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nach Name, E-Mail, Position oder Stadt suchen..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] placeholder-[#565f89] focus:outline-none focus:border-[#7aa2f7]"
            data-testid="search-applications-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#565f89] hover:text-[#c0caf5]"
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
          data-testid="status-filter-select"
        >
          <option value="all">Alle Status</option>
          <option value="Neu">Neu</option>
          <option value="Akzeptiert">Wartet auf ID</option>
          <option value="Verifiziert">Verifiziert</option>
          <option value="Freigeschaltet">Freigeschaltet</option>
        </select>
      </div>

      {/* Info Banner for bulk selection */}
      {statusFilter === 'all' && applications.filter(a => a.status === 'Neu').length > 0 && (
        <div className="bg-[#7aa2f7]/10 border border-[#7aa2f7]/30 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckSquare size={20} className="text-[#7aa2f7] flex-shrink-0" />
            <span className="text-[#c0caf5]">
              <strong>{applications.filter(a => a.status === 'Neu').length}</strong> neue Bewerbung(en) können ausgewählt und akzeptiert werden.
            </span>
          </div>
          <button
            onClick={() => setStatusFilter('Neu')}
            className="px-4 py-2 bg-[#7aa2f7] text-white rounded-lg hover:bg-[#7aa2f7]/80 transition-colors text-sm"
          >
            Nur Neue anzeigen
          </button>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-[#16161e] border border-[#292e42] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1a1b26] border-b border-[#292e42]">
                <th className="px-4 py-4 text-left">
                  {filteredApplications.filter(app => app.status === 'Neu').length > 0 && (
                    <button
                      onClick={toggleSelectAll}
                      className="text-[#7aa2f7] hover:text-[#7dcfff] transition-colors"
                      title="Alle neuen auswählen"
                      data-testid="select-all-checkbox"
                    >
                      {filteredApplications.filter(app => app.status === 'Neu').every(app => selectedIds.includes(app.id)) ? (
                        <CheckSquare size={20} />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">E-Mail</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Position</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#c0caf5]">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#565f89]">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Keine Bewerbungen gefunden' 
                      : 'Noch keine Bewerbungen vorhanden'}
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className={`border-b border-[#292e42] hover:bg-[#1a1b26] transition-colors ${
                      selectedIds.includes(app.id) ? 'bg-[#7aa2f7]/10' : ''
                    }`}
                    data-testid={`application-row-${app.id}`}
                  >
                    <td className="px-4 py-4">
                      {app.status === 'Neu' && (
                        <button
                          onClick={() => toggleSelection(app.id)}
                          className="text-[#7aa2f7] hover:text-[#7dcfff] transition-colors"
                          data-testid={`checkbox-${app.id}`}
                        >
                          {selectedIds.includes(app.id) ? (
                            <CheckSquare size={20} />
                          ) : (
                            <Square size={20} />
                          )}
                        </button>
                      )}
                    </td>
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
                          onClick={() => openAppDetail(app)}
                          className="p-2 text-[#7dcfff] hover:bg-[#7dcfff]/10 rounded-lg transition-colors"
                          title="Details ansehen"
                          data-testid={`view-application-${app.id}`}
                        >
                          <Eye size={18} />
                        </button>
                        {app.status === 'Neu' && (
                          <button
                            onClick={() => handleAccept(app)}
                            disabled={processingId === app.id}
                            className="p-2 text-[#9ece6a] hover:bg-[#9ece6a]/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Bewerbung akzeptieren"
                            data-testid={`accept-application-${app.id}`}
                          >
                            {processingId === app.id ? (
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredApplications.length === 0 ? (
          <div className="bg-[#16161e] border border-[#292e42] rounded-xl p-8 text-center text-[#565f89]">
            {searchQuery || statusFilter !== 'all' 
              ? 'Keine Bewerbungen gefunden' 
              : 'Noch keine Bewerbungen vorhanden'}
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className={`bg-[#16161e] border rounded-xl p-4 ${
                selectedIds.includes(app.id) ? 'border-[#7aa2f7] bg-[#7aa2f7]/5' : 'border-[#292e42]'
              }`}
              data-testid={`application-card-${app.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {app.status === 'Neu' && (
                    <button
                      onClick={() => toggleSelection(app.id)}
                      className="text-[#7aa2f7] hover:text-[#7dcfff] transition-colors flex-shrink-0"
                      data-testid={`checkbox-mobile-${app.id}`}
                    >
                      {selectedIds.includes(app.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                    </button>
                  )}
                  <div>
                    <p className="text-[#c0caf5] font-medium">{app.name}</p>
                    <p className="text-xs text-[#565f89] mt-0.5">{formatDate(app.created_at)}</p>
                  </div>
                </div>
                {getStatusBadge(app.status)}
              </div>
              <p className="text-sm text-[#9aa5ce] mb-1 truncate">{app.email}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#292e42]">
                <span className="px-2.5 py-1 bg-[#bb9af7]/10 text-[#bb9af7] rounded-full text-xs font-medium">
                  {app.position}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openAppDetail(app)} className="p-2 text-[#7dcfff] hover:bg-[#7dcfff]/10 rounded-lg" data-testid={`view-application-mobile-${app.id}`}>
                    <Eye size={18} />
                  </button>
                  {app.status === 'Neu' && (
                    <button onClick={() => handleAccept(app)} disabled={processingId === app.id} className="p-2 text-[#9ece6a] hover:bg-[#9ece6a]/10 rounded-lg disabled:opacity-50" data-testid={`accept-application-mobile-${app.id}`}>
                      {processingId === app.id ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#9ece6a]"></div> : <UserCheck size={18} />}
                    </button>
                  )}
                  <button onClick={() => handleDelete(app.id)} className="p-2 text-[#f7768e] hover:bg-[#f7768e]/10 rounded-lg" data-testid={`delete-application-mobile-${app.id}`}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <p className="text-[#c0caf5] break-all">{selectedApp.email}</p>
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

              {/* Quiz Answers */}
              {selectedApp.quiz_completed && (
                <div>
                  <h3 className="text-lg font-semibold text-[#c0caf5] mb-4 flex items-center gap-2">
                    <ClipboardList size={18} className="text-[#bb9af7]" />
                    Quiz-Antworten
                  </h3>
                  {loadingQuiz ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#7aa2f7]"></div>
                    </div>
                  ) : quizAnswers?.completed ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto bg-[#1a1b26] rounded-lg p-4">
                      {quizAnswers.answers.map((a) => (
                        <div key={a.question_id} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2 border-b border-[#292e42] last:border-0">
                          <span className="text-xs text-[#565f89] sm:w-48 flex-shrink-0">{QUIZ_QUESTIONS[a.question_id] || `Frage ${a.question_id}`}</span>
                          <span className="text-sm text-[#c0caf5]">{a.answer}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#565f89]">Quiz noch nicht abgeschlossen</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#292e42] flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-6 py-2 bg-[#292e42] text-[#c0caf5] rounded-lg hover:bg-[#414868] transition-colors"
              >
                Schließen
              </button>
              {selectedApp.status === 'Neu' && (
                <button
                  onClick={() => {
                    handleAccept(selectedApp);
                    setSelectedApp(null);
                  }}
                  className="px-6 py-2 bg-[#9ece6a] text-white rounded-lg hover:bg-[#9ece6a]/80 transition-colors flex items-center justify-center gap-2"
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
    </div>
  );
};

export default AdminApplications;
