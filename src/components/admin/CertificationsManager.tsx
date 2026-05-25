'use client';

import React, { useState, useEffect } from 'react';
import { Certification } from '@/lib/types';
import { getCertifications, upsertCertification, deleteCertification } from '@/lib/db';
import { Award, Plus, Trash2, Edit2, Save, RefreshCw } from 'lucide-react';

export default function CertificationsManager() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Partial<Certification> | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCertificationsList = async () => {
    setLoading(true);
    const data = await getCertifications();
    setCertifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCertificationsList();
  }, []);

  const handleStartAdd = () => {
    setEditingCert({
      name: '',
      issuer: '',
      issue_date: '',
      expiration_date: '',
      credential_id: '',
      credential_url: '',
      display_order: certifications.length + 1,
    });
  };

  const handleStartEdit = (cert: Certification) => {
    setEditingCert(cert);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;

    if (!editingCert.name?.trim() || !editingCert.issuer?.trim() || !editingCert.issue_date?.trim()) {
      setMessage({ type: 'error', text: 'Certification name, issuer, and issue date are required.' });
      return;
    }

    const payload = {
      ...editingCert,
      name: editingCert.name.trim(),
      issuer: editingCert.issuer.trim(),
    } as Omit<Certification, 'id'> & { id?: string };

    const success = await upsertCertification(payload);
    if (success) {
      setMessage({ type: 'success', text: 'Certification saved successfully!' });
      setEditingCert(null);
      fetchCertificationsList();
    } else {
      setMessage({ type: 'error', text: 'Failed to save certification.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    const success = await deleteCertification(id);
    if (success) {
      setMessage({ type: 'success', text: 'Certification deleted.' });
      fetchCertificationsList();
    } else {
      setMessage({ type: 'error', text: 'Failed to delete certification.' });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Award size={20} className="text-indigo-600" />
            Certifications & Badges
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Maintain your verified credentials, cloud architect titles, security clearances, and course completions.
          </p>
        </div>
        {!editingCert && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl transition-all shadow-sm"
          >
            <Plus size={14} />
            Add Certification
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

      {/* Form edit fields */}
      {editingCert ? (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-200/50 space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-700">
            {editingCert.id ? 'Edit Certification' : 'Add Certification'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Certification Name</label>
              <input
                type="text"
                required
                value={editingCert.name || ''}
                onChange={(e) => setEditingCert((prev) => ({ ...prev!, name: e.target.value }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Issuing Body (e.g. AWS)</label>
              <input
                type="text"
                required
                value={editingCert.issuer || ''}
                onChange={(e) => setEditingCert((prev) => ({ ...prev!, issuer: e.target.value }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Credential ID (Optional)</label>
              <input
                type="text"
                value={editingCert.credential_id || ''}
                onChange={(e) => setEditingCert((prev) => ({ ...prev!, credential_id: e.target.value }))}
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5 font-light">
              <label className="text-xs font-semibold text-slate-500">Issue Date (e.g. Nov 2024)</label>
              <input
                type="text"
                required
                value={editingCert.issue_date || ''}
                onChange={(e) => setEditingCert((prev) => ({ ...prev!, issue_date: e.target.value }))}
                placeholder="e.g. Mar 2024"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Expiration Date (Optional)</label>
              <input
                type="text"
                value={editingCert.expiration_date || ''}
                onChange={(e) => setEditingCert((prev) => ({ ...prev!, expiration_date: e.target.value }))}
                placeholder="e.g. Mar 2027"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Verification URL</label>
              <input
                type="url"
                value={editingCert.credential_url || ''}
                onChange={(e) => setEditingCert((prev) => ({ ...prev!, credential_url: e.target.value }))}
                placeholder="e.g. https://aws.amazon.com/verification"
                className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Display Order</label>
              <input
                type="number"
                value={editingCert.display_order || 0}
                onChange={(e) => setEditingCert((prev) => ({ ...prev!, display_order: parseInt(e.target.value) || 0 }))}
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
              Save Certification
            </button>
            <button
              type="button"
              onClick={() => setEditingCert(null)}
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
              Loading certifications...
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-slate-400 text-xs py-4 italic">No certifications found. Add one above!</div>
          ) : (
            <div className="space-y-4">
              {certifications
                .sort((a, b) => a.display_order - b.display_order)
                .map((cert) => (
                  <div
                    key={cert.id}
                    className="p-5 bg-white/40 border border-slate-200 rounded-2xl shadow-sm hover:shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{cert.name}</h3>
                      <p className="text-xs font-semibold text-indigo-650">{cert.issuer}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Issued: {cert.issue_date} {cert.expiration_date ? `| Expires: ${cert.expiration_date}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(cert)}
                        className="inline-flex items-center gap-0.5 px-2.5 py-1.5 bg-white border border-slate-250 hover:border-slate-400 text-[10px] font-bold text-slate-700 rounded-lg transition-all"
                      >
                        <Edit2 size={10} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
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
