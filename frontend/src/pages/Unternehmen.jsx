import React from 'react';
import { Target, Eye, Award, Users, TrendingUp, Shield } from 'lucide-react';

const Unternehmen = () => {
  const values = [
    {
      icon: Target,
      title: 'Präzision',
      description: 'Wir arbeiten mit höchster Genauigkeit, um selbst kleinste Fehler zu identifizieren.',
    },
    {
      icon: Shield,
      title: 'Zuverlässigkeit',
      description: 'Verlassen Sie sich auf unsere bewährten Prozesse und konsistente Qualität.',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Wir nutzen modernste Technologien und bleiben stets am Puls der Zeit.',
    },
    {
      icon: Users,
      title: 'Partnerschaft',
      description: 'Wir verstehen uns als Ihr langfristiger Partner auf dem Weg zum Erfolg.',
    },
  ];

  const milestones = [
    { year: '2008', event: 'Gründung von Infometrica in Berlin' },
    { year: '2012', event: 'Expansion mit 20+ Testing-Experten' },
    { year: '2016', event: 'Zertifizierung ISO 9001:2015' },
    { year: '2020', event: 'Über 500 erfolgreich getestete Apps' },
    { year: '2024', event: 'Marktführer im App-Testing Bereich' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6">
              Über Infometrica
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Ihr Partner für{' '}
              <span className="text-orange-500">exzellente Qualität</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Seit über 15 Jahren setzen wir Standards im Application Testing und 
              helfen Unternehmen dabei, Software von höchster Qualität zu entwickeln.
            </p>
          </div>

          <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740"
              alt="Infometrica Office"
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-orange-500" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Unsere Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Wir machen qualitativ hochwertige Software für alle zugänglich. 
                Durch umfassende Testing-Services stellen wir sicher, dass jede 
                Anwendung perfekt funktioniert, sicher ist und Benutzer begeistert. 
                Unser Ziel ist es, technische Exzellenz mit höchster Kundenzufriedenheit 
                zu verbinden.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Eye className="text-orange-500" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Unsere Vision</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Wir streben danach, die führende App-Testing-Agentur in Europa zu werden. 
                Mit Innovation, Expertise und Leidenschaft wollen wir die Standards der 
                Softwarequalität neu definieren und unseren Kunden helfen, digitale 
                Produkte zu schaffen, die Leben verändern und Märkte revolutionieren.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Unsere <span className="text-orange-500">Werte</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diese Prinzipien leiten uns bei allem, was wir tun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <Icon className="text-orange-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Journey */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Unsere <span className="text-orange-500">Geschichte</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Von einem kleinen Startup zu einem der führenden App-Testing-Unternehmen – 
                unsere Reise ist geprägt von Innovation, Hingabe und dem Streben nach Perfektion.
              </p>

              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-20 text-2xl font-bold text-orange-500">
                      {milestone.year}
                    </div>
                    <div className="flex-1">
                      <div className="h-px bg-orange-200 w-full mt-4 mb-2"></div>
                      <p className="text-gray-700 font-medium">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/4623110/pexels-photo-4623110.jpeg"
                  alt="Team Working"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1713947506934-c0b6519e069d"
                  alt="Collaboration"
                  className="w-full h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Unser <span className="text-orange-500">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Über 50 erfahrene Testing-Experten arbeiten täglich daran, 
              Ihre Apps zur Perfektion zu bringen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-orange-500" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Zertifiziert</h3>
              <p className="text-gray-600">
                Alle unsere Tester verfügen über international anerkannte Zertifizierungen
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-orange-500" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Erfahren</h3>
              <p className="text-gray-600">
                Durchschnittlich 8+ Jahre Erfahrung im Application Testing
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-orange-500" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Weiterbildung</h3>
              <p className="text-gray-600">
                Kontinuierliche Schulungen zu neuesten Testing-Methoden und Tools
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Unternehmen;
