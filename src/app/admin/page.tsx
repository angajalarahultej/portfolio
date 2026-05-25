'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { isAdminUser } from '@/lib/auth-helper';
import { getProfile } from '@/lib/db';
import { Profile } from '@/lib/types';
import { dummyProfile } from '@/lib/dummy-data';

// Import Admin Sub-Managers
import ProfileManager from '@/components/admin/ProfileManager';
import ResumeManager from '@/components/admin/ResumeManager';
import ProjectsManager from '@/components/admin/ProjectsManager';
import SkillsManager from '@/components/admin/SkillsManager';
import ExperienceManager from '@/components/admin/ExperienceManager';
import EducationManager from '@/components/admin/EducationManager';
import CertificationsManager from '@/components/admin/CertificationsManager';
import MessagesManager from '@/components/admin/MessagesManager';

// Icons
import {
  Lock,
  LogOut,
  User,
  FileText,
  Code,
  Cpu,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  Home,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'profile' | 'resume' | 'projects' | 'skills' | 'experience' | 'education' | 'certifications' | 'messages'
  >('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profile data for manager
  const [profile, setProfile] = useState<Profile>(dummyProfile);

  // Check Session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isAdminUser(session.user?.email)) {
          setIsAdmin(true);
          // Load actual profile
          const dbProfile = await getProfile();
          if (dbProfile) setProfile(dbProfile);
        } else if (session) {
          // Logged in but not admin
          await supabase.auth.signOut();
        }
      } catch (err) {
        console.error('Error during admin session check:', err);
      } finally {
        setSessionChecked(true);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && isAdminUser(session.user?.email)) {
          setIsAdmin(true);
          const dbProfile = await getProfile();
          if (dbProfile) setProfile(dbProfile);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const checkAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (email.toLowerCase() !== checkAdminEmail?.toLowerCase()) {
      setError('Unauthorized credentials. Access Denied.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else if (data.user && !isAdminUser(data.user.email)) {
        await supabase.auth.signOut();
        setError('Unauthorized email. Access Denied.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  // Auth/Session checking view
  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Lock size={20} className="animate-spin" />
          </div>
          <span className="text-xs text-slate-500 font-medium">Checking credentials...</span>
        </div>
      </div>
    );
  }

  // 1. LOGIN SCREEN PANEL
  if (!isAdmin) {
    return (
      <div className="admin-dashboard-root min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        {/* Soft pastels floating glows */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl opacity-50" />

        <div className="glass-panel p-8 rounded-3xl shadow-xl w-full max-w-md border border-white/60 relative z-15">
          <div className="text-center space-y-3 mb-8">
            <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner border border-white">
              <Lock size={22} />
            </div>
            <h1 className="font-display font-extrabold text-slate-800 text-2xl">Admin Login Only</h1>
            <p className="text-xs text-slate-500 font-light max-w-xs mx-auto">
              Please enter your dashboard credentials to configure portfolio sections, uploads, and views.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-white/70 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/70 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm focus:outline-none transition-all"
              />
            </div>

            {error && <p className="text-xs font-semibold text-pink-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <Link
              href="/"
              className="mt-4 block text-center text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
            >
              ← Return to Portfolio Website
            </Link>
          </form>
        </div>
      </div>
    );
  }

  // 2. DASHBOARD PANEL VIEW
  const navigationItems = [
    { id: 'profile', name: 'Profile Settings', icon: <User size={16} /> },
    { id: 'resume', name: 'Resumes', icon: <FileText size={16} /> },
    { id: 'projects', name: 'Projects', icon: <Code size={16} /> },
    { id: 'skills', name: 'Skills Catalog', icon: <Cpu size={16} /> },
    { id: 'experience', name: 'Work / Internships', icon: <Briefcase size={16} /> },
    { id: 'education', name: 'Education', icon: <GraduationCap size={16} /> },
    { id: 'certifications', name: 'Certifications', icon: <Award size={16} /> },
    { id: 'messages', name: 'Contact Messages', icon: <Mail size={16} /> },
  ] as const;

  return (
    <div className="admin-dashboard-root min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Mobile Header Dashboard Bar */}
      <div className="md:hidden glass-navbar py-4 px-6 flex items-center justify-between z-40 sticky top-0 left-0 right-0">
        <Link href="/" className="font-display font-bold text-slate-700 flex items-center gap-1 text-sm">
          <Home size={16} className="text-indigo-600" />
          Home Website
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-600 hover:text-slate-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 glass-panel md:relative fixed inset-y-0 left-0 z-40 flex flex-col justify-between p-6 border-r border-slate-200/50 transition-transform duration-300 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Admin Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 border border-white rounded-xl flex items-center justify-center shadow-sm">
              <UserCheck size={20} />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-slate-800 text-sm leading-tight">Admin Portal</h2>
              <p className="text-[10px] text-slate-400 font-medium">Configure Portfolio</p>
            </div>
          </div>

          {/* Nav menu links */}
          <nav className="flex flex-col gap-1.5">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === item.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/50'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Action button bottom */}
        <div className="space-y-3 pt-6 border-t border-slate-200/40">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100/50 hover:text-slate-800 transition-all"
          >
            <Home size={16} />
            Return to Site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-pink-600 hover:bg-pink-50 transition-all text-left"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Section Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto max-w-6xl">
        <div className="bg-white border border-slate-150 rounded-3xl p-6 md:p-10 shadow-xs min-h-[calc(100vh-6rem)] md:min-h-0">
          {activeTab === 'profile' && <ProfileManager initialProfile={profile} />}
          {activeTab === 'resume' && <ResumeManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'experience' && <ExperienceManager />}
          {activeTab === 'education' && <EducationManager />}
          {activeTab === 'certifications' && <CertificationsManager />}
          {activeTab === 'messages' && <MessagesManager />}
        </div>
      </main>
    </div>
  );
}
