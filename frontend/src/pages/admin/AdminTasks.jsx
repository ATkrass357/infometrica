import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  Plus, 
  Trash2, 
  Clock, 
  User, 
  Globe, 
  ListChecks,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Link,
  KeyRound
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedTask, setExpandedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    website: '',
    einleitung: '',
    schritt1: '',
    schritt2: '',
    schritt3: '',
    assigned_to: '',
    priority: 'Normal',
    due_date: '',
    test_ident_link: '',
    test_login_email: '',
    test_login_password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [tasksRes, employeesRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/tasks`, { headers }),
        axios.get(`${BACKEND_URL}/api/admin/employees`, { headers })
      ]);
      
      setTasks(tasksRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.assigned_to) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.post(`${BACKEND_URL}/api/admin/tasks`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Aufgabe erfolgreich erstellt');
      setShowForm(false);
      setFormData({
        title: '',
        website: '',
        einleitung: '',
        schritt1: '',
        schritt2: '',
        schritt3: '',
        assigned_to: '',
        priority: 'Normal',
        due_date: '',
        test_ident_link: '',
        test_login_email: '',
        test_login_password: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Fehler beim Erstellen der Aufgabe');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Möchten Sie diese Aufgabe wirklich löschen?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${BACKEND_URL}/api/admin/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Aufgabe gelöscht');
      fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Fehler beim Löschen');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Offen': return 'bg-orange-500/20 text-orange-400';
      case 'In Bearbeitung': return 'bg-blue-500/20 text-blue-400';
      case 'Abgeschlossen': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Hoch': return 'bg-red-500/20 text-red-400';
      case 'Normal': return 'bg-blue-500/20 text-blue-400';
      case 'Niedrig': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
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
    <div className="space-y-6" data-testid="admin-tasks-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#c0caf5]">Aufgabenverwaltung</h1>
          <p className="text-[#9aa5ce] mt-1">{tasks.length} Aufgabe(n) insgesamt</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-[#292e42] text-[#c0caf5] rounded-lg hover:bg-[#343b58] transition-colors"
            data-testid="refresh-tasks-btn"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">Aktualisieren</span>
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7aa2f7] text-white rounded-lg hover:bg-[#6b93e8] transition-colors"
            data-testid="create-task-btn"
          >
            <Plus size={18} />
            <span>Neue Aufgabe</span>
          </button>
        </div>
      </div>

      {/* Create Task Form */}
      {showForm && (
        <div className="bg-[#16161e] border border-[#292e42] rounded-xl p-6" data-testid="create-task-form">
          <h2 className="text-lg font-semibold text-[#c0caf5] mb-4">Neue Aufgabe erstellen</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                  Titel *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                  placeholder="Aufgabentitel eingeben"
                  data-testid="task-title-input"
                  required
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                  placeholder="https://example.com"
                  data-testid="task-website-input"
                />
              </div>

              {/* Assign To */}
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                  Zuweisen an *
                </label>
                <select
                  value={formData.assigned_to}
                  onChange={(e) => setFormData({...formData, assigned_to: e.target.value})}
                  className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                  data-testid="task-assignee-select"
                  required
                >
                  <option value="">Mitarbeiter auswählen</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.position})
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                  Priorität
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                  data-testid="task-priority-select"
                >
                  <option value="Niedrig">Niedrig</option>
                  <option value="Normal">Normal</option>
                  <option value="Hoch">Hoch</option>
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                  Fälligkeitsdatum
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                  className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                  data-testid="task-duedate-input"
                />
              </div>
            </div>

            {/* Test Credentials Section */}
            <div className="border-t border-[#292e42] pt-4 mt-4">
              <h3 className="text-[#c0caf5] font-medium mb-3">Test-Zugangsdaten (Optional)</h3>
              
              <div className="space-y-4">
                {/* Test Ident Link */}
                <div>
                  <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                    Test Ident Link
                  </label>
                  <input
                    type="url"
                    value={formData.test_ident_link}
                    onChange={(e) => setFormData({...formData, test_ident_link: e.target.value})}
                    className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                    placeholder="https://example.com/test-ident/..."
                    data-testid="task-test-ident-link-input"
                  />
                  <p className="text-xs text-[#565f89] mt-1">Ein direkter Link für den Test-Zugang</p>
                </div>

                {/* Test Login Daten */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                      Test Login E-Mail
                    </label>
                    <input
                      type="email"
                      value={formData.test_login_email}
                      onChange={(e) => setFormData({...formData, test_login_email: e.target.value})}
                      className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                      placeholder="test@example.com"
                      data-testid="task-test-login-email-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                      Test Login Passwort
                    </label>
                    <input
                      type="text"
                      value={formData.test_login_password}
                      onChange={(e) => setFormData({...formData, test_login_password: e.target.value})}
                      className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                      placeholder="Passwort"
                      data-testid="task-test-login-password-input"
                    />
                  </div>
                </div>
                <p className="text-xs text-[#565f89]">E-Mail und Passwort für den Test-Login des Mitarbeiters</p>
              </div>
            </div>

            {/* Description Section */}
            <div className="border-t border-[#292e42] pt-4 mt-4">
              <h3 className="text-[#c0caf5] font-medium mb-3">Aufgabenbeschreibung</h3>
              
              <div className="space-y-4">
                {/* Einleitung */}
                <div>
                  <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                    Einleitung
                  </label>
                  <textarea
                    value={formData.einleitung}
                    onChange={(e) => setFormData({...formData, einleitung: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7] resize-none"
                    placeholder="Allgemeine Einführung zur Aufgabe..."
                    data-testid="task-einleitung-input"
                  />
                </div>

                {/* Schritt 1 */}
                <div>
                  <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                    Schritt 1
                  </label>
                  <textarea
                    value={formData.schritt1}
                    onChange={(e) => setFormData({...formData, schritt1: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7] resize-none"
                    placeholder="Erster Schritt der Aufgabe..."
                    data-testid="task-schritt1-input"
                  />
                </div>

                {/* Schritt 2 */}
                <div>
                  <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                    Schritt 2
                  </label>
                  <textarea
                    value={formData.schritt2}
                    onChange={(e) => setFormData({...formData, schritt2: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7] resize-none"
                    placeholder="Zweiter Schritt der Aufgabe..."
                    data-testid="task-schritt2-input"
                  />
                </div>

                {/* Schritt 3 */}
                <div>
                  <label className="block text-sm font-medium text-[#9aa5ce] mb-1">
                    Schritt 3
                  </label>
                  <textarea
                    value={formData.schritt3}
                    onChange={(e) => setFormData({...formData, schritt3: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 bg-[#1a1b26] border border-[#292e42] rounded-lg text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7] resize-none"
                    placeholder="Dritter Schritt der Aufgabe..."
                    data-testid="task-schritt3-input"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-[#9aa5ce] hover:text-[#c0caf5] transition-colors"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-[#7aa2f7] text-white rounded-lg hover:bg-[#6b93e8] transition-colors disabled:opacity-50"
                data-testid="submit-task-btn"
              >
                {submitting ? 'Wird erstellt...' : 'Aufgabe erstellen'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* No Employees Warning */}
      {employees.length === 0 && (
        <div className="bg-[#f7768e]/10 border border-[#f7768e]/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-[#f7768e] flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-medium text-[#f7768e]">Keine Mitarbeiter vorhanden</h3>
            <p className="text-sm text-[#9aa5ce] mt-1">
              Es sind noch keine Mitarbeiter im System registriert. Bitte erstellen Sie zuerst einen Test-Mitarbeiter.
            </p>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4" data-testid="tasks-list">
        {tasks.length === 0 ? (
          <div className="bg-[#16161e] border border-[#292e42] rounded-xl p-12 text-center">
            <ListChecks size={48} className="mx-auto mb-4 text-[#565f89]" />
            <h3 className="text-lg font-medium text-[#c0caf5] mb-2">Keine Aufgaben vorhanden</h3>
            <p className="text-[#9aa5ce]">Erstellen Sie Ihre erste Aufgabe mit dem Button oben.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-[#16161e] border border-[#292e42] rounded-xl overflow-hidden"
              data-testid={`task-card-${task.id}`}
            >
              {/* Task Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#c0caf5]">{task.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#9aa5ce]">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{task.assigned_to_name || 'Nicht zugewiesen'}</span>
                    </div>
                    {task.website && (
                      <a 
                        href={task.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#7aa2f7] hover:underline"
                      >
                        <Globe size={14} />
                        <span>Website</span>
                      </a>
                    )}
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Fällig: {task.due_date}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    className="p-2 text-[#9aa5ce] hover:text-[#c0caf5] hover:bg-[#292e42] rounded-lg transition-colors"
                    data-testid={`expand-task-${task.id}`}
                  >
                    {expandedTask === task.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-[#f7768e] hover:bg-[#f7768e]/10 rounded-lg transition-colors"
                    data-testid={`delete-task-${task.id}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedTask === task.id && (
                <div className="border-t border-[#292e42] p-4 bg-[#1a1b26]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {task.einleitung && (
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-[#bb9af7] mb-1">Einleitung</h4>
                        <p className="text-[#c0caf5] text-sm bg-[#16161e] p-3 rounded-lg">{task.einleitung}</p>
                      </div>
                    )}
                    {task.schritt1 && (
                      <div>
                        <h4 className="text-sm font-medium text-[#7aa2f7] mb-1">Schritt 1</h4>
                        <p className="text-[#c0caf5] text-sm bg-[#16161e] p-3 rounded-lg">{task.schritt1}</p>
                      </div>
                    )}
                    {task.schritt2 && (
                      <div>
                        <h4 className="text-sm font-medium text-[#7dcfff] mb-1">Schritt 2</h4>
                        <p className="text-[#c0caf5] text-sm bg-[#16161e] p-3 rounded-lg">{task.schritt2}</p>
                      </div>
                    )}
                    {task.schritt3 && (
                      <div className="md:col-span-2">
                        <h4 className="text-sm font-medium text-[#9ece6a] mb-1">Schritt 3</h4>
                        <p className="text-[#c0caf5] text-sm bg-[#16161e] p-3 rounded-lg">{task.schritt3}</p>
                      </div>
                    )}
                    {!task.einleitung && !task.schritt1 && !task.schritt2 && !task.schritt3 && (
                      <p className="text-[#565f89] italic">Keine Beschreibung vorhanden</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTasks;
