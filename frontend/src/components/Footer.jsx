import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { InfometricaLogo } from './Logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <InfometricaLogo className="w-10 h-10" />
              <span className="text-xl font-black tracking-tight">
                INFO<span className="text-orange-500">METRICA</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md mb-8">
              Ihr Partner für professionelles Application Testing. 
              Deutsche Präzision trifft auf modernste Testing-Methoden.
            </p>
            {/* Contact Info */}
            <div className="space-y-4">
              <a href="mailto:info@infometrica.de" className="flex items-center gap-3 text-slate-400 hover:text-orange-500 transition-colors group">
                <div className="w-10 h-10 bg-slate-800 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <Mail size={18} />
                </div>
                <span>info@infometrica.de</span>
              </a>
              <a href="tel:+4930123456789" className="flex items-center gap-3 text-slate-400 hover:text-orange-500 transition-colors group">
                <div className="w-10 h-10 bg-slate-800 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                  <Phone size={18} />
                </div>
                <span>+49 (0) 30 123 456 789</span>
              </a>
              <div className="flex items-center gap-3 text-slate-400">
                <div className="w-10 h-10 bg-slate-800 flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <span>Tauentzienstraße 9-12, 10789 Berlin</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Navigation */}
            <div>
              <h4 className="text-sm font-bold tracking-wider text-white mb-6">NAVIGATION</h4>
              <ul className="space-y-4">
                {['Startseite', 'Unternehmen', 'Leistungen', 'Karriere', 'Kontakt'].map((item) => (
                  <li key={item}>
                    <Link 
                      to={item === 'Startseite' ? '/' : item === 'Leistungen' ? '/dienstleistungen' : `/${item.toLowerCase()}`}
                      className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {item}
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-bold tracking-wider text-white mb-6">LEISTUNGEN</h4>
              <ul className="space-y-4">
                {['Funktionales Testing', 'Performance Testing', 'Usability Testing', 'Automatisierung', 'QA Beratung'].map((item) => (
                  <li key={item}>
                    <Link 
                      to="/dienstleistungen"
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold tracking-wider text-white mb-6">RECHTLICHES</h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/impressum" className="text-slate-400 hover:text-white transition-colors">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link to="/datenschutz" className="text-slate-400 hover:text-white transition-colors">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link to="/mitarbeiter/login" className="text-slate-400 hover:text-white transition-colors">
                    Mitarbeiter-Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} Infometrica GmbH. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-slate-500">Made with precision in Berlin</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
