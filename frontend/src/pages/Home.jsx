import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, BarChart3, Code2, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - Asymmetric Layout */}
      <section className="relative pt-28 pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
        {/* Geometric Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-500 transform skew-x-[-6deg] translate-x-20 hidden lg:block" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium tracking-wide">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                QUALITÄTSSICHERUNG FÜR APPS
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tight">
                Wir testen.
                <br />
                <span className="text-orange-500">Sie profitieren.</span>
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Infometrica ist Ihr Spezialist für professionelles Application Testing. 
                Wir finden die Fehler, bevor Ihre Nutzer es tun.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/kontakt"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all duration-300"
                >
                  Projekt starten
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/dienstleistungen"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-slate-900 text-slate-900 font-semibold hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                  Leistungen ansehen
                </Link>
              </div>
            </div>

            {/* Right - Stats Cards */}
            <div className="relative lg:pl-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-8 border-l-4 border-orange-500 shadow-xl">
                  <div className="text-5xl font-black text-slate-900 mb-2">500+</div>
                  <div className="text-slate-600 font-medium">Getestete Apps</div>
                </div>
                <div className="bg-slate-900 p-8 text-white mt-8">
                  <div className="text-5xl font-black mb-2">98%</div>
                  <div className="text-slate-400 font-medium">Kundenzufriedenheit</div>
                </div>
                <div className="bg-orange-500 p-8 text-white">
                  <div className="text-5xl font-black mb-2">15+</div>
                  <div className="text-orange-100 font-medium">Jahre Erfahrung</div>
                </div>
                <div className="bg-white p-8 border border-slate-200 shadow-xl">
                  <div className="text-5xl font-black text-slate-900 mb-2">50+</div>
                  <div className="text-slate-600 font-medium">Test-Experten</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services - Bento Grid */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
            <div>
              <div className="text-orange-500 font-semibold tracking-wide mb-4">DIENSTLEISTUNGEN</div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                Testing auf<br />höchstem Niveau
              </h2>
            </div>
            <Link
              to="/dienstleistungen"
              className="group inline-flex items-center gap-2 text-slate-900 font-semibold hover:text-orange-500 transition-colors"
            >
              Alle Leistungen
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Card */}
            <div className="lg:col-span-2 bg-slate-900 p-10 group hover:bg-slate-800 transition-colors duration-300">
              <Shield className="text-orange-500 mb-6" size={48} />
              <h3 className="text-2xl font-bold text-white mb-4">Funktionales Testing</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Umfassende Prüfung aller Funktionen Ihrer Anwendung. Wir stellen sicher, 
                dass jedes Feature einwandfrei funktioniert – auf allen Plattformen und Geräten.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Regression Tests', 'Integration Tests', 'End-to-End'].map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Small Card */}
            <div className="bg-orange-500 p-10 group">
              <Zap className="text-white mb-6" size={48} />
              <h3 className="text-2xl font-bold text-white mb-4">Performance Testing</h3>
              <p className="text-orange-100 leading-relaxed">
                Analyse von Ladezeiten, Speicherverbrauch und Systemstabilität unter Last.
              </p>
            </div>

            {/* Small Card */}
            <div className="bg-slate-100 p-10 group hover:bg-slate-200 transition-colors duration-300">
              <BarChart3 className="text-slate-900 mb-6" size={48} />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Usability Testing</h3>
              <p className="text-slate-600 leading-relaxed">
                Bewertung der Benutzerfreundlichkeit durch echte Nutzer-Tests und Expertenbewertungen.
              </p>
            </div>

            {/* Large Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <Code2 className="text-orange-500 mb-6" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4">Automatisiertes Testing</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  CI/CD-Integration mit automatisierten Test-Suites. Kontinuierliche Qualitätssicherung 
                  bei jedem Deployment – schnell, zuverlässig und kosteneffizient.
                </p>
                <Link
                  to="/dienstleistungen"
                  className="inline-flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-400 transition-colors"
                >
                  Mehr erfahren <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us - Split Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="aspect-[4/5] bg-slate-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                  alt="Team bei der Arbeit"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              {/* Floating Card */}
              <div className="absolute -bottom-8 -right-8 bg-orange-500 p-8 max-w-xs hidden lg:block">
                <div className="text-white">
                  <div className="text-4xl font-black mb-2">Berlin</div>
                  <div className="text-orange-100">Tauentzienstraße 9-12</div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-8">
              <div className="text-orange-500 font-semibold tracking-wide">ÜBER UNS</div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                Deutsche Präzision.<br />
                Globale Standards.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Seit über 15 Jahren setzen wir Maßstäbe im Application Testing. 
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
                    <div className="w-12 h-12 bg-orange-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-slate-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/unternehmen"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all duration-300 mt-4"
              >
                Unternehmen entdecken
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Bereit für<br />
            <span className="text-orange-500">fehlerfreie Apps?</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Kontaktieren Sie uns für eine unverbindliche Erstberatung. 
            Wir analysieren Ihre Anforderungen und erstellen ein maßgeschneidertes Angebot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kontakt"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-orange-500 text-white font-bold text-lg hover:bg-orange-400 transition-all duration-300"
            >
              Jetzt Kontakt aufnehmen
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/karriere"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-slate-700 text-white font-bold text-lg hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
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
