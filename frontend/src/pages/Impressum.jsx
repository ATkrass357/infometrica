import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Building2, ArrowLeft } from 'lucide-react';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 bg-[#F8F9FA]">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-[#00C853] font-mono text-sm uppercase tracking-widest mb-4 block">Rechtliches</span>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0A0A0A] mb-4">
            Impressum
          </h1>
          <p className="text-xl text-slate-600">
            Angaben gemäß § 5 TMG
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Product Info */}
              <div className="p-8 bg-[#F0FDF4] border border-[#00C853]/20 rounded-2xl">
                <p className="text-lg text-[#0A0A0A]">
                  <span className="font-bold">Precision Labs</span> ist ein Produkt der <span className="font-bold">avisec GmbH</span>
                </p>
              </div>

              {/* Company Information */}
              <div>
                <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00C853] flex items-center justify-center">
                    <Building2 className="text-white" size={20} />
                  </div>
                  Firmeninformationen
                </h2>
                <div className="space-y-2 text-slate-600 ml-13">
                  <p className="font-semibold text-lg text-[#0A0A0A]">avisec GmbH</p>
                  <p>Römerstraße 90</p>
                  <p>79618 Rheinfelden (Baden)</p>
                  <p>Deutschland</p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">
                  Kontakt
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center text-slate-600">
                    <Mail className="mr-3 text-[#00C853] flex-shrink-0" size={20} />
                    <span>E-Mail: info@precision-labs.de</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <MapPin className="mr-3 text-[#00C853] flex-shrink-0" size={20} />
                    <span>Internet: www.precision-labs.de</span>
                  </div>
                </div>
              </div>

              {/* Legal Representatives */}
              <div>
                <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">
                  Vertretungsberechtigte
                </h2>
                <div className="text-slate-600">
                  <p>Geschäftsführer: Daniel Bärtschi</p>
                </div>
              </div>

              {/* Register Information */}
              <div>
                <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">
                  Registereintrag
                </h2>
                <div className="space-y-2 text-slate-600">
                  <p>Eintragung im Handelsregister</p>
                  <p>Registergericht: Amtsgericht Freiburg</p>
                  <p>Registernummer: HRB 726972</p>
                </div>
              </div>

              {/* Dispute Resolution */}
              <div>
                <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">
                  Streitschlichtung
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                    <a 
                      href="https://ec.europa.eu/consumers/odr/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#00C853] hover:underline"
                    >
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                  <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
                  <p>
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>
              </div>

              {/* Liability for Content */}
              <div>
                <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">
                  Haftung für Inhalte
                </h2>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                    nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                    Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                    Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                    Tätigkeit hinweisen.
                  </p>
                  <p>
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                    allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
                    erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei 
                    Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                  </p>
                </div>
              </div>

              {/* Copyright */}
              <div>
                <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">
                  Urheberrecht
                </h2>
                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                    dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                    der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                    Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                  <p>
                    Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die 
                    Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche 
                    gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, 
                    bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen 
                    werden wir derartige Inhalte umgehend entfernen.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-6">
                <div className="bg-[#0A0A0A] text-white p-8 rounded-2xl">
                  <h3 className="font-bold text-lg mb-4">Schnellkontakt</h3>
                  <div className="space-y-3 text-slate-400">
                    <p>info@precision-labs.de</p>
                    <p>Römerstraße 90</p>
                    <p>79618 Rheinfelden (Baden)</p>
                  </div>
                </div>

                <Link
                  to="/"
                  className="flex items-center gap-2 text-[#00C853] font-semibold hover:gap-3 transition-all"
                >
                  <ArrowLeft size={18} />
                  Zurück zur Startseite
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impressum;
