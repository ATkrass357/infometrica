import React from 'react';
import { Target, Award, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Unternehmen = () => {
  const values = [
    { icon: Target, title: 'Präzision', desc: 'Höchste Genauigkeit in jedem Test' },
    { icon: Shield, title: 'Zuverlässigkeit', desc: 'Konsistente Qualität garantiert' },
    { icon: TrendingUp, title: 'Innovation', desc: 'Modernste Technologien' },
    { icon: Users, title: 'Partnerschaft', desc: 'Langfristiger Erfolg' },
  ];

  const milestones = [
    { year: '2024', event: 'Gründung in Nuthe-Urstromtal' },
    { year: '2025', event: '10+ Testing-Experten' },
    { year: '2026', event: '25+ Test-Experten' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[#00C853] font-semibold tracking-wide mb-4">ÜBER UNS</div>
              <h1 className="text-5xl lg:text-7xl font-bold text-[#1A1A1A] leading-[0.95] tracking-tight mb-6">
                Deutsche<br />
                Präzision.
              </h1>
              <p className="text-xl text-[#4A4A4A] leading-relaxed mb-8">
                Seit 2024 setzen wir Standards im Application Testing. 
                Über 25 zertifizierte Experten. Mehr als 100 erfolgreiche Projekte. 
                Ein Ziel: Ihre Software perfekt machen.
              </p>
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-4xl font-bold text-[#00C853]">2+</div>
                  <div className="text-[#4A4A4A]">Jahre Erfahrung</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#00C853]">100+</div>
                  <div className="text-[#4A4A4A]">Projekte</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#00C853]">25+</div>
                  <div className="text-[#4A4A4A]">Experten</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-[#F4F7F5] overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                  alt="Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#00C853] p-6 hidden lg:block rounded-lg shadow-xl">
                <div className="text-white font-bold text-lg">Deutschland HQ</div>
                <div className="text-white/80 text-sm">Nuthe-Urstromtal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 lg:px-12 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="border-l-4 border-[#00C853] pl-8">
              <div className="text-[#00C853] font-semibold mb-4">MISSION</div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Qualität für alle zugänglich machen
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Wir glauben, dass jede Software die beste Version ihrer selbst sein sollte. 
                Durch umfassende Testing-Services stellen wir sicher, dass Anwendungen 
                perfekt funktionieren, sicher sind und Benutzer begeistern.
              </p>
            </div>
            <div className="border-l-4 border-white pl-8">
              <div className="text-white font-semibold mb-4">VISION</div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Europas führende Testing-Agentur
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Mit Innovation, Expertise und Leidenschaft wollen wir die Standards 
                der Softwarequalität neu definieren. Unser Ziel: digitale Produkte 
                schaffen helfen, die Märkte verändern.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 lg:px-12 bg-[#F4F7F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00C853] font-semibold tracking-wide mb-4">WERTE</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
              Was uns antreibt
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 p-8 hover:border-[#00C853] transition-colors duration-300 text-center rounded-lg"
                >
                  <div className="w-16 h-16 bg-[#1A1A1A] rounded-md flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-[#00C853]" size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{value.title}</h3>
                  <p className="text-[#4A4A4A]">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-[#00C853] font-semibold tracking-wide mb-4">GESCHICHTE</div>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A]">
              Unsere Meilensteine
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {milestones.map((item, index) => (
              <div key={index} className="text-center w-40">
                <div className="text-5xl font-bold text-[#00C853] mb-2">{item.year}</div>
                <div className="h-px w-full bg-gray-300 mb-4"></div>
                <p className="text-[#4A4A4A] text-sm">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-24 px-6 lg:px-12 bg-[#00C853]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="text-white mx-auto mb-4" size={48} strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-white mb-2">ISTQB Zertifiziert</h3>
              <p className="text-white/80">Alle Tester mit international anerkannten Zertifizierungen</p>
            </div>
            <div className="text-center">
              <Users className="text-white mx-auto mb-4" size={48} strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-white mb-2">8+ Jahre</h3>
              <p className="text-white/80">Durchschnittliche Erfahrung pro Teammitglied</p>
            </div>
            <div className="text-center">
              <TrendingUp className="text-white mx-auto mb-4" size={48} strokeWidth={1.5} />
              <h3 className="text-2xl font-bold text-white mb-2">Kontinuierlich</h3>
              <p className="text-white/80">Weiterbildung zu neuesten Testing-Methoden</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-12 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Teil des Teams werden?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Wir suchen talentierte Testing-Experten, die mit uns die Zukunft gestalten.
          </p>
          <Link
            to="/karriere"
            data-testid="about-careers-cta"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#00C853] text-white font-bold text-lg rounded-md hover:bg-[#009624] hover:scale-105 transition-all duration-200 shadow-lg shadow-[#00C853]/30"
          >
            Offene Stellen
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Unternehmen;
