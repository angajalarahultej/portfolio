'use client';

import React, { useState, useEffect } from 'react';
import { Profile } from '@/lib/types';
import { updateProfile, uploadAvatarImage } from '@/lib/db';
import { Save, Upload, User, Image as ImageIcon } from 'lucide-react';

interface ProfileManagerProps {
  initialProfile: Profile;
}

export default function ProfileManager({ initialProfile }: ProfileManagerProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setMessage(null);

    try {
      const publicUrl = await uploadAvatarImage(files[0]);
      if (publicUrl) {
        setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));
        setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to upload avatar image.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Error uploading file.' });
    } finally {
      setUploading(false);
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Early exit if no changes
      if (JSON.stringify(profile) === JSON.stringify(initialProfile)) {
        return;
      }

      setLoading(true);
      setMessage(null);

      // Build payload preserving existing values when fields are left empty
      const payload: Partial<Profile> = { ...initialProfile };
      Object.entries(profile).forEach(([key, value]) => {
        if (value !== '' && value != null && value !== undefined) {
          // @ts-ignore - dynamic key assignment
          payload[key] = value;
        }
      });
      console.log('Updating profile with payload:', payload);
      const success = await updateProfile(payload as Profile);
      if (success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        console.error('Failed to update profile');
        setMessage({ type: 'error', text: 'Failed to update profile details.' });
      }
      setLoading(false);
    };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <User size={20} className="text-indigo-600" />
            Profile Settings
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Update your public personal details, contact coordinates, and social media links.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-150">
          <div className="relative w-24 h-24 bg-slate-200 rounded-full overflow-hidden shrink-0 border-2 border-white shadow">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <User size={36} />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-700">Profile Photo</h3>
            <p className="text-xs text-slate-400 font-light max-w-sm">
              Upload a premium photo of yourself. JPG, PNG formats supported.
            </p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer shadow-sm transition-all duration-200">
              <Upload size={14} />
              {uploading ? 'Uploading...' : 'Choose File'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Full Name</label>
            <input
              type="text"
              name="name"
              
              value={profile.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Professional Title</label>
            <input
              type="text"
              name="title"
              
              value={profile.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500">About (Bio Summary)</label>
            <textarea
              name="about"
              required
              rows={4}
              value={profile.about}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">GitHub URL</label>
            <input
              type="url"
              name="github_url"
              value={profile.github_url || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={profile.linkedin_url || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Contact Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Contact Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500">Location (City, Country)</label>
            <input
              type="text"
              name="location"
              value={profile.location || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 rounded-xl text-sm focus:outline-none transition-all"
            />
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

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-350 font-semibold rounded-xl text-sm transition-all shadow-sm"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
