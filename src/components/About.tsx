'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { Profile } from '@/lib/types';

interface AboutProps {
  profile: Profile;
}

export default function About({ profile }: AboutProps) {
  return (
    <section id="about" className="py-24 max-w-6xl mx-auto px-6 relative z-10">
      {/* Scroll Reveal Animation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center"
      >
        {/* Avatar Image Card */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative group">
            {/* Soft decorative background pastel glow */}

            
            <div className="relative glass-panel p-4 rounded-3xl shadow-lg max-w-[320px]">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300'}
                alt={profile.name}
                className="w-full h-auto aspect-square object-cover rounded-2xl shadow-inner bg-slate-100"
              />
              <div className="mt-4 text-center">
                <h3 className="font-display font-bold text-slate-800 text-lg">{profile.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{profile.title}</p>
              </div>
            </div>
          </div>
        </div>

        {/* About Info details */}
        <div className="md:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">About Me</span>

          </div>

          <p className="text-slate-600 leading-relaxed text-base font-light">
            {profile.about}
          </p>

          {/* Quick Details Table/Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {profile.location && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50/50 text-indigo-600 rounded-xl">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Location</p>
                  <p className="text-sm font-semibold text-slate-700">{profile.location}</p>
                </div>
              </div>
            )}

            {profile.email && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50/50 text-pink-600 rounded-xl">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Email</p>
                  <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">
                    <a href={`mailto:${profile.email}`} className="hover:underline">
                      {profile.email}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {profile.phone && (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50/50 text-sky-600 rounded-xl">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Phone</p>
                  <p className="text-sm font-semibold text-slate-700">{profile.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50/50 text-amber-600 rounded-xl">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Availability</p>
                <p className="text-sm font-semibold text-emerald-600">Open to opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
