'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { Education } from '@/lib/types';

interface EducationProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationProps) {
  const sortedEdu = [...education].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="education" className="py-24 bg-white/10 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Academic History</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Education
          </h2>
          <p className="text-sm text-slate-500 font-light">
            My educational background and scholastic qualifications.
          </p>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedEdu.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel glass-panel-hover p-6 md:p-8 rounded-3xl shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Institution Icon Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-3 bg-gradient-to-tr from-indigo-50 to-pink-50 text-indigo-600 rounded-2xl border border-white/55 shadow-sm">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-lg md:text-xl leading-tight">
                      {edu.institution}
                    </h3>
                    <p className="text-sm font-semibold text-indigo-600 mt-0.5">
                      {edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}
                    </p>
                  </div>
                </div>

                {/* Grade Badge */}
                {edu.grade && (
                  <div className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-full px-3 py-1 text-xs font-bold mb-4">
                    <Award size={12} />
                    {edu.grade}
                  </div>
                )}

                {/* Description */}
                {edu.description && (
                  <p className="text-slate-600 font-light text-sm leading-relaxed mb-6">
                    {edu.description}
                  </p>
                )}
              </div>

              {/* Dates Footing */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium border-t border-slate-100/50 pt-4 mt-auto">
                <Calendar size={12} />
                <span>{edu.start_date} – {edu.end_date || 'Present'}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
