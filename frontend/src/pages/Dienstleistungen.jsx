import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Users, 
  Code2,
  Smartphone,
  Monitor,
  Globe,
  ArrowRight
} from 'lucide-react';

const Dienstleistungen = () => {
  const services = [
    {
      icon: Shield,
      title: 'Funktionales Testing',
      description: 'Umfassende Überprüfung aller Funktionen Ihrer Anwendung. Wir testen jeden Button, jede Eingabe und jeden Workflow.',
      features: ['Unit Testing', 'Integration Tests', 'End-to-End Testing', 'Regression Tests'],
      accent: 'bg-[#1A1A1A]',
      textColor: 'text-white',
      accentColor: 'text-[#00C853]',
    },
    {
      icon: Zap,
      title: 'Performance Testing',
      description: 'Analyse der Geschwindigkeit, Stabilität und Skalierbarkeit. Ihre App performt auch unter Hochlast.',
      features: ['Load Testing', 'Stress Testing', 'Response Time Analyse', 'Memory Profiling'],
      accent: 'bg-[#00C853]',
      textColor: 'text-white',
      accentColor: 'text-white',
    },
    {
      icon: Users,
      title: 'Usability Testing',
      description: 'Bewertung der Benutzerfreundlichkeit durch echte Nutzer. Optimierung der User Experience.',
      features: ['UX Analyse', 'A/B Testing', 'Accessibility Tests', 'Interface Review'],
      accent: 'bg-white border border-gray-200',
      textColor: 'text-[#1A1A1A]',
      accentColor: 'text-[#00C853]',
    },
    {
      icon: Code2,
      title: 'Automatisierung',
      description: 'CI/CD-Integration mit automatisierten Test-Suites. Kontinuierliche Qualitätssicherung.',
      features: ['Selenium', 'Cypress', 'Appium', 'CI/CD Integration'],
      accent: 'bg-[#F4F7F5]',
      textColor: 'text-[#1A1A1A]',
      accentColor: 'text-[#00C853]',
    },
  ];

  const platforms = [
    { icon: Smartphone, title: 'Mobile Apps', desc: 'iOS & Android' },
    { icon: Monitor, title: 'Web Apps', desc: 'Browser & Desktop' },
    { icon: Globe, title: 'Cloud Apps', desc: 'SaaS & API' },
  ];

  const process = [
    { step: '01', title: 'Analyse', desc: 'Anforderungen verstehen' },
    { step: '02', title: 'Strategie', desc: 'Testplan erstellen' },
    { step: '03', title: 'Execution', desc: 'Tests durchführen' },
    { step: '04', title: 'Reporting', desc: 'Ergebnisse liefern' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="text-[#00C853] font-semibold tracking-wide mb-4">LEISTUNGEN</div>
            <h1 className="text-5xl lg:text-7xl font-bold text-[#1A1A1A] leading-[0.95] tracking-tight mb-6">
              Testing-Services<br />
              <span className="text-[#00C853]">die überzeugen.</span>
            </h1>
            <p className="text-xl text-[#4A4A4A] leading-relaxed">
              Von funktionalen Tests bis zur Performance-Optimierung – wir bieten 
              das komplette Spektrum professioneller Qualitätssicherung.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 lg:px-12 bg-[#F4F7F5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`${service.accent} p-10 transition-all duration-300 hover:shadow-xl rounded-lg`}
                >
                  <Icon className={service.accentColor} size={48} strokeWidth={1.5} />
                  <h3 className={`text-2xl font-bold ${service.textColor} mt-6 mb-4`}>
                    {service.title}
                  </h3>
                  <p className={`${service.textColor} opacity-80 mb-6 leading-relaxed`}>
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                          service.accent === 'bg-[#1A1A1A]' 
                            ? 'bg-[#2A2A2A] text-gray-300' 
                            : service.accent === 'bg-[#00C853]'
                            ? 'bg-[#009624] text-white'
                            : 'bg-white text-[#4A4A4A] border border-gray-200'
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00C853] font-semibold tracking-wide mb-4">PLATTFORMEN</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
              Alle Plattformen. Ein Partner.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <div
                  key={index}
                  className="text-center p-12 border border-gray-200 hover:border-[#00C853] transition-colors duration-300 rounded-lg"
                >
                  <div className="w-20 h-20 bg-[#1A1A1A] rounded-md flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-[#00C853]" size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">{platform.title}</h3>
                  <p className="text-[#4A4A4A]">{platform.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 px-6 lg:px-12 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00C853] font-semibold tracking-wide mb-4">PROZESS</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Strukturiert zum Erfolg
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl font-bold text-[#00C853] mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-12 bg-[#00C853]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Projekt besprechen?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Lassen Sie uns gemeinsam die optimale Testing-Strategie für Ihr Projekt entwickeln.
          </p>
          <Link
            to="/kontakt"
            data-testid="services-contact-cta"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#1A1A1A] text-white font-bold text-lg rounded-md hover:bg-[#2A2A2A] transition-all duration-200"
          >
            Kontakt aufnehmen
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dienstleistungen;
