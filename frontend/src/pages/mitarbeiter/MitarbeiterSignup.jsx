import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/7bea0805-458a-46a4-83aa-a7ef43569440/images/31c2d350dad6978320d16680435185ac4d3ed1b7bc213f06a2774d3ee186a694.png";

const MitarbeiterSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/api/applications/submit`, {
        full_name: formData.name,
        email: formData.email,
        password: formData.password,
        position: 'Bewerber',
        motivation: 'Registrierung über Mitarbeiter-Signup',
        experience: '',
        mobilnummer: '',
        strasse: '',
        plz: '',
        stadt: '',
        geburtsdatum: '',
      });

      setSuccess(true);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.detail?.includes('existiert bereits')) {
        setError('Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich an.');
      } else {
        setError(err.response?.data?.detail || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8F5E9] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-[#00C853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#00C853]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">Konto erstellt!</h2>
            <p className="text-slate-600 mb-6">
              Ihr Mitarbeiter-Konto wurde erfolgreich erstellt. Sie können sich jetzt anmelden.
            </p>
            <Link
              to="/mitarbeiter/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#00C853] text-white font-semibold rounded-lg hover:bg-[#00B848] transition-colors"
            >
              Zum Login
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#E8F5E9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={LOGO_URL} alt="Precision Labs" className="h-12" />
            <span className="text-2xl font-bold text-[#0A0A0A]">
              Precision <span className="text-[#00C853]">Labs</span>
            </span>
          </Link>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#0A0A0A] mb-2">Mitarbeiter-Konto erstellen</h1>
            <p className="text-slate-600">
              Erstellen Sie jetzt ein Mitarbeiter Konto um Ihre Bewerbung zu verfolgen
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Vollständiger Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Max Mustermann"
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent transition-all"
                  data-testid="signup-name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                E-Mail-Adresse
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ihre@email.de"
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent transition-all"
                  data-testid="signup-email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mindestens 6 Zeichen"
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent transition-all"
                  data-testid="signup-password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-2">
                Passwort bestätigen
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="Passwort wiederholen"
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C853] focus:border-transparent transition-all"
                  data-testid="signup-password-confirm"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#00C853] text-white font-semibold rounded-lg hover:bg-[#00B848] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="signup-submit"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Wird erstellt...
                </>
              ) : (
                <>
                  Konto erstellen
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600">
              Bereits ein Konto?{' '}
              <Link
                to="/mitarbeiter/login"
                className="text-[#00C853] font-semibold hover:underline"
              >
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-slate-500 hover:text-[#00C853] transition-colors text-sm"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MitarbeiterSignup;
