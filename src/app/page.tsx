import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import ExperienceSection from '@/components/Experience';
import EducationSection from '@/components/Education';
import Projects from '@/components/Projects';
import Certifications from '@/components/Certifications';
import ResumeSection from '@/components/ResumeSection';
import Contact from '@/components/Contact';

// Import dummy data fallback
import {
  dummyProfile,
  dummyEducation,
  dummyExperience,
  dummyProjects,
  dummyCertifications,
  dummySkills,
  dummyResumes,
} from '@/lib/dummy-data';

// Import TypeScript interfaces
import { Profile, Education, Experience, Project, Certification, Skill, Resume } from '@/lib/types';

// Import Supabase fetching helpers
import {
  getProfile,
  getEducation,
  getExperience,
  getProjects,
  getCertifications,
  getSkills,
  getActiveResume,
} from '@/lib/db';

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function Home() {
  // Fetch data in parallel on the server
  let profile: Profile | null = null;
  let education: Education[] = [];
  let experience: Experience[] = [];
  let projects: Project[] = [];
  let certifications: Certification[] = [];
  let skills: Skill[] = [];
  let activeResume: Resume | null = null;

  try {
    const [
      dbProfile,
      dbEducation,
      dbExperience,
      dbProjects,
      dbCertifications,
      dbSkills,
      dbActiveResume,
    ] = await Promise.all([
      getProfile(),
      getEducation(),
      getExperience(),
      getProjects(),
      getCertifications(),
      getSkills(),
      getActiveResume(),
    ]);

    profile = dbProfile;
    education = dbEducation;
    experience = dbExperience;
    projects = dbProjects;
    certifications = dbCertifications;
    skills = dbSkills;
    activeResume = dbActiveResume;
  } catch (err) {
    console.error('Failed to load portfolio data from Supabase. Using fallback dummy data.', err);
  }

  // Fallback to dummy data if database is empty or connection fails
  const finalProfile = profile || dummyProfile;
  const finalEducation = education.length > 0 ? education : dummyEducation;
  const finalExperience = experience.length > 0 ? experience : dummyExperience;
  const finalProjects = projects.length > 0 ? projects : dummyProjects;
  const finalCertifications = certifications.length > 0 ? certifications : dummyCertifications;
  const finalSkills = skills.length > 0 ? skills : dummySkills;
  const finalActiveResume = activeResume || null; // Only show real uploaded resumes, no dummy fallback

  return (
    <div className="relative min-h-screen">
      {/* Sticky Glass Navbar */}
      <Navbar name={finalProfile.name} />

      {/* Sections */}
      <main className="space-y-6 pt-20">
        <Hero profile={finalProfile} />
        <div className="portfolio-content-root space-y-6">
          <About profile={finalProfile} />
          <Skills skills={finalSkills} />
          <ExperienceSection experiences={finalExperience} />
          <EducationSection education={finalEducation} />
          <Projects projects={finalProjects} />
          <Certifications certifications={finalCertifications} />
          <ResumeSection activeResume={finalActiveResume} />
          <Contact
            email={finalProfile.email}
            phone={finalProfile.phone}
            location={finalProfile.location}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200/40 text-center text-xs text-slate-400 mt-20">
        <div className="max-w-6xl mx-auto px-6 space-y-2">
          <p>© {new Date().getFullYear()} {finalProfile.name}. All rights reserved.</p>
          <p className="font-light">Built with Next.js, Tailwind CSS, and Supabase backend.</p>
        </div>
      </footer>
    </div>
  );
}
