'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Award } from 'lucide-react';
import { Experience } from '@/lib/types';

interface ExperienceProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceProps) {
  const [activeTab, setActiveTab] = useState<'job' | 'internship'>('job');

  const filteredExp = experiences
    .filter((e) => e.type === activeTab)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="experience" className="py-24 max-w-5xl mx-auto px-6 relative z-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Career Path</span>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
          Professional Experience
        </h2>
        <p className="text-sm text-slate-500 font-light">
          A timeline of my professional accomplishments, internships, and full-time engineering career.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-4 mb-14">
        <button
          onClick={() => setActiveTab('job')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeTab === 'job'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200/50'
          }`}
        >
          <Briefcase size={16} />
          Full-Time Jobs
        </button>
        <button
          onClick={() => setActiveTab('internship')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
            activeTab === 'internship'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200/50'
          }`}
        >
          <Award size={16} />
          Internships
        </button>
      </div>

      {/* Timeline Layout */}
      {filteredExp.length === 0 ? (
        <div className="text-center text-slate-500 bg-white/40 py-12 rounded-3xl border border-white/60">
          No records found for this category.
        </div>
      ) : (
        <div className="relative border-l border-indigo-100 ml-4 md:ml-12 pl-6 md:pl-10 space-y-12">
          {filteredExp.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 border-indigo-600 bg-white shadow-sm flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              </div>

              {/* Card content */}
              <div className="glass-panel glass-panel-hover p-6 md:p-8 rounded-3xl shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-lg md:text-xl">
                      {exp.role}
                    </h3>
                    <p className="text-sm font-semibold text-indigo-600">{exp.company}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1">
                      <Calendar size={12} className="text-slate-400" />
                      {exp.start_date} – {exp.end_date || 'Present'}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1">
                        <MapPin size={12} className="text-slate-400" />
                        {exp.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description Bullets */}
                {exp.description && (
                  <ul className="list-disc pl-4 space-y-2 text-slate-600 font-light text-sm">
                    {exp.description.split('\n').map((bullet, i) => (
                      <li key={i}>{bullet.replace(/^-\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
