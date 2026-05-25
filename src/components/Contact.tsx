'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { submitMessage } from '@/lib/db';
import confetti from 'canvas-confetti';

interface ContactProps {
  email?: string | null;
  phone?: string | null;
  location?: string | null;
}

export default function Contact({ email, phone, location }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const isSuccess = await submitMessage(formData);
      if (isSuccess) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#a855f7', '#ec4899'],
        });
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 max-w-6xl mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column: Contact details info */}
        <div className="md:col-span-5 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Inquiries</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Let's Connect
            </h2>
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              If you have any job opportunities, project ideas, or questions, please don't hesitate to reach out. I will get back to you as soon as possible.
            </p>
          </div>

          <div className="space-y-4">
            {email && (
              <div className="flex items-center gap-4 bg-white/40 border border-white/60 p-4 rounded-2xl shadow-sm">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Email</p>
                  <a href={`mailto:${email}`} className="text-sm font-bold text-slate-700 hover:text-indigo-600">
                    {email}
                  </a>
                </div>
              </div>
            )}

            {phone && (
              <div className="flex items-center gap-4 bg-white/40 border border-white/60 p-4 rounded-2xl shadow-sm">
                <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Phone</p>
                  <span className="text-sm font-bold text-slate-700">{phone}</span>
                </div>
              </div>
            )}

            {location && (
              <div className="flex items-center gap-4 bg-white/40 border border-white/60 p-4 rounded-2xl shadow-sm">
                <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Address</p>
                  <span className="text-sm font-bold text-slate-700">{location}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact form panel */}
        <div className="md:col-span-7">
          <div className="glass-panel p-8 rounded-3xl shadow-sm border border-white/60">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display font-bold text-slate-800 text-lg">Thank you!</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Your message has been sent successfully. I will review it and follow up with you soon.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-6 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full text-xs font-semibold transition-all"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-semibold text-slate-500">
                      Name <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-white/60 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold text-slate-500">
                      Email Address <span className="text-pink-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 bg-white/60 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-semibold text-slate-500">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Inquiry subject"
                    className="w-full px-4 py-3 bg-white/60 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-slate-500">
                    Message <span className="text-pink-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 bg-white/60 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm focus:outline-none transition-all resize-none"
                  />
                </div>

                {error && <p className="text-xs font-semibold text-pink-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 font-semibold rounded-xl transition-all shadow-sm"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
