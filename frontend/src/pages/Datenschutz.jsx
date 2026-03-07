import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, FileText, Users, Cookie, Mail } from 'lucide-react';

const Datenschutz = () => {
  const sections = [
    {
      icon: Eye,
      title: '1. Datenschutz auf einen Blick',
      content: [
        {
          subtitle: 'Allgemeine Hinweise',
          text: 'Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.',
        },
      ],
    },
    {
      icon: FileText,
      title: '2. Datenerfassung auf dieser Website',
      content: [
        {
          subtitle: 'Wer ist verantwortlich für die Datenerfassung auf dieser Website?',
          text: 'Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.',
        },
        {
          subtitle: 'Wie erfassen wir Ihre Daten?',
          text: 'Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).',
        },
        {
          subtitle: 'Wofür nutzen wir Ihre Daten?',
          text: 'Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.',
        },
      ],
    },
    {
      icon: Users,
      title: '3. Ihre Rechte',
      content: [
        {
          subtitle: 'Welche Rechte haben Sie bezüglich Ihrer Daten?',
          text: 'Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.',
        },
      ],
    },
    {
      icon: Lock,
      title: '4. Hosting',
      content: [
        {
          subtitle: 'Externes Hosting',
          text: 'Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.',
        },
      ],
    },
    {
      icon: Cookie,
      title: '5. Cookies',
      content: [
        {
          subtitle: 'Cookies',
          text: 'Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. Permanente Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen oder eine automatische Löschung durch Ihren Webbrowser erfolgt.',
        },
      ],
    },
    {
      icon: Mail,
      title: '6. Kontaktformular',
      content: [
        {
          subtitle: 'Anfragen per Kontaktformular',
          text: 'Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-#E8F5E9 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="text-#00C853" size={40} />
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Datenschutz­erklärung
          </h1>
          <p className="text-xl text-gray-600">
            Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Introduction */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-8">
            <p className="text-gray-700 leading-relaxed mb-4">
              Wir freuen uns über Ihr Interesse an unserer Website. Der Schutz Ihrer Privatsphäre ist 
              für uns sehr wichtig. Nachstehend informieren wir Sie ausführlich über den Umgang mit 
              Ihren Daten.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Stand:</strong> Februar 2026
            </p>
          </div>

          {/* Verantwortliche Stelle */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Verantwortliche Stelle
            </h2>
            <p className="text-gray-700 mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
            </p>
            <div className="bg-gray-50 p-6 rounded-xl space-y-2 text-gray-700">
              <p className="font-semibold text-lg">Precision Labs</p>
              <p>Römerstraße 90</p>
              <p>79618 Rheinfelden (Baden)</p>
              <p>Deutschland</p>
              <p className="pt-3">E-Mail: datenschutz@precision-labs.de</p>
            </div>
            <p className="text-gray-700 mt-6 text-sm">
              Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder 
              gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen 
              Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
            </p>
          </div>

          {/* All Sections */}
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-12 h-12 bg-#E8F5E9 rounded-xl flex items-center justify-center mr-4">
                    <Icon className="text-#00C853" size={24} />
                  </div>
                  {section.title}
                </h2>
                
                <div className="space-y-6">
                  {section.content.map((item, idx) => (
                    <div key={idx}>
                      {item.subtitle && (
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                          {item.subtitle}
                        </h3>
                      )}
                      <p className="text-gray-700 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* GDPR Rights */}
          <div className="bg-orange-50 rounded-2xl shadow-lg p-8 lg:p-12 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ihre Rechte nach DSGVO
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-#00C853 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p><strong>Recht auf Auskunft:</strong> Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob Sie betreffende personenbezogene Daten verarbeitet werden.</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-#00C853 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p><strong>Recht auf Berichtigung:</strong> Sie haben das Recht, die Berichtigung unrichtiger oder die Vervollständigung unvollständiger Daten zu verlangen.</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-#00C853 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p><strong>Recht auf Löschung:</strong> Sie haben das Recht, die Löschung Ihrer personenbezogenen Daten zu verlangen.</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-#00C853 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p><strong>Recht auf Einschränkung:</strong> Sie haben das Recht, die Einschränkung der Verarbeitung zu verlangen.</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-#00C853 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p><strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten.</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-#00C853 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
                <p><strong>Widerspruchsrecht:</strong> Sie haben das Recht, gegen die Verarbeitung Ihrer Daten Widerspruch einzulegen.</p>
              </div>
            </div>
          </div>

          {/* Contact for Data Protection */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Kontakt in Datenschutzfragen
            </h2>
            <p className="text-gray-700 mb-6">
              Für Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich bitte an:
            </p>
            <div className="bg-orange-50 p-6 rounded-xl">
              <p className="text-gray-900 font-semibold mb-2">Datenschutzbeauftragter</p>
              <p className="text-gray-700">Precision Labs</p>
              <p className="text-gray-700">E-Mail: datenschutz@precision-labs.de</p>
              <p className="text-gray-700">Telefon: +49 (0) 123 456789</p>
            </div>
          </div>

          {/* Back Links */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 text-#00C853 hover:text-orange-600 font-semibold transition-colors duration-200"
            >
              ← Zurück zur Startseite
            </Link>
            <Link
              to="/impressum"
              className="inline-flex items-center justify-center px-6 py-3 text-#00C853 hover:text-orange-600 font-semibold transition-colors duration-200"
            >
              Zum Impressum →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Datenschutz;
