'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Code } from 'lucide-react';
import { Github } from './BrandIcons';
import { Project } from '@/lib/types';

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  // Extract all unique tags
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags.includes(selectedTag))
    : projects;

  const sortedProjects = [...filteredProjects].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="projects" className="py-24 max-w-6xl mx-auto px-6 relative z-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">My Works</span>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
          Featured Projects
        </h2>
        <p className="text-sm text-slate-500 font-light">
          A showcase of some of my key applications, tools, and open-source contributions.
        </p>
      </div>

      {/* Filter Tags Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <button
          onClick={() => setSelectedTag(null)}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
            selectedTag === null
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white/60 text-slate-600 hover:bg-white hover:text-indigo-600 border border-slate-200/50'
          }`}
        >
          All Projects
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
              selectedTag === tag
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white/60 text-slate-600 hover:bg-white hover:text-indigo-600 border border-slate-200/50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Projects Grid with AnimatePresence */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {sortedProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="glass-panel glass-panel-hover overflow-hidden rounded-3xl flex flex-col justify-between group shadow-sm border border-white/60"
            >
              <div>
                {/* Project Image */}
                <div className="relative overflow-hidden aspect-video bg-slate-100">
                  <img
                    src={project.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle Tech Overlay */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 flex items-center gap-1 border border-white">
                    <Code size={10} className="text-indigo-600" />
                    {project.tags[0]}
                  </div>
                </div>

                {/* Info Text */}
                <div className="p-6">
                  <h3 className="font-display font-bold text-slate-800 text-lg md:text-xl mb-2 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 font-light text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Sub-tags list */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-slate-50 text-slate-500 text-[10px] font-medium border border-slate-100 rounded-full px-2 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center gap-3">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all"
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                )}
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 transition-all shadow-sm"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
