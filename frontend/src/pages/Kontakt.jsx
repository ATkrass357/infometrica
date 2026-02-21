import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const Kontakt = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (will be connected to Telegram webhook later)
    setTimeout(() => {
      toast.success('Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.', {
        description: 'Wir werden uns in Kürze bei Ihnen melden.',
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-Mail',
      content: 'info@infometrica.de',
      link: 'mailto:info@infometrica.de',
    },
    {
      icon: Phone,
      title: 'Telefon',
      content: '+49 (0) 123 456789',
      link: 'tel:+49123456789',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: 'Musterstraße 123, 10115 Berlin, Deutschland',
      link: 'https://maps.google.com',
    },
  ];

  const faqs = [
    {
      question: 'Wie schnell können Sie mit dem Testing beginnen?',
      answer: 'In der Regel können wir innerhalb von 48 Stunden nach der Erstberatung mit dem Testing starten.',
    },
    {
      question: 'Welche Arten von Apps testen Sie?',
      answer: 'Wir testen alle Arten von Anwendungen: Mobile Apps (iOS/Android), Web-Apps, Desktop-Software und Cloud-Anwendungen.',
    },
    {
      question: 'Wie werden die Testergebnisse kommuniziert?',
      answer: 'Sie erhalten detaillierte Reports per E-Mail und können jederzeit über unser Helpdesk-System den Status einsehen.',
    },
    {
      question: 'Bieten Sie auch langfristige Testing-Partnerships an?',
      answer: 'Ja, wir bieten flexible Vertragsmodelle – von einzelnen Projekten bis zu langfristigen Testing-Partnerschaften.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6">
            Kontakt & Helpdesk
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Lassen Sie uns{' '}
            <span className="text-orange-500">sprechen</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Haben Sie Fragen zu unseren Dienstleistungen? Möchten Sie ein Projekt besprechen? 
            Unser Team steht Ihnen gerne zur Verfügung.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <a
                  key={index}
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                >
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-orange-500" size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-gray-600">{info.content}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Image */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div className="bg-white p-10 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Senden Sie uns eine Nachricht
              </h2>
              <p className="text-gray-600 mb-8">
                Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden bei Ihnen.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ihr Name"
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ihre@email.de"
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company">Unternehmen</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Ihr Unternehmen"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+49 123 456789"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Betreff *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Worum geht es?"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nachricht *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Beschreiben Sie Ihr Anliegen..."
                    required
                    className="min-h-[160px] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Wird gesendet...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Nachricht senden
                      <Send className="ml-2" size={20} />
                    </span>
                  )}
                </Button>
              </form>
            </div>

            {/* Image & Info */}
            <div className="space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1629904853716-f0bc54eea481"
                  alt="Customer Support"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              <div className="bg-orange-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Warum uns kontaktieren?
                </h3>
                <ul className="space-y-4">
                  {[
                    'Kostenlose Erstberatung',
                    'Schnelle Reaktionszeiten',
                    'Individuelle Lösungen',
                    'Transparente Preise',
                    'Erfahrene Experten',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="text-orange-500 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Helpdesk */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Häufig gestellte <span className="text-orange-500">Fragen</span>
            </h2>
            <p className="text-xl text-gray-600">
              Hier finden Sie Antworten auf die wichtigsten Fragen
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Haben Sie weitere Fragen?
            </p>
            <a
              href="mailto:info@infometrica.de"
              className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <Mail className="mr-2" size={20} />
              E-Mail senden
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kontakt;
