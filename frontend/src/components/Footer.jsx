import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';

const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/7bea0805-458a-46a4-83aa-a7ef43569440/images/31c2d350dad6978320d16680435185ac4d3ed1b7bc213f06a2774d3ee186a694.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    navigation: [
      { name: 'Startseite', path: '/' },
      { name: 'Unternehmen', path: '/unternehmen' },
      { name: 'Leistungen', path: '/dienstleistungen' },
      { name: 'Karriere', path: '/karriere' },
      { name: 'Kontakt', path: '/kontakt' },
    ],
    legal: [
      { name: 'Impressum', path: '/impressum' },
      { name: 'Datenschutz', path: '/datenschutz' },
      { name: 'Mitarbeiter Login', path: '/mitarbeiter/login' },
    ],
  };

  return (
    <footer className="bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,83,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,83,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <img src={LOGO_URL} alt="Precision Labs" className="h-14 brightness-0 invert" />
              <span className="text-2xl font-bold text-white">
                Precision <span className="text-[#00C853]">Labs</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm mb-8">
              Ihr Partner für professionelles Application Testing. 
              Deutsche Präzision trifft auf modernste Testing-Methoden.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4">
              <a 
                href="mailto:info@precision-labs.de" 
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00C853] transition-colors duration-300">
                  <Mail size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors">info@precision-labs.de</span>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                  <MapPin size={18} className="text-slate-400" />
                </div>
                <span className="text-slate-400">Römerstraße 90, 79618 Rheinfelden (Baden)</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Navigation */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-6">Navigation</h4>
              <ul className="space-y-4">
                {links.navigation.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.name}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-6">Services</h4>
              <ul className="space-y-4">
                {['Funktionales Testing', 'Performance Testing', 'Usability Testing', 'Automatisierung'].map((service) => (
                  <li key={service}>
                    <Link 
                      to="/dienstleistungen"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-6">Rechtliches</h4>
              <ul className="space-y-4">
                {links.legal.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} Precision Labs. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse"></span>
              Made with precision in Germany
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
