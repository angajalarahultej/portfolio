'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  name: string;
}

export default function Navbar({ name }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll listener is no longer needed since navbar is always fixed
  useEffect(() => {
    // Keep empty or remove
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Resume', href: '#resume' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-navbar py-3 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo/Name */}
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1">
          Angajala Rahultej
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
          <Link
            href="/admin"
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors border border-slate-200 hover:border-slate-400 rounded-full px-3 py-1.5"
          >
            Admin Panel
          </Link>
          <a
            href="#contact"
            onClick={(e) => handleScroll(e, '#contact')}
            className="inline-flex items-center gap-1 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-full transition-all duration-200 shadow-sm shadow-indigo-100 hover:shadow-md hover:-translate-y-0.5"
          >
            Hire Me
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/admin"
            className="text-xs font-medium text-slate-400 border border-slate-200 rounded-full px-2.5 py-1"
          >
            Admin
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-navbar shadow-lg animate-fadeIn">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-base font-semibold text-slate-700 hover:text-indigo-600 transition-colors py-1.5"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, '#contact')}
              className="inline-flex items-center justify-center gap-1 bg-indigo-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 mt-2"
            >
              Hire Me
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
