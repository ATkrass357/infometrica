import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Smartphone, 
  Monitor, 
  Globe, 
  Zap, 
  Users, 
  Shield, 
  Target,
  ArrowRight,
  Clock,
  Award,
  BarChart
} from 'lucide-react';

const Dienstleistungen = () => {
  const mainServices = [
    {
      icon: CheckCircle2,
      title: 'Funktionales Testing',
      description: 'Umfassende Überprüfung aller Funktionen Ihrer Anwendung. Wir testen jeden Button, jede Eingabe und jeden Workflow, um sicherzustellen, dass alles wie erwartet funktioniert.',
      features: [
        'Unit Testing & Integration Testing',
        'End-to-End Testing',
        'Regression Testing',
        'Smoke Testing',
      ],
      image: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d',
    },
    {
      icon: Users,
      title: 'Usability Testing',
      description: 'Bewertung der Benutzerfreundlichkeit durch echte Nutzer. Wir identifizieren Schwachstellen in der User Experience und optimieren die Bedienbarkeit Ihrer App.',
      features: [
        'User Experience Analyse',
        'A/B Testing',
        'Accessibility Testing',
        'Interface Design Review',
      ],
      image: 'https://images.unsplash.com/photo-1590649681928-4b179f773bd5',
    },
    {
      icon: Zap,
      title: 'Performance Testing',
      description: 'Analyse der Geschwindigkeit, Stabilität und Skalierbarkeit. Wir stellen sicher, dass Ihre App auch unter Hochlast schnell und zuverlässig läuft.',
      features: [
        'Load Testing & Stress Testing',
        'Response Time Analyse',
        'Skalierbarkeits-Tests',
        'Memory & CPU Profiling',
      ],
      image: 'https://images.unsplash.com/photo-1560264418-c4445382edbc',
    },
    {
      icon: Shield,
      title: 'Security Testing',
      description: 'Identifikation von Sicherheitslücken und Schwachstellen. Wir schützen Ihre App vor Bedrohungen und stellen die Datensicherheit sicher.',
      features: [
        'Penetration Testing',
        'Vulnerability Assessment',
        'OWASP Top 10 Prüfung',
        'Datenschutz-Compliance',
      ],
      image: 'https://images.pexels.com/photos/5324970/pexels-photo-5324970.jpeg',
    },
  ];

  const platforms = [
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'iOS & Android Testing',
    },
    {
      icon: Monitor,
      title: 'Web Apps',
      description: 'Browser & Desktop Testing',
    },
    {
      icon: Globe,
      title: 'Cloud Apps',
      description: 'SaaS & Cloud-native',
    },
  ];

  const process = [
    {
      number: '01',
      title: 'Analyse',
      description: 'Wir analysieren Ihre App und definieren die Testing-Strategie',
    },
    {
      number: '02',
      title: 'Planung',
      description: 'Erstellung detaillierter Test-Cases und Zeitpläne',
    },
    {
      number: '03',
      title: 'Durchführung',
      description: 'Systematische Tests durch unser Experten-Team',
    },
    {
      number: '04',
      title: 'Reporting',
      description: 'Detaillierte Berichte mit Handlungsempfehlungen',
    },
  ];

  const benefits = [
    { icon: Clock, text: 'Schnellere Time-to-Market' },
    { icon: Award, text: 'Höhere Software-Qualität' },
    { icon: Users, text: 'Bessere User Experience' },
    { icon: BarChart, text: 'Reduzierte Fehlerkosten' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6">
            Unsere Dienstleistungen
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Application Testing{' '}
            <span className="text-orange-500">Fachgebiete</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Umfassende Testing-Lösungen für jede Phase Ihres Software-Entwicklungszyklus. 
            Von der Funktionalität bis zur Sicherheit – wir haben alles abgedeckt.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-20">
          {mainServices.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  !isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`${!isEven ? 'lg:order-2' : ''}`}>
                  <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-orange-500" size={32} />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle2 className="text-orange-500 flex-shrink-0" size={20} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/kontakt"
                    className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
                  >
                    Mehr erfahren
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                </div>

                <div className={`${!isEven ? 'lg:order-1' : ''}`}>
                  <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-[400px] object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Plattform-<span className="text-orange-500">Expertise</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Wir testen auf allen relevanten Plattformen und Geräten
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
                >
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-orange-500" size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {platform.title}
                  </h3>
                  <p className="text-gray-600">{platform.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Unser <span className="text-orange-500">Prozess</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Strukturiert, effizient und transparent – so arbeiten wir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-orange-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Ihre <span className="text-orange-500">Vorteile</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Was Sie von unseren Testing-Services erwarten können
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm text-center transform hover:scale-105 transition-transform duration-200"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-orange-500" size={28} />
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Bereit für perfekte Software?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Lassen Sie uns gemeinsam die Qualität Ihrer Anwendungen auf das nächste Level bringen.
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-2xl"
          >
            Projekt besprechen
            <ArrowRight className="ml-2" size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dienstleistungen;
