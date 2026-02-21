import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Building2 } from 'lucide-react';

const Impressum = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Impressum
          </h1>
          <p className="text-xl text-gray-600">
            Angaben gemäß § 5 TMG
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 space-y-8">
            
            {/* Company Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Building2 className="mr-3 text-orange-500" size={28} />
                Firmeninformationen
              </h2>
              <div className="space-y-2 text-gray-700 ml-11">
                <p className="font-semibold text-lg">Infometrica GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Kontakt
              </h2>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Phone className="mr-3 text-orange-500 flex-shrink-0" size={20} />
                  <span>Telefon: +49 (0) 123 456789</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="mr-3 text-orange-500 flex-shrink-0" size={20} />
                  <span>E-Mail: info@infometrica.de</span>
                </div>
                <div className="flex items-start text-gray-700">
                  <MapPin className="mr-3 text-orange-500 flex-shrink-0 mt-1" size={20} />
                  <span>Internet: www.infometrica.de</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Legal Representatives */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Vertretungsberechtigte
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>Geschäftsführer: Max Mustermann</p>
                <p>Geschäftsführerin: Maria Musterfrau</p>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Register Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Registereintrag
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>Eintragung im Handelsregister</p>
                <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
                <p>Registernummer: HRB 123456 B</p>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Tax Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Umsatzsteuer-Identifikationsnummer
              </h2>
              <div className="text-gray-700">
                <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
                <p className="font-semibold mt-2">DE123456789</p>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Professional Liability Insurance */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Berufshaftpflichtversicherung
              </h2>
              <div className="space-y-2 text-gray-700">
                <p><strong>Name und Sitz des Versicherers:</strong></p>
                <p>Muster Versicherung AG</p>
                <p>Versicherungsplatz 1</p>
                <p>10000 Berlin</p>
                <p className="mt-3"><strong>Geltungsraum der Versicherung:</strong></p>
                <p>Deutschland</p>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Dispute Resolution */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Streitschlichtung
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                  <a 
                    href="https://ec.europa.eu/consumers/odr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-600 underline"
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

            <div className="border-t border-gray-200"></div>

            {/* Liability for Content */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Haftung für Inhalte
              </h2>
              <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
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

            <div className="border-t border-gray-200"></div>

            {/* Copyright */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Urheberrecht
              </h2>
              <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
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

          {/* Back to Home Link */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-200"
            >
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impressum;
