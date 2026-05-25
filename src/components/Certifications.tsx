'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { Certification } from '@/lib/types';

interface CertificationsProps {
  certifications: Certification[];
}

export default function Certifications({ certifications }: CertificationsProps) {
  const sortedCerts = [...certifications].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="certifications" className="py-24 bg-white/20 relative z-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Credentials</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Certifications
          </h2>
          <p className="text-sm text-slate-500 font-light">
            Professional certifications, badges, and verified technical credentials.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedCerts.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel glass-panel-hover p-6 rounded-3xl flex items-start gap-4 shadow-sm border border-white/60"
            >
              {/* Certification Icon */}
              <div className="p-3 bg-gradient-to-tr from-emerald-50 to-indigo-50 text-emerald-600 rounded-2xl border border-white/55 shadow-sm shrink-0">
                <ShieldCheck size={24} />
              </div>

              {/* Text Info */}
              <div className="space-y-2 flex-1 min-w-0">
                <h3 className="font-display font-bold text-slate-800 text-base md:text-lg leading-snug truncate">
                  {cert.name}
                </h3>
                <p className="text-xs font-semibold text-indigo-650">{cert.issuer}</p>
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Issued: {cert.issue_date}
                  </span>
                  {cert.credential_id && (
                    <span className="bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5 text-[10px] font-mono text-slate-500 truncate">
                      ID: {cert.credential_id}
                    </span>
                  )}
                </div>

                {/* Verification URL Link */}
                {cert.credential_url && (
                  <div className="pt-2">
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Verify Credential
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
