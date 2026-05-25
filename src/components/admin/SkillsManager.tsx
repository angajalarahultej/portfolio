'use client';

import React, { useState, useEffect } from 'react';
import { Skill } from '@/lib/types';
import { getSkills, upsertSkill, deleteSkill } from '@/lib/db';
import { Cpu, Plus, Trash2, Edit2, Save, X, RefreshCw } from 'lucide-react';

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSkill, setEditingSkill] = useState<Partial<Skill> | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSkillsList = async () => {
    setLoading(true);
    const data = await getSkills();
    setSkills(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSkillsList();
  }, []);

  const handleStartAdd = () => {
    setEditingSkill({
      name: '',
      category: 'Languages',
      proficiency: 80,
      display_order: skills.length + 1,
    });
  };

  const handleStartEdit = (skill: Skill) => {
    setEditingSkill(skill);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;

    if (!editingSkill.name?.trim()) {
      setMessage({ type: 'error', text: 'Skill name is required.' });
      return;
    }

    const payload = {
      ...editingSkill,
      name: editingSkill.name.trim(),
    } as Omit<Skill, 'id'> & { id?: string };

    const success = await upsertSkill(payload);
    if (success) {
      setMessage({ type: 'success', text: 'Skill saved!' });
      setEditingSkill(null);
      fetchSkillsList();
    } else {
      setMessage({ type: 'error', text: 'Failed to save skill.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    const success = await deleteSkill(id);
    if (success) {
      setMessage({ type: 'success', text: 'Skill deleted.' });
      fetchSkillsList();
    } else {
      setMessage({ type: 'error', text: 'Failed to delete skill.' });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Cpu size={20} className="text-indigo-600" />
            Skills Catalog
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Configure your programming languages, frameworks, databases, tools, and experience proficiency bars.
          </p>
        </div>
        {!editingSkill && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <Plus size={14} />
            Add Skill
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

      {/* Editing Form Overlay */}
      {editingSkill && (
        <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-2xl border border-slate-200/50 space-y-4 max-w-md">
          <h3 className="text-sm font-bold text-slate-700">
            {editingSkill.id ? 'Edit Skill Details' : 'Create New Skill'}
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Skill Name</label>
              <input
                type="text"
                required
                value={editingSkill.name || ''}
                onChange={(e) => setEditingSkill((prev) => ({ ...prev!, name: e.target.value }))}
                placeholder="e.g. Next.js, Go, Kubernetes"
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Category Group</label>
              <select
                value={editingSkill.category || 'Languages'}
                onChange={(e) => setEditingSkill((prev) => ({ ...prev!, category: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              >
                <option value="Languages">Languages</option>
                <option value="Frontend">Frontend (UI/Styles)</option>
                <option value="Backend">Backend & Databases</option>
                <option value="Tools">Tools & Infrastructure</option>
                <option value="Other">Other Skills</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Proficiency Percentage ({editingSkill.proficiency}%)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingSkill.proficiency || 80}
                  onChange={(e) => setEditingSkill((prev) => ({ ...prev!, proficiency: parseInt(e.target.value) || 0 }))}
                  className="flex-1 accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-bold text-indigo-600 w-8">{editingSkill.proficiency}%</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Display Order</label>
              <input
                type="number"
                value={editingSkill.display_order || 0}
                onChange={(e) => setEditingSkill((prev) => ({ ...prev!, display_order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-lg text-xs transition-all shadow-sm"
            >
              <Save size={12} />
              Save Skill
            </button>
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg text-xs transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Grid list of categories */}
      <div>
        {loading ? (
          <div className="text-slate-400 text-xs py-4 flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin text-slate-400" />
            Loading skills...
          </div>
        ) : skills.length === 0 ? (
          <div className="text-slate-400 text-xs py-4 italic">No skills cataloged yet. Add your first skill!</div>
        ) : (
          <div className="space-y-6">
            {['Languages', 'Frontend', 'Backend', 'Tools', 'Other'].map((category) => {
              const catSkills = skills.filter((s) => s.category === category);
              if (catSkills.length === 0) return null;

              return (
                <div key={category} className="space-y-2 bg-slate-50/50 border border-slate-150 p-5 rounded-2xl">
                  <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {catSkills
                      .sort((a, b) => a.display_order - b.display_order)
                      .map((sk) => (
                        <div
                          key={sk.id}
                          className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold text-slate-700 truncate">{sk.name}</p>
                            <p className="text-[9px] text-slate-400 font-medium">Proficiency: {sk.proficiency}%</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleStartEdit(sk)}
                              className="text-indigo-600 hover:text-indigo-700 p-1 bg-indigo-50/40 rounded hover:bg-indigo-50 transition-all"
                              title="Edit Skill"
                            >
                              <Edit2 size={10} />
                            </button>
                            <button
                              onClick={() => handleDelete(sk.id)}
                              className="text-pink-600 hover:text-pink-700 p-1 bg-pink-50/40 rounded hover:bg-pink-50 transition-all"
                              title="Delete Skill"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
