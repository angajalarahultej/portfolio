'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Mail } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';
import { Profile } from '@/lib/types';

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  // Use a fallback premium abstract minimalist image if avatar_url isn't set or is generic


  const scrollToAbout = () => {
    const target = document.querySelector('#about');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">


      {/* Floating Animated Pastel Blur Orbs in Hero Area */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply filter animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-200/30 rounded-full blur-3xl mix-blend-multiply filter animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-12">
        {/* Glassmorphism Title Card Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-8 md:p-14 rounded-3xl inline-block max-w-full text-slate-800 shadow-xl"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xs md:text-sm font-semibold tracking-widest text-indigo-600 uppercase mb-4"
          >
            Welcome to my portfolio
          </motion.p>

          {/* Large Name Overlay */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-display text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            <span className="text-gradient-purple-blue">{profile.name}</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg md:text-2xl font-light text-slate-600 tracking-wide mb-8"
          >
            {profile.title}
          </motion.h2>

          {/* Social Icons inside overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex items-center justify-center gap-6 mb-8"
          >
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-indigo-600 transition-colors p-2 bg-white/60 hover:bg-white rounded-full shadow-sm hover:shadow"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-600 hover:text-indigo-600 transition-colors p-2 bg-white/60 hover:bg-white rounded-full shadow-sm hover:shadow"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="text-slate-600 hover:text-indigo-600 transition-colors p-2 bg-white/60 hover:bg-white rounded-full shadow-sm hover:shadow"
                aria-label="Email Admin"
              >
                <Mail size={20} />
              </a>
            )}
          </motion.div>

          {/* Interactive CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#projects"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-full shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Explore Projects
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white/80 hover:bg-white text-slate-800 font-semibold rounded-full border border-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Down Chevron Trigger */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <button
          onClick={scrollToAbout}
          className="text-slate-500 hover:text-indigo-600 transition-colors focus:outline-none"
          aria-label="Scroll to About"
        >
          <ChevronDown size={28} />
        </button>
      </div>
    </section>
  );
}
