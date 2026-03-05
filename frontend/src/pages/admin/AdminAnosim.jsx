import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  Phone, 
  RefreshCw, 
  User, 
  Search, 
  X, 
  Check, 
  Plus,
  Trash2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminAnosim = () => {
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [employeesRes, assignmentsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/employees`, { headers }),
        axios.get(`${BACKEND_URL}/api/anosim/assignments`, { headers })
      ]);
      
      setEmployees(employeesRes.data);
      setAssignments(assignmentsRes.data.assignments || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const assignNumber = async () => {
    if (!selectedEmployee || !newNumber.trim()) {
      toast.error('Bitte wählen Sie einen Mitarbeiter und geben Sie eine Nummer ein');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(
        `${BACKEND_URL}/api/anosim/assign`,
        {
          employee_id: selectedEmployee.id,
          anosim_number: newNumber.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Nummer ${newNumber} wurde ${selectedEmployee.name} zugewiesen`);
      setShowAssignModal(false);
      setSelectedEmployee(null);
      setNewNumber('');
      fetchData();
    } catch (error) {
      console.error('Error assigning number:', error);
      toast.error(error.response?.data?.detail || 'Fehler beim Zuweisen der Nummer');
    } finally {
      setSubmitting(false);
    }
  };

  const removeNumber = async (employeeId, employeeName) => {
    if (!window.confirm(`Möchten Sie die Anosim-Nummer von ${employeeName} wirklich entfernen?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(
        `${BACKEND_URL}/api/anosim/unassign`,
        { employee_id: employeeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Nummer erfolgreich entfernt');
      fetchData();
    } catch (error) {
      console.error('Error removing number:', error);
      toast.error('Fehler beim Entfernen der Nummer');
    }
  };

  // Get employees without assigned numbers
  const availableEmployees = employees.filter(
    emp => !assignments.find(a => a.id === emp.id)
  );

  // Filter assignments by search
  const filteredAssignments = assignments.filter(a => 
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.anosim_number?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7aa2f7]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-anosim-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#c0caf5]">Anosim Nummernverwaltung</h1>
          <p className="text-[#9aa5ce] mt-1">
            {assignments.length} Nummer(n) zugewiesen • {availableEmployees.length} Mitarbeiter verfügbar
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-[#292e42] text-[#c0caf5] rounded-lg hover:bg-[#343b58] transition-colors"
            data-testid="refresh-btn"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Aktualisieren</span>
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            disabled={availableEmployees.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#9ece6a] text-[#1a1b26] rounded-lg hover:bg-[#9ece6a]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="assign-number-btn"
          >
            <Plus size={18} />
            <span>Nummer zuweisen</span>
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-[#7aa2f7]/10 border border-[#7aa2f7]/30 rounded-xl p-4 flex items-start gap-3">
        <MessageSquare className="text-[#7aa2f7] flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h3 className="font-medium text-[#c0caf5]">So funktioniert's</h3>
          <p className="text-sm text-[#9aa5ce] mt-1">
            Weisen Sie einem Mitarbeiter eine Anosim-Nummer zu. Der Mitarbeiter sieht dann im Auftragsbereich 
            (wenn ein Auftrag "In Bearbeitung" ist) automatisch alle SMS-Codes, die auf dieser Nummer eingehen.
          </p>
        </div>
      </div>

      {/* Search */}
      {assignments.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#565f89]" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Suchen nach Name, E-Mail oder Nummer..."
            className="w-full pl-10 pr-4 py-3 bg-[#16161e] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
            data-testid="search-input"
          />
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4" data-testid="assignments-list">
        {filteredAssignments.length === 0 ? (
          <div className="bg-[#16161e] border border-[#292e42] rounded-xl p-12 text-center">
            <Phone size={48} className="mx-auto mb-4 text-[#565f89]" />
            <h3 className="text-lg font-medium text-[#c0caf5] mb-2">
              {searchTerm ? 'Keine Ergebnisse' : 'Keine Nummern zugewiesen'}
            </h3>
            <p className="text-[#9aa5ce]">
              {searchTerm 
                ? 'Versuchen Sie einen anderen Suchbegriff.' 
                : 'Klicken Sie auf "Nummer zuweisen" um einem Mitarbeiter eine Anosim-Nummer zuzuweisen.'}
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-[#16161e] border border-[#292e42] rounded-xl p-5 flex items-center justify-between hover:border-[#343b58] transition-colors"
              data-testid={`assignment-${assignment.id}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#9ece6a]/10 rounded-full flex items-center justify-center">
                  <Phone size={24} className="text-[#9ece6a]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#c0caf5]">{assignment.name}</h3>
                  <p className="text-sm text-[#9aa5ce]">{assignment.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-mono font-bold text-[#9ece6a]">{assignment.anosim_number}</p>
                  <p className="text-xs text-[#565f89]">Anosim Nummer</p>
                </div>
                <button
                  onClick={() => removeNumber(assignment.id, assignment.name)}
                  className="p-2 text-[#f7768e] hover:bg-[#f7768e]/10 rounded-lg transition-colors"
                  title="Nummer entfernen"
                  data-testid={`remove-${assignment.id}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* No Available Employees Warning */}
      {availableEmployees.length === 0 && assignments.length > 0 && (
        <div className="bg-[#e0af68]/10 border border-[#e0af68]/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-[#e0af68] flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-[#e0af68]">Alle Mitarbeiter haben Nummern</h3>
            <p className="text-sm text-[#9aa5ce] mt-1">
              Alle aktiven Mitarbeiter haben bereits eine Anosim-Nummer zugewiesen bekommen.
            </p>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1b26] border border-[#292e42] rounded-xl w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#292e42]">
              <div className="flex items-center gap-3">
                <Phone className="text-[#9ece6a]" size={24} />
                <h3 className="text-xl font-bold text-[#c0caf5]">Nummer zuweisen</h3>
              </div>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedEmployee(null);
                  setNewNumber('');
                }}
                className="p-2 text-[#565f89] hover:text-[#c0caf5] hover:bg-[#292e42] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Employee Selection */}
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-2">
                  Mitarbeiter auswählen
                </label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {availableEmployees.map((emp, idx) => (
                    <div
                      key={`emp-${emp.id}-${idx}`}
                      onClick={() => setSelectedEmployee(emp)}
                      className={`p-4 rounded-lg cursor-pointer transition-all border ${
                        selectedEmployee?.id === emp.id
                          ? 'bg-[#7aa2f7]/10 border-[#7aa2f7]'
                          : 'bg-[#16161e] border-[#292e42] hover:border-[#565f89]'
                      }`}
                      data-testid={`select-employee-${emp.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                            selectedEmployee?.id === emp.id
                              ? 'bg-[#7aa2f7] border-[#7aa2f7]'
                              : 'border-[#565f89]'
                          }`}>
                            {selectedEmployee?.id === emp.id && <Check size={14} className="text-white" />}
                          </div>
                          <div>
                            <p className="text-[#c0caf5] font-medium">{emp.name}</p>
                            <p className="text-[#565f89] text-sm">{emp.email}</p>
                          </div>
                        </div>
                        <span className="text-[#9aa5ce] text-sm">{emp.position}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phone Number Input */}
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-2">
                  Anosim Telefonnummer
                </label>
                <input
                  type="tel"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="+49 123 4567890"
                  className="w-full px-4 py-3 bg-[#16161e] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7] font-mono"
                  data-testid="phone-input"
                />
                <p className="text-xs text-[#565f89] mt-2">
                  Geben Sie die Anosim-Nummer ein, die diesem Mitarbeiter zugewiesen werden soll.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[#292e42]">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedEmployee(null);
                  setNewNumber('');
                }}
                className="px-6 py-2 text-[#9aa5ce] hover:text-[#c0caf5] font-medium transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={assignNumber}
                disabled={!selectedEmployee || !newNumber.trim() || submitting}
                className="flex items-center gap-2 px-6 py-2 bg-[#9ece6a] text-[#1a1b26] font-semibold rounded-lg hover:bg-[#9ece6a]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="confirm-assign-btn"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Wird zugewiesen...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Zuweisen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnosim;
