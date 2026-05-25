'use client';

import React, { useState } from 'react';
import { motion as motionClient } from 'framer-motion';
import { Skill } from '@/lib/types';
import { Cpu, Layout, Server } from 'lucide-react';

interface SkillsProps {
  skills: Skill[];
}

export default function Skills({ skills }: SkillsProps) {
  // Extract categories from skills
  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || 'Languages');

  // Filter skills by category
  const filteredSkills = skills.filter((s) => s.category === activeCategory);

  // Helper to map category to icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Layout size={18} />;
      case 'backend':
        return <Server size={18} />;
      case 'languages':
        return <Cpu size={18} />;
      default:
        return <Server size={18} />;
    }
  };

  return (
    <section id="skills" className="py-24 bg-white/20 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motionClient.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-3"
        >
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Capabilities</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Technical Skillset
          </h2>
          <p className="text-sm text-slate-500 font-light">
            Here is my level of proficiency in various core web technologies, backend architectures, and developer tools.
          </p>
        </motionClient.div>

        {/* Categories Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'bg-white/60 text-slate-600 hover:bg-white hover:text-indigo-600 border border-slate-200/50'
              }`}
            >
              {getCategoryIcon(category)}
              {category}
            </button>
          ))}
        </div>

        {/* Skills Bars Grid */}
        <motionClient.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl mx-auto"
        >
          {filteredSkills.map((skill) => (
            <motionClient.div
              layout
              key={skill.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white/40 border border-white/60 p-5 rounded-2xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-800">{skill.name}</span>
                <span className="text-xs font-bold text-indigo-600">{skill.proficiency}%</span>
              </div>
              
              {/* Animated Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <motionClient.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                />
              </div>
            </motionClient.div>
          ))}
        </motionClient.div>
      </div>
    </section>
  );
}
