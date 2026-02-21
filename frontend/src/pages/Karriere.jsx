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
  CheckCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const Karriere = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    // Simulate form submission (will be connected to backend later)
    setTimeout(() => {
      toast.success('Vielen Dank für Ihre Bewerbung!', {
        description: 'Wir werden Ihre Unterlagen prüfen und uns in Kürze bei Ihnen melden.',
      });
      setFormData({
        name: '',
        email: '',
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
      setIsSubmitting(false);
    }, 1500);
  };

  const openPositions = [
    {
      title: 'Senior QA Engineer',
      location: 'Berlin',
      type: 'Vollzeit',
      description: 'Erfahrener QA Engineer für komplexe Testing-Projekte gesucht.',
      requirements: [
        '5+ Jahre Erfahrung im Software Testing',
        'Expertise in Automatisierung (Selenium, Cypress)',
        'ISTQB Zertifizierung',
        'Deutsch & Englisch fließend',
      ],
    },
    {
      title: 'Mobile App Tester',
      location: 'Berlin / Remote',
      type: 'Vollzeit',
      description: 'Spezialist für iOS und Android App Testing.',
      requirements: [
        '3+ Jahre Mobile Testing Erfahrung',
        'Kenntnisse in Appium, XCTest, Espresso',
        'Verständnis für Mobile UX',
        'Agile Arbeitsweise',
      ],
    },
    {
      title: 'Junior Test Analyst',
      location: 'Berlin',
      type: 'Vollzeit',
      description: 'Einstiegsposition für motivierte Testing-Enthusiasten.',
      requirements: [
        'Abgeschlossenes Studium oder Ausbildung',
        'Grundkenntnisse in Testing-Methoden',
        'Analytisches Denken',
        'Lernbereitschaft und Teamgeist',
      ],
    },
    {
      title: 'Performance Test Engineer',
      location: 'Berlin / Remote',
      type: 'Vollzeit / Teilzeit',
      description: 'Experte für Load und Performance Testing.',
      requirements: [
        '4+ Jahre Performance Testing',
        'JMeter, Gatling, LoadRunner',
        'Monitoring Tools (New Relic, Datadog)',
        'Problemlösungskompetenz',
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ihr vollständiger Name"
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
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+49 123 456789"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    placeholder="Für welche Position?"
                    required
                    className="h-12"
                  />
                </div>
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

              <div className="space-y-2">
                <Label htmlFor="message">Anschreiben / Motivationsschreiben *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Erzählen Sie uns, warum Sie zu Infometrica passen..."
                  required
                  className="min-h-[180px] resize-none"
                />
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
    </div>
  );
};

export default Karriere;
