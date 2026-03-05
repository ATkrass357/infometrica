import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="nav-logo">
            <div className="w-10 h-10 bg-[#00C853] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">
              Precision <span className="text-[#00C853]">Labs</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.name.toLowerCase()}`}
                className={`relative px-5 py-2 text-sm font-medium tracking-wide transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-[#00C853]'
                    : 'text-[#4A4A4A] hover:text-[#00C853]'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-5 right-5 h-0.5 bg-[#00C853] rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            to="/kontakt"
            data-testid="nav-cta"
            className="hidden lg:inline-flex items-center gap-2 px-6 py-3 bg-[#00C853] text-white text-sm font-semibold rounded-md hover:bg-[#009624] hover:scale-105 transition-all duration-200 shadow-lg shadow-[#00C853]/20"
          >
            Beratung anfragen
            <ArrowRight size={16} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#1A1A1A]"
            data-testid="nav-mobile-toggle"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 top-20 bg-white z-50 transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}>
        <div className="flex flex-col p-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-4 text-xl font-semibold border-b border-gray-100 transition-colors ${
                isActive(link.path)
                  ? 'text-[#00C853]'
                  : 'text-[#1A1A1A] hover:text-[#00C853]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/kontakt"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-6 flex items-center justify-center gap-2 py-4 bg-[#00C853] text-white font-semibold rounded-md"
          >
            Beratung anfragen
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
};
