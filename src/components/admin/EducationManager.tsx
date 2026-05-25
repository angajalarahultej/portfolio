'use client';

import React, { useState, useEffect } from 'react';
import { Education } from '@/lib/types';
import { getEducation, upsertEducation, deleteEducation } from '@/lib/db';
import { GraduationCap, Plus, Trash2, Edit2, Save, RefreshCw } from 'lucide-react';

export default function EducationManager() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEdu, setEditingEdu] = useState<Partial<Education> | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchEducationList = async () => {
    setLoading(true);
    const data = await getEducation();
    setEducation(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEducationList();
  }, []);

  const handleStartAdd = () => {
    setEditingEdu({
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      grade: '',
      description: '',
      display_order: education.length + 1,
    });
  };

  const handleStartEdit = (edu: Education) => {
    setEditingEdu(edu);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;

    if (!editingEdu.institution?.trim() || !editingEdu.degree?.trim() || !editingEdu.start_date?.trim()) {
      setMessage({ type: 'error', text: 'Institution, degree, and start date are required.' });
      return;
    }

    const payload = {
      ...editingEdu,
      institution: editingEdu.institution.trim(),
      degree: editingEdu.degree.trim(),
    } as Omit<Education, 'id'> & { id?: string };

    const success = await upsertEducation(payload);
    if (success) {
      setMessage({ type: 'success', text: 'Education record saved successfully!' });
      setEditingEdu(null);
      fetchEducationList();
    } else {
      setMessage({ type: 'error', text: 'Failed to save education record.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    const success = await deleteEducation(id);
    if (success) {
      setMessage({ type: 'success', text: 'Education entry deleted.' });
      fetchEducationList();
    } else {
      setMessage({ type: 'error', text: 'Failed to delete education entry.' });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap size={20} className="text-indigo-600" />
            Education Details
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Manage your schools, universities, degrees, GPAs/grades, and coursework focus.
          </p>
        </div>
        {!editingEdu && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <Plus size={14} />
            Add Education
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

      {/* Editing Panel Form */}
      {editingEdu ? (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-200/50 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-700">
            {editingEdu.id ? 'Edit Education Entry' : 'Add Education Entry'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Institution Name</label>
              <input
                type="text"
                required
                value={editingEdu.institution || ''}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev!, institution: e.target.value }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Degree (e.g. Bachelor of Science)</label>
              <input
                type="text"
                required
                value={editingEdu.degree || ''}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev!, degree: e.target.value }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Field of Study (e.g. Computer Science)</label>
              <input
                type="text"
                value={editingEdu.field_of_study || ''}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev!, field_of_study: e.target.value }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Grade / GPA (Optional)</label>
              <input
                type="text"
                value={editingEdu.grade || ''}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev!, grade: e.target.value }))}
                placeholder="e.g. GPA: 3.9/4.0 or First Class"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Display Order</label>
              <input
                type="number"
                value={editingEdu.display_order || 0}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev!, display_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Start Date</label>
              <input
                type="text"
                required
                value={editingEdu.start_date || ''}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev!, start_date: e.target.value }))}
                placeholder="e.g. Sep 2018"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">End Date (Blank if Current)</label>
              <input
                type="text"
                value={editingEdu.end_date || ''}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev!, end_date: e.target.value }))}
                placeholder="e.g. Jun 2022 or Present"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Description / Achievements</label>
              <textarea
                rows={3}
                value={editingEdu.description || ''}
                onChange={(e) => setEditingEdu((prev) => ({ ...prev!, description: e.target.value }))}
                placeholder="Specialized in software engineering... Honors society..."
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all resize-none font-light"
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
              onClick={() => setEditingEdu(null)}
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
              Loading education...
            </div>
          ) : education.length === 0 ? (
            <div className="text-slate-400 text-xs py-4 italic">No education entries found.</div>
          ) : (
            <div className="space-y-4">
              {education
                .sort((a, b) => a.display_order - b.display_order)
                .map((edu) => (
                  <div
                    key={edu.id}
                    className="p-5 bg-white/40 border border-slate-200 rounded-2xl shadow-sm hover:shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{edu.institution}</h3>
                      <p className="text-xs font-semibold text-indigo-650">
                        {edu.degree} {edu.field_of_study ? `in ${edu.field_of_study}` : ''}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {edu.start_date} – {edu.end_date || 'Present'} {edu.grade ? `| ${edu.grade}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(edu)}
                        className="inline-flex items-center gap-0.5 px-2.5 py-1.5 bg-white border border-slate-250 hover:border-slate-400 text-[10px] font-bold text-slate-700 rounded-lg transition-all"
                      >
                        <Edit2 size={10} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
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
