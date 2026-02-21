import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, Target, Award, TrendingUp } from 'lucide-react';

const Home = () => {
  const services = [
    {
      icon: CheckCircle2,
      title: 'Funktionales Testing',
      description: 'Umfassende Tests aller Funktionen Ihrer Anwendung für optimale Leistung und Zuverlässigkeit.',
    },
    {
      icon: Users,
      title: 'Usability Testing',
      description: 'Bewertung der Benutzerfreundlichkeit und Optimierung der User Experience für maximale Zufriedenheit.',
    },
    {
      icon: Target,
      title: 'Performance Testing',
      description: 'Analyse und Optimierung der Ladezeiten, Skalierbarkeit und Systemstabilität Ihrer Apps.',
    },
    {
      icon: Award,
      title: 'Qualitätssicherung',
      description: 'Kontinuierliche QA-Prozesse für höchste Qualitätsstandards in allen Entwicklungsphasen.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Getestete Apps' },
    { number: '98%', label: 'Kundenzufriedenheit' },
    { number: '15+', label: 'Jahre Erfahrung' },
    { number: '50+', label: 'Experten Team' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 opacity-60"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                Professionelle App-Testing Lösungen
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Qualität, die Ihre Apps
                <span className="text-orange-500"> perfekt macht</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Wir sind Ihre Experten für Application Testing. Mit modernsten Methoden 
                und jahrelanger Erfahrung sorgen wir dafür, dass Ihre Anwendungen fehlerfrei, 
                sicher und benutzerfreundlich sind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/kontakt"
                  className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Kostenlose Beratung
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/dienstleistungen"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold border-2 border-gray-200 hover:border-orange-500 hover:text-orange-500 transition-all duration-200"
                >
                  Mehr erfahren
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1629904853716-f0bc54eea481"
                  alt="Professional Testing Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-500 rounded-2xl opacity-20 blur-2xl"></div>
              <div className="absolute -top-6 -right-6 w-40 h-40 bg-orange-300 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition-transform duration-200"
              >
                <div className="text-4xl lg:text-5xl font-bold text-orange-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Unsere <span className="text-orange-500">Dienstleistungen</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Umfassende Testing-Lösungen für Ihre Anwendungen – von der Funktionalität 
              bis zur Performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="text-orange-500" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/dienstleistungen"
              className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Alle Dienstleistungen ansehen
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/5324970/pexels-photo-5324970.jpeg"
                  alt="Team Collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Warum <span className="text-orange-500">Infometrica?</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Mit über 15 Jahren Erfahrung im Application Testing sind wir Ihr 
                verlässlicher Partner für Qualitätssicherung.
              </p>
              
              <div className="space-y-4">
                {[
                  'Erfahrenes Team mit zertifizierten Test-Experten',
                  'Modernste Testing-Tools und Methoden',
                  'Individuelle Lösungen für Ihre Anforderungen',
                  'Transparente Kommunikation und Reporting',
                  'Schnelle Reaktionszeiten und flexibler Support',
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="text-orange-500 flex-shrink-0 mt-1" size={24} />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/unternehmen"
                className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg mt-6"
              >
                Mehr über uns
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Bereit für fehlerfreie Apps?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Kontaktieren Sie uns noch heute für eine kostenlose Erstberatung 
            und erfahren Sie, wie wir Ihre Anwendungen auf das nächste Level bringen.
          </p>
          <Link
            to="/kontakt"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-orange-600 rounded-xl font-bold text-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-2xl"
          >
            Jetzt Kontakt aufnehmen
            <ArrowRight className="ml-2" size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
