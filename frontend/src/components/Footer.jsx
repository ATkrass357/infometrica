import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#00C853] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Precision <span className="text-[#00C853]">Labs</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md mb-8">
              Ihr Partner für professionelles Application Testing. 
              Deutsche Präzision trifft auf modernste Testing-Methoden.
            </p>
            {/* Contact Info */}
            <div className="space-y-4">
              <a href="mailto:info@precision-labs.de" className="flex items-center gap-3 text-gray-400 hover:text-[#00C853] transition-colors group">
                <div className="w-10 h-10 bg-[#2A2A2A] rounded-md flex items-center justify-center group-hover:bg-[#00C853] transition-colors">
                  <Mail size={18} />
                </div>
                <span>info@precision-labs.de</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-[#2A2A2A] rounded-md flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <span>Potsdamer Straße 6, 14947 Nuthe-Urstromtal</span>
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
                      className="text-gray-400 hover:text-[#00C853] transition-colors inline-flex items-center gap-1 group"
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
                      className="text-gray-400 hover:text-[#00C853] transition-colors"
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
                  <Link to="/impressum" className="text-gray-400 hover:text-[#00C853] transition-colors">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link to="/datenschutz" className="text-gray-400 hover:text-[#00C853] transition-colors">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link to="/mitarbeiter/login" className="text-gray-400 hover:text-[#00C853] transition-colors">
                    Mitarbeiter-Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} Precision Labs. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-500">Made with precision in Germany</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
