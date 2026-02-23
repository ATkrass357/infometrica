import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
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
      <section className="pt-32 pb-16 px-6 lg:px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="text-orange-500 font-semibold tracking-wide mb-4">KONTAKT</div>
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Lassen Sie uns<br />
              <span className="text-orange-500">sprechen.</span>
            </h1>
            <p className="text-xl text-slate-400">
              Haben Sie ein Projekt? Wir freuen uns auf Ihre Nachricht.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Nachricht senden</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 focus:border-orange-500 focus:ring-0 outline-none transition-colors"
                      placeholder="Ihr Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">E-Mail *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 focus:border-orange-500 focus:ring-0 outline-none transition-colors"
                      placeholder="ihre@email.de"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Unternehmen</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 focus:border-orange-500 focus:ring-0 outline-none transition-colors"
                      placeholder="Ihr Unternehmen"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 focus:border-orange-500 focus:ring-0 outline-none transition-colors"
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Betreff *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-300 focus:border-orange-500 focus:ring-0 outline-none transition-colors"
                    placeholder="Worum geht es?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nachricht *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 focus:border-orange-500 focus:ring-0 outline-none transition-colors resize-none"
                    placeholder="Beschreiben Sie Ihr Projekt oder Ihre Anfrage..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all duration-300"
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
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Kontaktdaten</h2>
              
              <div className="space-y-8 mb-12">
                <a href="mailto:info@benke-it.de" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">E-Mail</div>
                    <div className="text-slate-600 group-hover:text-orange-500 transition-colors">info@benke-it.de</div>
                  </div>
                </a>

                <a href="tel:+4930123456789" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-slate-900 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Telefon</div>
                    <div className="text-slate-600 group-hover:text-orange-500 transition-colors">+49 (0) 30 123 456 789</div>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Adresse</div>
                    <div className="text-slate-600">
                      Potsdamer Straße 6<br />
                      14947 Nuthe-Urstromtal, Deutschland
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-slate-50 p-8">
                <h3 className="font-bold text-slate-900 mb-4">Öffnungszeiten</h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Montag – Freitag</span>
                    <span className="font-semibold text-slate-900">09:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samstag – Sonntag</span>
                    <span className="text-slate-400">Geschlossen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-96 bg-slate-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="text-slate-400 mx-auto mb-4" size={48} />
            <p className="text-slate-500 font-medium">Potsdamer Straße 6, Nuthe-Urstromtal</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kontakt;
