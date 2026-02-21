import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import { InfometricaLogo } from './Logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <InfometricaLogo className="w-12 h-12" />
              <span className="text-2xl font-bold text-white">
                Info<span className="text-orange-500">metrica</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Ihr vertrauenswürdiger Partner für professionelle App-Testing-Lösungen. 
              Wir sorgen dafür, dass Ihre Anwendungen fehlerfrei und benutzerfreundlich sind.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors duration-200"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Schnelllinks</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors duration-200">
                  Startseite
                </Link>
              </li>
              <li>
                <Link to="/unternehmen" className="hover:text-orange-500 transition-colors duration-200">
                  Unternehmen
                </Link>
              </li>
              <li>
                <Link to="/dienstleistungen" className="hover:text-orange-500 transition-colors duration-200">
                  Dienstleistungen
                </Link>
              </li>
              <li>
                <Link to="/karriere" className="hover:text-orange-500 transition-colors duration-200">
                  Karriere
                </Link>
              </li>
              <li>
                <Link to="/kontakt" className="hover:text-orange-500 transition-colors duration-200">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-sm">info@infometrica.de</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-sm">+49 (0) 123 456789</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  Musterstraße 123<br />
                  10115 Berlin, Deutschland
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>© {currentYear} Infometrica. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};
