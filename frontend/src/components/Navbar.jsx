import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { InfometricaLogo } from './Logo';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Startseite', path: '/' },
    { name: 'Unternehmen', path: '/unternehmen' },
    { name: 'Leistungen', path: '/dienstleistungen' },
    { name: 'Karriere', path: '/karriere' },
    { name: 'Kontakt', path: '/kontakt' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <InfometricaLogo className="w-10 h-10" />
            <span className={`text-xl font-black tracking-tight transition-colors duration-300 ${
              isScrolled ? 'text-slate-900' : 'text-slate-900'
            }`}>
              INFO<span className="text-orange-500">METRICA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-orange-500'
                    : 'text-slate-700 hover:text-orange-500'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-orange-500" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            to="/kontakt"
            className="hidden lg:inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all duration-300"
          >
            Beratung anfragen
            <ArrowRight size={16} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-900"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 top-20 bg-white z-50 transition-all duration-500 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div className="flex flex-col p-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-4 text-xl font-semibold border-b border-slate-100 transition-colors ${
                isActive(link.path)
                  ? 'text-orange-500'
                  : 'text-slate-900 hover:text-orange-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/kontakt"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-6 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-semibold"
          >
            Beratung anfragen
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
};
