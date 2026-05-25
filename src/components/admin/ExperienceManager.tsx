'use client';

import React, { useState, useEffect } from 'react';
import { Experience } from '@/lib/types';
import { getExperience, upsertExperience, deleteExperience } from '@/lib/db';
import { Briefcase, Plus, Trash2, Edit2, Save, RefreshCw } from 'lucide-react';

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<Partial<Experience> | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchExperienceList = async () => {
    setLoading(true);
    const data = await getExperience();
    setExperiences(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExperienceList();
  }, []);

  const handleStartAdd = () => {
    setEditingExp({
      company: '',
      role: '',
      type: 'job',
      start_date: '',
      end_date: '',
      location: '',
      description: '',
      display_order: experiences.length + 1,
    });
  };

  const handleStartEdit = (exp: Experience) => {
    setEditingExp(exp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;

    if (!editingExp.company?.trim() || !editingExp.role?.trim() || !editingExp.start_date?.trim()) {
      setMessage({ type: 'error', text: 'Company name, role, and start date are required.' });
      return;
    }

    const payload = {
      ...editingExp,
      company: editingExp.company.trim(),
      role: editingExp.role.trim(),
    } as Omit<Experience, 'id'> & { id?: string };

    const success = await upsertExperience(payload);
    if (success) {
      setMessage({ type: 'success', text: 'Experience saved successfully!' });
      setEditingExp(null);
      fetchExperienceList();
    } else {
      setMessage({ type: 'error', text: 'Failed to save experience details.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    const success = await deleteExperience(id);
    if (success) {
      setMessage({ type: 'success', text: 'Experience record deleted.' });
      fetchExperienceList();
    } else {
      setMessage({ type: 'error', text: 'Failed to delete record.' });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Briefcase size={20} className="text-indigo-600" />
            Work Experience & Internships
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Maintain your professional career timeline, job scopes, achievements, and internships.
          </p>
        </div>
        {!editingExp && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <Plus size={14} />
            Add Experience
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

      {/* Form view */}
      {editingExp ? (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-200/50 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-700">
            {editingExp.id ? 'Edit Experience' : 'Add Experience Entry'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Company Name</label>
              <input
                type="text"
                required
                value={editingExp.company || ''}
                onChange={(e) => setEditingExp((prev) => ({ ...prev!, company: e.target.value }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Role Title</label>
              <input
                type="text"
                required
                value={editingExp.role || ''}
                onChange={(e) => setEditingExp((prev) => ({ ...prev!, role: e.target.value }))}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Classification</label>
              <select
                value={editingExp.type || 'job'}
                onChange={(e) => setEditingExp((prev) => ({ ...prev!, type: e.target.value as 'job' | 'internship' }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              >
                <option value="job">Full-Time Job</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Location</label>
              <input
                type="text"
                value={editingExp.location || ''}
                onChange={(e) => setEditingExp((prev) => ({ ...prev!, location: e.target.value }))}
                placeholder="e.g. New York, NY"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Start Date</label>
              <input
                type="text"
                required
                value={editingExp.start_date || ''}
                onChange={(e) => setEditingExp((prev) => ({ ...prev!, start_date: e.target.value }))}
                placeholder="e.g. Aug 2020"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">End Date (Blank if Current)</label>
              <input
                type="text"
                value={editingExp.end_date || ''}
                onChange={(e) => setEditingExp((prev) => ({ ...prev!, end_date: e.target.value }))}
                placeholder="e.g. May 2024 or Present"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Description / Achievements (one bullet per line)</label>
              <textarea
                rows={5}
                value={editingExp.description || ''}
                onChange={(e) => setEditingExp((prev) => ({ ...prev!, description: e.target.value }))}
                placeholder="Managed full development lifecycle...&#10;Mentored 3 junior devs...&#10;Decreased loading latency by 20%..."
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all resize-none font-light"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Display Order</label>
              <input
                type="number"
                value={editingExp.display_order || 0}
                onChange={(e) => setEditingExp((prev) => ({ ...prev!, display_order: parseInt(e.target.value) || 0 }))}
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
              Save Record
            </button>
            <button
              type="button"
              onClick={() => setEditingExp(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* List View */
        <div>
          {loading ? (
            <div className="text-slate-400 text-xs py-4 flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-slate-400" />
              Loading experience...
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-slate-400 text-xs py-4 italic">No experience entries found.</div>
          ) : (
            <div className="space-y-4">
              {experiences
                .sort((a, b) => a.display_order - b.display_order)
                .map((exp) => (
                  <div
                    key={exp.id}
                    className="p-5 bg-white/40 border border-slate-200 rounded-2xl shadow-sm hover:shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{exp.role}</h3>
                      <p className="text-xs font-semibold text-indigo-650">{exp.company}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {exp.start_date} – {exp.end_date || 'Present'} | {exp.location || 'Remote'}
                      </p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 border border-slate-200/50 rounded-full text-[9px] font-bold text-slate-500 uppercase">
                        {exp.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(exp)}
                        className="inline-flex items-center gap-0.5 px-2.5 py-1.5 bg-white border border-slate-250 hover:border-slate-400 text-[10px] font-bold text-slate-700 rounded-lg transition-all"
                      >
                        <Edit2 size={10} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="inline-flex items-center gap-0.5 px-2.5 py-1.5 bg-pink-50 border border-pink-200 hover:bg-pink-100 text-[10px] font-bold text-pink-650 rounded-lg transition-all"
                      >
                        <Trash2 size={10} />
                        Delete
                      </button>
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
