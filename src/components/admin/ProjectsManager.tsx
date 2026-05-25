'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { getProjects, upsertProject, deleteProject, uploadProjectImage } from '@/lib/db';
import { Code, Plus, Trash2, Edit2, Save, Upload, ExternalLink, RefreshCw } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProjectsList = async () => {
    setLoading(true);
    const data = await getProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjectsList();
  }, []);

  const handleStartAdd = () => {
    setEditingProject({
      title: '',
      description: '',
      long_description: '',
      image_url: '',
      github_url: '',
      live_url: '',
      tags: [],
      display_order: projects.length + 1,
    });
    setTagInput('');
    setIsEditing(true);
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProject(proj);
    setTagInput(proj.tags.join(', '));
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage(null);

    try {
      const publicUrl = await uploadProjectImage(files[0]);
      if (publicUrl) {
        setEditingProject((prev) => ({ ...prev, image_url: publicUrl }));
        setMessage({ type: 'success', text: 'Project image uploaded!' });
      } else {
        setMessage({ type: 'error', text: 'Image upload failed.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error uploading image file.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    // Process tags
    const processedTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      ...editingProject,
      tags: processedTags,
    } as Omit<Project, 'id'> & { id?: string };

    const success = await upsertProject(payload);
    if (success) {
      setMessage({ type: 'success', text: 'Project saved successfully!' });
      setIsEditing(false);
      setEditingProject(null);
      fetchProjectsList();
    } else {
      setMessage({ type: 'error', text: 'Failed to save project.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const success = await deleteProject(id);
    if (success) {
      setMessage({ type: 'success', text: 'Project deleted.' });
      fetchProjectsList();
    } else {
      setMessage({ type: 'error', text: 'Failed to delete project.' });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Code size={20} className="text-indigo-600" />
            Projects Showcase
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Manage your project credentials, screenshots, technologies, and external links.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <Plus size={14} />
            Add Project
          </button>
        )}
      </div>

      {message && (
        <p
          className={`text-xs font-semibold ${
            message.type === 'success' ? 'text-emerald-600' : 'text-pink-600'
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Editing View */}
      {isEditing && editingProject ? (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-200/50 space-y-5 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-700">
            {editingProject.id ? 'Edit Project' : 'Create New Project'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Project Title</label>
              <input
                type="text"
                required
                value={editingProject.title}
                onChange={(e) => setEditingProject((prev) => ({ ...prev!, title: e.target.value }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Short Description</label>
              <input
                type="text"
                required
                value={editingProject.description}
                onChange={(e) => setEditingProject((prev) => ({ ...prev!, description: e.target.value }))}
                placeholder="A simple 1-sentence teaser for the card summary"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Long Description (Optional)</label>
              <textarea
                rows={3}
                value={editingProject.long_description || ''}
                onChange={(e) => setEditingProject((prev) => ({ ...prev!, long_description: e.target.value }))}
                placeholder="Detailed context, challenges solved, architecture details"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Image Uploader */}
            <div className="space-y-1.5 sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-150 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-24 h-16 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                {editingProject.image_url ? (
                  <img src={editingProject.image_url} alt="Cover Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px] font-medium">No Image</div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Project Card Image</label>
                <label className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-500 text-xs font-semibold text-slate-700 cursor-pointer rounded-lg shadow-sm transition-all">
                  <Upload size={12} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">GitHub Link</label>
              <input
                type="url"
                value={editingProject.github_url || ''}
                onChange={(e) => setEditingProject((prev) => ({ ...prev!, github_url: e.target.value }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Live URL</label>
              <input
                type="url"
                value={editingProject.live_url || ''}
                onChange={(e) => setEditingProject((prev) => ({ ...prev!, live_url: e.target.value }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Technologies/Tags (comma-separated)</label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Next.js, TypeScript, Supabase"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Display Order</label>
              <input
                type="number"
                value={editingProject.display_order}
                onChange={(e) => setEditingProject((prev) => ({ ...prev!, display_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-xl text-xs transition-all shadow-sm"
            >
              <Save size={12} />
              Save Project
            </button>
            <button
              type="button"
              onClick={() => { setIsEditing(false); setEditingProject(null); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* Grid List of Projects */
        <div>
          {loading ? (
            <div className="text-slate-400 text-xs py-4 flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-slate-400" />
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-slate-400 text-xs py-4 italic">No projects found. Create your first one above!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="flex items-start gap-4 p-4 bg-white/40 border border-slate-200 rounded-2xl shadow-sm hover:shadow"
                >
                  <div className="w-20 h-14 bg-slate-150 rounded-lg overflow-hidden shrink-0">
                    {proj.image_url ? (
                      <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No image</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{proj.title}</h3>
                    <p className="text-[11px] text-slate-500 truncate mb-1.5">{proj.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {proj.tags.slice(0, 3).map((t) => (
                        <span key={t} className="bg-slate-50 border border-slate-100 rounded-full px-1.5 py-0.5 text-[8px] text-slate-400">
                          {t}
                        </span>
                      ))}
                      {proj.tags.length > 3 && (
                        <span className="text-[8px] text-slate-400">+{proj.tags.length - 3} more</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(proj)}
                        className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        <Edit2 size={10} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="inline-flex items-center gap-0.5 text-[10px] font-bold text-pink-600 hover:text-pink-700"
                      >
                        <Trash2 size={10} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
