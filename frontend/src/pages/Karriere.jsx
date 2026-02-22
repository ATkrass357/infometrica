import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp, 
  Heart,
  Coffee,
  GraduationCap,
  Upload,
  Send,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  X,
  ExternalLink,
  Copy,
  PartyPopper
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const Karriere = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    mobilnummer: '',
    geburtsdatum: '',
    staatsangehoerigkeit: '',
    strasse: '',
    postleitzahl: '',
    stadt: '',
    position: '',
    cv: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Get the login URL dynamically
  const getLoginUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/mitarbeiter/login`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link kopiert!');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        cv: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Die Passwörter stimmen nicht überein');
      return;
    }
    
    // Validate password strength
    if (formData.password.length < 8) {
      toast.error('Das Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Prepare application data (without file for now)
      const applicationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobilnummer: formData.mobilnummer,
        geburtsdatum: formData.geburtsdatum,
        staatsangehoerigkeit: formData.staatsangehoerigkeit,
        strasse: formData.strasse,
        postleitzahl: formData.postleitzahl,
        stadt: formData.stadt,
        position: formData.position,
        message: formData.message,
        cv_filename: formData.cv ? formData.cv.name : null,
      };

      // Submit to backend
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/applications/submit`,
        applicationData
      );

      // Save email for modal and show success popup
      setSubmittedEmail(formData.email);
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
        mobilnummer: '',
        geburtsdatum: '',
        staatsangehoerigkeit: '',
        strasse: '',
        postleitzahl: '',
        stadt: '',
        position: '',
        message: '',
        cv: null,
      });
      
      // Reset file input
      const fileInput = document.getElementById('cv');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMsg = error.response?.data?.detail || 'Bitte versuchen Sie es später erneut.';
      toast.error('Fehler beim Senden der Bewerbung', {
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPositions = [
    {
      title: 'Web Application Tester',
      location: 'Remote / Homeoffice',
      type: 'Minijob',
      description: 'Assistent für Evaluierungen im Homeoffice - Überprüfung von Apps und Software.',
      requirements: [
        'Interesse an App- und Software-Testing',
        'Zuverlässige und selbstständige Arbeitsweise',
        'Gute Deutschkenntnisse',
        'PC/Laptop und stabile Internetverbindung',
      ],
    },
    {
      title: 'QA Engineer',
      location: 'Berlin / Remote',
      type: 'Vollzeit',
      description: 'QA Engineer für spannende Testing-Projekte gesucht.',
      requirements: [
        'Grundkenntnisse im Software Testing',
        'Interesse an Testautomatisierung',
        'Teamfähigkeit und Kommunikationsstärke',
        'Gute Deutschkenntnisse',
      ],
    },
    {
      title: 'Mobile App Tester',
      location: 'Berlin / Remote',
      type: 'Vollzeit / Teilzeit',
      description: 'Tester für iOS und Android Apps.',
      requirements: [
        'Eigenes Smartphone (iOS oder Android)',
        'Interesse an mobilen Apps',
        'Genaue und strukturierte Arbeitsweise',
        'Keine Vorkenntnisse erforderlich',
      ],
    },
    {
      title: 'Junior Test Analyst',
      location: 'Berlin / Remote',
      type: 'Vollzeit',
      description: 'Einstiegsposition für motivierte Testing-Einsteiger.',
      requirements: [
        'Keine Berufserfahrung notwendig',
        'Lernbereitschaft und Neugier',
        'Analytisches Denken',
        'Gute Deutschkenntnisse',
      ],
    },
    {
      title: 'Werkstudent Testing',
      location: 'Berlin / Remote',
      type: 'Teilzeit',
      description: 'Idealer Nebenjob für Studierende.',
      requirements: [
        'Eingeschriebener Student (m/w/d)',
        'Flexible Zeiteinteilung möglich',
        'Interesse an Softwarequalität',
        'Grundlegende PC-Kenntnisse',
      ],
    },
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Karriereentwicklung',
      description: 'Individuelle Weiterbildung und Zertifizierungen',
    },
    {
      icon: Users,
      title: 'Tolles Team',
      description: 'Arbeiten mit erfahrenen Experten',
    },
    {
      icon: Coffee,
      title: 'Work-Life-Balance',
      description: 'Flexible Arbeitszeiten und Home Office',
    },
    {
      icon: Heart,
      title: 'Gesundheit',
      description: 'Betriebliche Krankenversicherung',
    },
    {
      icon: GraduationCap,
      title: 'Weiterbildung',
      description: 'Konferenzen und Schulungen',
    },
    {
      icon: Briefcase,
      title: 'Moderne Tools',
      description: 'Neueste Testing-Technologien',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6">
            Karriere bei Infometrica
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Werde Teil unseres{' '}
            <span className="text-orange-500">Teams</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Arbeite mit den besten Testing-Experten und gestalte die Zukunft der 
            Softwarequalität. Bei Infometrica erwarten dich spannende Projekte und 
            hervorragende Entwicklungsmöglichkeiten.
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Warum <span className="text-orange-500">Infometrica?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Entdecke die Vorteile, die dich bei uns erwarten
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-orange-500" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Offene <span className="text-orange-500">Stellen</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Finde deine passende Position in unserem Team
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={18} className="mr-2 text-orange-500" />
                        {position.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={18} className="mr-2 text-orange-500" />
                        {position.type}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{position.description}</p>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Anforderungen:</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <CheckCircle className="text-orange-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
                            <span className="text-gray-600">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="lg:ml-6">
                    <a
                      href="#bewerbung"
                      className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors duration-200 whitespace-nowrap"
                    >
                      Jetzt bewerben
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="bewerbung" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Jetzt <span className="text-orange-500">bewerben</span>
            </h2>
            <p className="text-xl text-gray-600">
              Sende uns deine Bewerbungsunterlagen und wir melden uns zeitnah bei dir
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Persönliche Daten */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Persönliche Daten
                </h3>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Vollständiger Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Max Mustermann"
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ihre@email.de"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="mobilnummer">Mobilnummer *</Label>
                      <Input
                        id="mobilnummer"
                        name="mobilnummer"
                        type="tel"
                        value={formData.mobilnummer}
                        onChange={handleChange}
                        placeholder="+49 170 1234567"
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="geburtsdatum">Geburtsdatum *</Label>
                      <Input
                        id="geburtsdatum"
                        name="geburtsdatum"
                        type="date"
                        value={formData.geburtsdatum}
                        onChange={handleChange}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staatsangehoerigkeit">Staatsangehörigkeit *</Label>
                    <Input
                      id="staatsangehoerigkeit"
                      name="staatsangehoerigkeit"
                      value={formData.staatsangehoerigkeit}
                      onChange={handleChange}
                      placeholder="z.B. Deutsch"
                      required
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Account-Daten */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  <Lock className="inline mr-2 text-orange-500" size={20} />
                  Zugangsdaten
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Mit diesen Daten können Sie sich einloggen und den Status Ihrer Bewerbung verfolgen.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Passwort wählen *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mindestens 8 Zeichen"
                        required
                        minLength={8}
                        className="h-12 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordConfirm">Passwort bestätigen *</Label>
                    <Input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type={showPassword ? "text" : "password"}
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      placeholder="Passwort wiederholen"
                      required
                      minLength={8}
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Anschrift */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Anschrift
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="strasse">Straße und Hausnummer *</Label>
                    <Input
                      id="strasse"
                      name="strasse"
                      value={formData.strasse}
                      onChange={handleChange}
                      placeholder="Musterstraße 123"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="postleitzahl">Postleitzahl *</Label>
                      <Input
                        id="postleitzahl"
                        name="postleitzahl"
                        value={formData.postleitzahl}
                        onChange={handleChange}
                        placeholder="10115"
                        required
                        maxLength={5}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="stadt">Stadt / Ort *</Label>
                      <Input
                        id="stadt"
                        name="stadt"
                        value={formData.stadt}
                        onChange={handleChange}
                        placeholder="Berlin"
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bewerbung */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Bewerbungsdetails
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="position">Gewünschte Position *</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="z.B. Senior QA Engineer"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cv">Lebenslauf / CV *</Label>
                    <div className="relative">
                      <Input
                        id="cv"
                        name="cv"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        required
                        className="h-12 cursor-pointer"
                      />
                      <Upload className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
                    </div>
                    <p className="text-sm text-gray-500">PDF, DOC oder DOCX (max. 5 MB)</p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Wird gesendet...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Bewerbung absenden
                    <Send className="ml-2" size={20} />
                  </span>
                )}
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>
              Mit dem Absenden Ihrer Bewerbung stimmen Sie unserer{' '}
              <Link to="/datenschutz" className="text-orange-500 hover:text-orange-600 underline">
                Datenschutzerklärung
              </Link>{' '}
              zu.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Fragen zu deiner Karriere?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Unser HR-Team beantwortet gerne alle deine Fragen rund um Bewerbung und Karrieremöglichkeiten.
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-2xl"
          >
            HR-Team kontaktieren
          </Link>
        </div>
      </section>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white text-center relative">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PartyPopper size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold">Bewerbung erfolgreich!</h3>
              <p className="text-orange-100 mt-2">Vielen Dank für Ihr Interesse an Infometrica</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="text-orange-500" size={20} />
                  Nächster Schritt
                </h4>
                <p className="text-gray-600 text-sm">
                  Sie können sich ab sofort in Ihrem persönlichen Bewerberportal einloggen, 
                  um den Status Ihrer Bewerbung zu verfolgen.
                </p>
              </div>

              {/* Login Info */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Ihre Login-Daten:</h4>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">E-Mail:</span>
                    <p className="font-medium text-gray-900">{submittedEmail}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Passwort:</span>
                    <p className="font-medium text-gray-900">Das von Ihnen gewählte Passwort</p>
                  </div>
                </div>
              </div>

              {/* Login URL */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Login-Adresse:</h4>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3">
                  <code className="flex-1 text-sm text-orange-600 break-all">
                    {getLoginUrl()}
                  </code>
                  <button
                    onClick={() => copyToClipboard(getLoginUrl())}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                    title="Link kopieren"
                  >
                    <Copy size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={getLoginUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                >
                  <ExternalLink size={18} />
                  Zum Login
                </a>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Schließen
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Eine Bestätigungs-E-Mail mit allen Informationen wurde an {submittedEmail} gesendet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Karriere;
