'use client';

import React, { useState, useEffect } from 'react';
import { Resume } from '@/lib/types';
import { getResumes, uploadResumeFile, addResume, setActiveResume, deleteResume } from '@/lib/db';
import { FileText, Upload, Trash2, CheckCircle2, Circle, Eye } from 'lucide-react';

export default function ResumeManager() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchResumesList = async () => {
    setLoading(true);
    const data = await getResumes();
    setResumes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchResumesList();
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const file = formData.get('resume_file') as File;
    if (!file || file.size === 0) {
      setMessage({ type: 'error', text: 'Please choose a file to upload.' });
      return;
    }
    if (!resumeName.trim()) {
      setMessage({ type: 'error', text: 'Please specify a document display name.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const publicUrl = await uploadResumeFile(file);
      if (publicUrl) {
        const added = await addResume(resumeName.trim(), publicUrl);
        if (added) {
          setMessage({ type: 'success', text: 'Resume uploaded and saved successfully!' });
          setResumeName('');
          formElement.reset();
          fetchResumesList();
        } else {
          setMessage({ type: 'error', text: 'Uploaded file but failed to save DB entry.' });
        }
      } else {
        setMessage({ type: 'error', text: 'Failed to upload PDF file to storage.' });
      }
    } catch (err) {
      console.error('Resume upload exception:', err);
      setMessage({ type: 'error', text: 'Upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    setMessage(null);
    const success = await setActiveResume(id);
    if (success) {
      setMessage({ type: 'success', text: 'Active resume updated!' });
      fetchResumesList();
    } else {
      setMessage({ type: 'error', text: 'Failed to update active resume.' });
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    setMessage(null);
    const success = await deleteResume(id, fileUrl);
    if (success) {
      setMessage({ type: 'success', text: 'Resume deleted successfully.' });
      fetchResumesList();
    } else {
      setMessage({ type: 'error', text: 'Failed to delete resume.' });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText size={20} className="text-indigo-600" />
            Resume Documents
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Upload multiple versions of your resume and mark the active one for download on your homepage.
          </p>
        </div>
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

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="glass-panel p-6 rounded-2xl border border-slate-200/50 space-y-4 max-w-xl">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
          <Upload size={16} className="text-indigo-600" />
          Upload New Resume
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Document Label (e.g. Alex Rivera - Tech Lead.pdf)</label>
            <input
              type="text"
              required
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder="e.g. Full Stack Engineer (2026)"
              className="w-full px-4 py-2 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Select PDF File</label>
            <input
              type="file"
              name="resume_file"
              required
              accept=".pdf,.doc,.docx"
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-150 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-350 font-semibold rounded-xl text-xs transition-all shadow-sm"
        >
          <Upload size={14} />
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>

      {/* Resume Lists */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Uploaded Resumes ({resumes.length})</h3>

        {loading ? (
          <div className="text-slate-400 text-xs py-4">Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div className="text-slate-400 text-xs py-4 italic">No resumes uploaded yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className={`flex items-center justify-between p-4 bg-white/40 border rounded-2xl transition-all ${
                  resume.is_active ? 'border-emerald-500/40 bg-emerald-50/10' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText size={18} className={resume.is_active ? 'text-emerald-500' : 'text-slate-400'} />
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-700 truncate">{resume.name}</p>
                    <p className="text-[10px] text-slate-400 font-light">Status: {resume.is_active ? 'Active on public view' : 'Inactive'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-all border border-slate-200"
                    title="View Document"
                  >
                    <Eye size={14} />
                  </a>

                  {resume.is_active ? (
                    <button
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 border border-emerald-250 text-emerald-700 rounded-full text-[10px] font-bold"
                      title="Active Resume"
                    >
                      <CheckCircle2 size={12} />
                      Active
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSetActive(resume.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-800 rounded-full text-[10px] font-semibold transition-all"
                      title="Set Active"
                    >
                      <Circle size={12} />
                      Set Active
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(resume.id, resume.file_url)}
                    className="p-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 rounded-lg transition-all"
                    title="Delete Resume"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
