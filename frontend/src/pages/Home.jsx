import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, BarChart3, Code2, ChevronRight, CheckCircle2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Asymmetric Layout */}
      <section className="relative pt-28 pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
        {/* Geometric Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00C853] transform skew-x-[-6deg] translate-x-20 hidden lg:block" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#B9F6CA] rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B9F6CA] rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white text-sm font-medium tracking-wide rounded-full">
                <span className="w-2 h-2 bg-[#00C853] rounded-full animate-pulse" />
                PRÄZISION IN JEDEM PIXEL
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-[#1A1A1A] leading-[0.95] tracking-tight">
                Wir testen.
                <br />
                <span className="text-[#00C853]">Sie profitieren.</span>
              </h1>
              
              <p className="text-lg text-[#4A4A4A] max-w-lg leading-relaxed">
                Precision Labs ist Ihr Spezialist für professionelles Application Testing. 
                Wir finden die Fehler, bevor Ihre Nutzer es tun.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/kontakt"
                  data-testid="home-hero-cta"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#00C853] text-white font-semibold rounded-md hover:bg-[#009624] hover:scale-105 transition-all duration-200 shadow-lg shadow-[#00C853]/20"
                >
                  Projekt starten
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/dienstleistungen"
                  data-testid="home-services-link"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold rounded-md hover:bg-[#1A1A1A] hover:text-white transition-all duration-200"
                >
                  Leistungen ansehen
                </Link>
              </div>
            </div>

            {/* Right - Stats Cards */}
            <div className="relative lg:pl-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-8 border-l-4 border-[#00C853] shadow-xl rounded-lg">
                  <div className="text-5xl font-bold text-[#1A1A1A] mb-2">500+</div>
                  <div className="text-[#4A4A4A] font-medium">Getestete Apps</div>
                </div>
                <div className="bg-[#1A1A1A] p-8 text-white mt-8 rounded-lg">
                  <div className="text-5xl font-bold mb-2">98%</div>
                  <div className="text-gray-400 font-medium">Kundenzufriedenheit</div>
                </div>
                <div className="bg-[#1A1A1A] p-8 text-white rounded-lg">
                  <div className="text-5xl font-bold mb-2">2+</div>
                  <div className="text-gray-400 font-medium">Jahre Erfahrung</div>
                </div>
                <div className="bg-white p-8 border border-gray-200 shadow-xl rounded-lg hover:border-[#00C853] transition-colors duration-300">
                  <div className="text-5xl font-bold text-[#1A1A1A] mb-2">25+</div>
                  <div className="text-[#4A4A4A] font-medium">Test-Experten</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Bento Grid */}
      <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#F4F7F5]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
            <div>
              <div className="text-[#00C853] font-semibold tracking-wide mb-4">DIENSTLEISTUNGEN</div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight">
                Testing auf<br />höchstem Niveau
              </h2>
            </div>
            <Link
              to="/dienstleistungen"
              className="group inline-flex items-center gap-2 text-[#1A1A1A] font-semibold hover:text-[#00C853] transition-colors"
            >
              Alle Leistungen
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Card */}
            <div className="lg:col-span-2 bg-[#1A1A1A] p-10 group hover:bg-[#2A2A2A] transition-colors duration-300 rounded-lg">
              <Shield className="text-[#00C853] mb-6" size={48} strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-white mb-4">Funktionales Testing</h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Umfassende Prüfung aller Funktionen Ihrer Anwendung. Wir stellen sicher, 
                dass jedes Feature einwandfrei funktioniert – auf allen Plattformen und Geräten.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Regression Tests', 'Integration Tests', 'End-to-End'].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-[#333] text-gray-300 text-sm font-medium rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Small Card */}
            <div className="bg-[#00C853] p-10 group rounded-lg hover:scale-[1.02] transition-transform duration-300">
              <Zap className="text-white mb-6" size={48} strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-white mb-4">Performance Testing</h3>
              <p className="text-white/80 leading-relaxed">
                Analyse von Ladezeiten, Speicherverbrauch und Systemstabilität unter Last.
              </p>
            </div>

            {/* Small Card */}
            <div className="bg-white p-10 group hover:border-[#00C853] border border-gray-200 transition-colors duration-300 rounded-lg">
              <BarChart3 className="text-[#1A1A1A] mb-6" size={48} strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Usability Testing</h3>
              <p className="text-[#4A4A4A] leading-relaxed">
                Bewertung der Benutzerfreundlichkeit durch echte Nutzer-Tests und Expertenbewertungen.
              </p>
            </div>

            {/* Large Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] p-10 relative overflow-hidden rounded-lg">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C853]/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <Code2 className="text-[#00C853] mb-6" size={48} strokeWidth={1.5} />
                <h3 className="text-2xl font-bold text-white mb-4">Automatisiertes Testing</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  CI/CD-Integration mit automatisierten Test-Suites. Kontinuierliche Qualitätssicherung 
                  bei jedem Deployment – schnell, zuverlässig und kosteneffizient.
                </p>
                <Link
                  to="/dienstleistungen"
                  className="inline-flex items-center gap-2 text-[#00C853] font-semibold hover:text-[#B9F6CA] transition-colors"
                >
                  Mehr erfahren <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us - Split Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="aspect-[4/5] bg-[#F4F7F5] overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                  alt="Team bei der Arbeit"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-8 -right-8 bg-[#00C853] p-8 max-w-xs hidden lg:block rounded-lg shadow-xl">
                <div className="text-white">
                  <div className="text-4xl font-bold mb-2">Deutschland</div>
                  <div className="text-white/80">Nuthe-Urstromtal</div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-8">
              <div className="text-[#00C853] font-semibold tracking-wide">ÜBER UNS</div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight">
                Deutsche Präzision.<br />
                Globale Standards.
              </h2>
              <p className="text-lg text-[#4A4A4A] leading-relaxed">
                Seit über 2 Jahren setzen wir Maßstäbe im Application Testing. 
                Unser Team aus zertifizierten Experten verbindet deutsche Gründlichkeit 
                mit modernsten Testing-Methoden.
              </p>

              <div className="space-y-6 pt-4">
                {[
                  { title: 'ISTQB-zertifizierte Tester', desc: 'Höchste Qualifikationsstandards' },
                  { title: 'Agile Methoden', desc: 'Nahtlose Integration in Ihren Workflow' },
                  { title: 'Dedizierter Support', desc: 'Persönlicher Ansprechpartner für Ihr Projekt' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#00C853] flex items-center justify-center flex-shrink-0 rounded-md">
                      <CheckCircle2 className="text-white" size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="font-bold text-[#1A1A1A]">{item.title}</div>
                      <div className="text-[#4A4A4A]">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/unternehmen"
                data-testid="home-about-link"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] text-white font-semibold rounded-md hover:bg-[#333] transition-all duration-200 mt-4"
              >
                Unternehmen entdecken
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00C853]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00C853]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Bereit für<br />
            <span className="text-[#00C853]">fehlerfreie Apps?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Kontaktieren Sie uns für eine unverbindliche Erstberatung. 
            Wir analysieren Ihre Anforderungen und erstellen ein maßgeschneidertes Angebot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kontakt"
              data-testid="home-cta-contact"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#00C853] text-white font-bold text-lg rounded-md hover:bg-[#009624] hover:scale-105 transition-all duration-200 shadow-lg shadow-[#00C853]/30"
            >
              Jetzt Kontakt aufnehmen
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/karriere"
              data-testid="home-cta-career"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-gray-700 text-white font-bold text-lg rounded-md hover:border-[#00C853] hover:text-[#00C853] transition-all duration-200"
            >
              Karriere bei uns
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
