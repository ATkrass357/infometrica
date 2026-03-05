import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Shield, Zap, BarChart3, Code2, Play, CheckCircle } from 'lucide-react';

const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/7bea0805-458a-46a4-83aa-a7ef43569440/images/31c2d350dad6978320d16680435185ac4d3ed1b7bc213f06a2774d3ee186a694.png";

const Home = () => {
  const stats = [
    { value: '500+', label: 'Getestete Apps', delay: '0ms' },
    { value: '98%', label: 'Erfolgsquote', delay: '100ms' },
    { value: '24h', label: 'Response Time', delay: '200ms' },
    { value: '25+', label: 'Experten', delay: '300ms' },
  ];

  const services = [
    {
      icon: Shield,
      title: 'Funktionales Testing',
      desc: 'End-to-End Validierung aller Features',
      tags: ['Regression', 'Integration', 'E2E'],
      size: 'large',
    },
    {
      icon: Zap,
      title: 'Performance',
      desc: 'Speed & Load Optimierung',
      tags: ['Load Tests', 'Stress Tests'],
      size: 'small',
      accent: true,
    },
    {
      icon: BarChart3,
      title: 'Usability',
      desc: 'UX Testing durch echte Nutzer',
      tags: ['A/B Tests', 'Accessibility'],
      size: 'small',
    },
    {
      icon: Code2,
      title: 'Automatisierung',
      desc: 'CI/CD Pipeline Integration',
      tags: ['Selenium', 'Cypress', 'Appium'],
      size: 'large',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#E8F5E9] to-transparent blur-3xl opacity-60" />
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#F0FDF4] to-transparent blur-3xl opacity-40" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,83,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,83,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#0A0A0A] rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C853] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C853]"></span>
                </span>
                <span className="text-white text-sm font-medium tracking-wide">Jetzt verfügbar für neue Projekte</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#0A0A0A] leading-[0.9]">
                Software
                <br />
                <span className="text-[#00C853]">fehlerfrei</span>
                <br />
                machen.
              </h1>
              
              {/* Subline */}
              <p className="text-lg md:text-xl text-slate-600 max-w-md leading-relaxed">
                Wir sind Precision Labs — Ihr Partner für professionelles Application Testing. 
                Deutsche Gründlichkeit trifft auf modernste Methoden.
              </p>
              
              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/kontakt"
                  data-testid="hero-cta-primary"
                  className="group inline-flex items-center gap-3 h-14 px-8 bg-[#00C853] text-white font-semibold rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-[#00C853]/25"
                >
                  Projekt starten
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/dienstleistungen"
                  data-testid="hero-cta-secondary"
                  className="group inline-flex items-center gap-3 h-14 px-8 border-2 border-slate-200 text-[#0A0A0A] font-semibold rounded-full hover:border-[#0A0A0A] transition-colors duration-200"
                >
                  <Play size={18} className="text-[#00C853]" />
                  So arbeiten wir
                </Link>
              </div>
            </div>

            {/* Right - Stats Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="group relative bg-white border border-slate-100 p-8 rounded-2xl hover:border-[#00C853]/50 hover:-translate-y-1 transition-all duration-300"
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F0FDF4] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight size={14} className="text-[#00C853]" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-[#0A0A0A] mb-2">{stat.value}</div>
                    <div className="text-slate-500 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-[#0A0A0A] text-white px-6 py-3 rounded-full shadow-xl">
                <span className="font-mono text-sm">seit 2024 🇩🇪</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400">
          <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-slate-300 to-transparent" />
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#F8F9FA] noise-overlay">
        <div className="max-w-[1400px] mx-auto relative z-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <div>
              <span className="text-[#00C853] font-mono text-sm uppercase tracking-widest mb-4 block">Services</span>
              <h2 className="text-4xl md:text-6xl font-bold text-[#0A0A0A]">
                Was wir<br />testen.
              </h2>
            </div>
            <Link
              to="/dienstleistungen"
              className="group inline-flex items-center gap-2 text-[#0A0A0A] font-semibold hover:text-[#00C853] transition-colors"
            >
              Alle Services
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Large Card 1 */}
            <div className="md:col-span-2 group relative bg-[#0A0A0A] p-10 rounded-2xl overflow-hidden hover-lift">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00C853]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                <Shield className="text-[#00C853] mb-6" size={48} strokeWidth={1.5} />
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Funktionales Testing</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  End-to-End Validierung aller App-Features auf allen Plattformen und Geräten.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Regression', 'Integration', 'E2E', 'API'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-white/10 text-white/80 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Small Card - Accent */}
            <div className="group relative bg-[#00C853] p-8 rounded-2xl overflow-hidden hover-lift">
              <Zap className="text-white mb-4" size={40} strokeWidth={1.5} />
              <h3 className="text-xl font-bold text-white mb-2">Performance</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Speed & Load Testing unter realen Bedingungen.
              </p>
            </div>

            {/* Small Card */}
            <div className="group relative bg-white border border-slate-100 p-8 rounded-2xl hover:border-[#00C853]/50 transition-colors hover-lift">
              <BarChart3 className="text-[#0A0A0A] mb-4" size={40} strokeWidth={1.5} />
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Usability</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                UX Testing durch echte User und Experten.
              </p>
            </div>

            {/* Large Card 2 */}
            <div className="md:col-span-2 group relative bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-10 rounded-2xl overflow-hidden hover-lift">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#00C853]/5 rounded-full blur-2xl" />
              <div className="relative z-10">
                <Code2 className="text-[#00C853] mb-6" size={48} strokeWidth={1.5} />
                <h3 className="text-2xl md:text-3xl font-bold text-[#0A0A0A] mb-4">Automatisierung</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  CI/CD-Integration mit automatisierten Test-Suites für kontinuierliche Qualität.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Selenium', 'Cypress', 'Appium', 'Jenkins'].map(tag => (
                    <span key={tag} className="px-4 py-1.5 bg-[#0A0A0A] text-white text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Wide Card */}
            <div className="md:col-span-2 group relative bg-[#0A0A0A] p-8 rounded-2xl flex items-center gap-8 hover-lift">
              <div className="flex-1">
                <span className="text-[#00C853] font-mono text-xs uppercase tracking-widest mb-2 block">Neu</span>
                <h3 className="text-xl font-bold text-white mb-2">Mobile App Testing</h3>
                <p className="text-slate-400 text-sm">iOS & Android native und hybrid Apps.</p>
              </div>
              <Link to="/dienstleistungen" className="w-12 h-12 rounded-full bg-[#00C853] flex items-center justify-center hover:scale-110 transition-transform">
                <ArrowRight className="text-white" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                  alt="Team bei der Arbeit"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl border border-slate-100 max-w-xs">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#00C853] flex items-center justify-center">
                    <CheckCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-[#0A0A0A]">ISTQB Zertifiziert</div>
                    <div className="text-sm text-slate-500">Alle Teammitglieder</div>
                  </div>
                </div>
              </div>
              
              {/* Experience Badge */}
              <div className="absolute top-6 -left-6 bg-[#0A0A0A] text-white px-6 py-4 rounded-2xl">
                <div className="text-3xl font-bold">2+</div>
                <div className="text-sm text-slate-400">Jahre Erfahrung</div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-8">
              <span className="text-[#00C853] font-mono text-sm uppercase tracking-widest">Warum Precision Labs</span>
              <h2 className="text-4xl md:text-6xl font-bold text-[#0A0A0A] leading-[0.95]">
                Deutsche<br />
                Präzision.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Wir verbinden deutsche Gründlichkeit mit modernsten Testing-Methoden. 
                Unser Team aus zertifizierten Experten findet die Fehler, bevor Ihre Nutzer es tun.
              </p>

              <div className="space-y-6 pt-4">
                {[
                  { title: '100% Remote', desc: 'Flexibel für Ihr Team' },
                  { title: 'Agile Methoden', desc: 'Nahtlose Integration' },
                  { title: '24h Support', desc: 'Immer erreichbar' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-[#00C853] group-hover:bg-[#00C853] transition-all duration-300">
                      <CheckCircle size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="font-bold text-[#0A0A0A]">{item.title}</div>
                      <div className="text-slate-500 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/unternehmen"
                className="group inline-flex items-center gap-3 h-14 px-8 bg-[#0A0A0A] text-white font-semibold rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 mt-4"
              >
                Mehr über uns
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#0A0A0A] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,83,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,83,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00C853]/10 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#00C853] font-mono text-sm uppercase tracking-widest mb-6 block">Loslegen</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[0.95]">
            Bereit für<br />
            <span className="text-[#00C853]">fehlerfreie</span> Apps?
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Kontaktieren Sie uns für eine unverbindliche Erstberatung. 
            Wir analysieren Ihre Anforderungen kostenlos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kontakt"
              data-testid="cta-contact"
              className="group inline-flex items-center justify-center gap-3 h-16 px-10 bg-[#00C853] text-white font-bold text-lg rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-[#00C853]/30"
            >
              Jetzt Kontakt aufnehmen
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/karriere"
              data-testid="cta-careers"
              className="inline-flex items-center justify-center gap-3 h-16 px-10 border-2 border-slate-700 text-white font-bold text-lg rounded-full hover:border-[#00C853] hover:text-[#00C853] transition-colors duration-200"
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
