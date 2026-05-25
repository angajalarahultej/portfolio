'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { Resume } from '@/lib/types';

interface ResumeSectionProps {
  activeResume: Resume | null;
}

export default function ResumeSection({ activeResume }: ResumeSectionProps) {
  // If there's no active resume uploaded, display a default callout
  const handleDownload = () => {
    if (activeResume?.file_url) {
      window.open(activeResume.file_url, '_blank');
    } else {
      // Direct mock PDF file for local demonstration
      window.open('https://raw.githubusercontent.com/pdf-association/pdf-test-files/master/general/chevron.pdf', '_blank');
    }
  };

  return (
    <section id="resume" className="py-24 max-w-4xl mx-auto px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-8 md:p-12 rounded-3xl text-center shadow-md border border-white/60 relative overflow-hidden"
      >
        {/* Decorative corner glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-50" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-50 to-pink-50 text-indigo-600 rounded-2xl border border-white/55 shadow-sm flex items-center justify-center">
            <FileText size={32} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Documents</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Curriculum Vitae
            </h2>
            <p className="text-sm text-slate-500 font-light max-w-md mx-auto">
              Review my detailed experience, educational details, and complete project list by downloading my professional resume.
            </p>
          </div>

          {/* Active Resume Card */}
          <div className="inline-flex items-center justify-center gap-3 bg-white/60 border border-slate-100 rounded-2xl px-5 py-3 shadow-inner max-w-full">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span className="text-sm font-semibold text-slate-700 truncate max-w-[250px] sm:max-w-[400px]">
              {activeResume ? activeResume.name : 'Alex Rivera - Senior Software Engineer.pdf'}
            </span>
          </div>

          <div className="pt-4">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Download size={18} />
              Download Resume
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
