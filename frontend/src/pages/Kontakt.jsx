import React, { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Nachricht gesendet!', {
        description: 'Wir melden uns in Kürze bei Ihnen.',
      });
      setFormData({ name: '', email: '', company: '', phone: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 lg:px-12 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="text-[#00C853] font-semibold tracking-wide mb-4">KONTAKT</div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Lassen Sie uns<br />
              <span className="text-[#00C853]">sprechen.</span>
            </h1>
            <p className="text-xl text-gray-400">
              Haben Sie ein Projekt? Wir freuen uns auf Ihre Nachricht.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Nachricht senden</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      data-testid="contact-name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00C853] focus:ring-0 outline-none transition-colors"
                      placeholder="Ihr Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">E-Mail *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      data-testid="contact-email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00C853] focus:ring-0 outline-none transition-colors"
                      placeholder="ihre@email.de"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">Unternehmen</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      data-testid="contact-company"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00C853] focus:ring-0 outline-none transition-colors"
                      placeholder="Ihr Unternehmen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      data-testid="contact-phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00C853] focus:ring-0 outline-none transition-colors"
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">Betreff *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    data-testid="contact-subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00C853] focus:ring-0 outline-none transition-colors"
                    placeholder="Worum geht es?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4A4A4A] mb-2">Nachricht *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    data-testid="contact-message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-[#00C853] focus:ring-0 outline-none transition-colors resize-none"
                    placeholder="Beschreiben Sie Ihr Projekt oder Ihre Anfrage..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-testid="contact-submit"
                  className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#00C853] text-white font-semibold rounded-md hover:bg-[#009624] disabled:opacity-50 transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      Nachricht senden
                      <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:pl-12">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">Kontaktdaten</h2>
              
              <div className="space-y-8 mb-12">
                <a href="mailto:info@precision-labs.de" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-[#1A1A1A] rounded-md flex items-center justify-center flex-shrink-0 group-hover:bg-[#00C853] transition-colors">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">E-Mail</div>
                    <div className="text-[#4A4A4A] group-hover:text-[#00C853] transition-colors">info@precision-labs.de</div>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#00C853] rounded-md flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-[#1A1A1A]">Adresse</div>
                    <div className="text-[#4A4A4A]">
                      Römerstraße 90<br />
                      79618 Rheinfelden (Baden), Deutschland
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-[#F4F7F5] p-8 rounded-lg">
                <h3 className="font-bold text-[#1A1A1A] mb-4">Öffnungszeiten</h3>
                <div className="space-y-2 text-[#4A4A4A]">
                  <div className="flex justify-between">
                    <span>Montag – Freitag</span>
                    <span className="font-semibold text-[#1A1A1A]">09:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samstag – Sonntag</span>
                    <span className="text-gray-400">Geschlossen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-96 bg-[#F4F7F5] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="text-[#00C853] mx-auto mb-4" size={48} strokeWidth={1.5} />
            <p className="text-[#4A4A4A] font-medium">Römerstraße 90, 79618 Rheinfelden (Baden)</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kontakt;
