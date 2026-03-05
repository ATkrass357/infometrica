import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const LOGO_URL = "https://static.prod-images.emergentagent.com/jobs/7bea0805-458a-46a4-83aa-a7ef43569440/images/31c2d350dad6978320d16680435185ac4d3ed1b7bc213f06a2774d3ee186a694.png";

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
          ? 'py-3 glass border-b border-white/20 shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="nav-logo">
            <img 
              src={LOGO_URL} 
              alt="Precision Labs" 
              className="h-12 w-auto"
            />
            <span className="text-xl font-bold text-[#0A0A0A]">
              Precision <span className="text-[#00C853]">Labs</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-white/50 backdrop-blur-sm rounded-full px-2 py-1 border border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.name.toLowerCase()}`}
                className={`relative px-5 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                  isActive(link.path)
                    ? 'bg-[#0A0A0A] text-white'
                    : 'text-slate-600 hover:text-[#0A0A0A]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            to="/kontakt"
            data-testid="nav-cta"
            className="hidden lg:inline-flex items-center gap-2 h-11 px-6 bg-[#00C853] text-white text-sm font-semibold rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-[#00C853]/20"
          >
            Beratung anfragen
            <ArrowRight size={16} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#0A0A0A] hover:bg-slate-100 rounded-full transition-colors"
            data-testid="nav-mobile-toggle"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 top-0 bg-white z-50 transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Precision Labs" className="h-12" />
              <span className="text-xl font-bold text-[#0A0A0A]">
                Precision <span className="text-[#00C853]">Labs</span>
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-4 px-4 text-2xl font-semibold rounded-xl transition-colors ${
                  isActive(link.path)
                    ? 'bg-[#F0FDF4] text-[#00C853]'
                    : 'text-[#0A0A0A] hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <Link
            to="/kontakt"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 flex items-center justify-center gap-2 h-14 bg-[#00C853] text-white font-semibold rounded-full"
          >
            Beratung anfragen
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </nav>
  );
};
