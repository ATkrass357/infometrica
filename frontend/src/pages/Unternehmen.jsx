import React from 'react';
import { Target, Eye, Award, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';
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
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-orange-500 font-semibold tracking-wide mb-4">ÜBER UNS</div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[0.9] tracking-tight mb-6">
                Deutsche<br />
                Präzision.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Seit 2024 setzen wir Standards im Application Testing. 
                Über 25 zertifizierte Experten. Mehr als 100 erfolgreiche Projekte. 
                Ein Ziel: Ihre Software perfekt machen.
              </p>
              <div className="flex flex-wrap gap-8">
                <div>
                  <div className="text-4xl font-black text-orange-500">2+</div>
                  <div className="text-slate-600">Jahre Erfahrung</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-orange-500">100+</div>
                  <div className="text-slate-600">Projekte</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-orange-500">25+</div>
                  <div className="text-slate-600">Experten</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-slate-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                  alt="Team"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-orange-500 p-6 hidden lg:block">
                <div className="text-white font-bold text-lg">Deutschland HQ</div>
                <div className="text-orange-100 text-sm">Nuthe-Urstromtal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="border-l-4 border-orange-500 pl-8">
              <div className="text-orange-500 font-semibold mb-4">MISSION</div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Qualität für alle zugänglich machen
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
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
              <p className="text-slate-400 text-lg leading-relaxed">
                Mit Innovation, Expertise und Leidenschaft wollen wir die Standards 
                der Softwarequalität neu definieren. Unser Ziel: digitale Produkte 
                schaffen helfen, die Märkte verändern.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-orange-500 font-semibold tracking-wide mb-4">WERTE</div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">
              Was uns antreibt
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="border border-slate-200 p-8 hover:border-orange-500 transition-colors duration-300 text-center"
                >
                  <div className="w-16 h-16 bg-slate-900 flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-orange-500" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-orange-500 font-semibold tracking-wide mb-4">GESCHICHTE</div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">
              Unsere Meilensteine
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {milestones.map((item, index) => (
              <div key={index} className="text-center w-40">
                <div className="text-5xl font-black text-orange-500 mb-2">{item.year}</div>
                <div className="h-px w-full bg-slate-300 mb-4"></div>
                <p className="text-slate-600 text-sm">{item.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-24 px-6 lg:px-8 bg-orange-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Award className="text-white mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold text-white mb-2">ISTQB Zertifiziert</h3>
              <p className="text-orange-100">Alle Tester mit international anerkannten Zertifizierungen</p>
            </div>
            <div className="text-center">
              <Users className="text-white mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold text-white mb-2">8+ Jahre</h3>
              <p className="text-orange-100">Durchschnittliche Erfahrung pro Teammitglied</p>
            </div>
            <div className="text-center">
              <TrendingUp className="text-white mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold text-white mb-2">Kontinuierlich</h3>
              <p className="text-orange-100">Weiterbildung zu neuesten Testing-Methoden</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Teil des Teams werden?
          </h2>
          <p className="text-xl text-slate-400 mb-10">
            Wir suchen talentierte Testing-Experten, die mit uns die Zukunft gestalten.
          </p>
          <Link
            to="/karriere"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-orange-500 text-white font-bold text-lg hover:bg-orange-400 transition-all duration-300"
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
