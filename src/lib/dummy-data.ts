import {
  Profile,
  Education,
  Experience,
  Project,
  Certification,
  Skill,
  Resume,
} from './types';

export const dummyProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Alex Rivera',
  title: 'Lead Full-Stack Engineer',
  about: 'I am a highly motivated software engineer with 5+ years of experience designing and implementing highly performant web applications. I specialize in React, Next.js, TypeScript, and Node.js, with a strong focus on clean architecture, fluid user interfaces, and robust cloud services. Passionate about mentoring, scalability, and modern DevOps practices.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300', // Premium dummy avatar
  github_url: 'https://github.com',
  linkedin_url: 'https://linkedin.com',
  email: 'alex.rivera@gmail.com',
  phone: '+1 (555) 019-2834',
  location: 'San Francisco, CA',
};

export const dummyEducation: Education[] = [
  {
    id: 'edu-1',
    institution: 'Stanford University',
    degree: 'Master of Science',
    field_of_study: 'Computer Science',
    start_date: 'Sep 2018',
    end_date: 'Jun 2020',
    grade: 'GPA: 3.92/4.00',
    description: 'Specialization in Software Engineering and Distributed Systems. Research assistant in the Distributed Systems Lab.',
    display_order: 1,
  },
  {
    id: 'edu-2',
    institution: 'University of California, Berkeley',
    degree: 'Bachelor of Science',
    field_of_study: 'EECS (Electrical Engineering & Computer Sciences)',
    start_date: 'Sep 2014',
    end_date: 'May 2018',
    grade: 'GPA: 3.85/4.00',
    description: 'Graduated with Honors. Coursework in Data Structures, Algorithms, Database Systems, and Operating Systems.',
    display_order: 2,
  },
];

export const dummyExperience: Experience[] = [
  {
    id: 'exp-1',
    company: 'Stripe',
    role: 'Senior Software Engineer',
    type: 'job',
    start_date: 'Jul 2022',
    end_date: 'Present',
    location: 'San Francisco, CA (Hybrid)',
    description: 'Led the development of a next-generation billing dashboard utilized by 100k+ global merchants.\nArchitected a micro-frontend architecture using Webpack Module Federation, reducing build times by 40%.\nMentored 4 junior and mid-level engineers, fostering best practices in TypeScript and clean code design.',
    display_order: 1,
  },
  {
    id: 'exp-2',
    company: 'Meta',
    role: 'Software Engineer II',
    type: 'job',
    start_date: 'Aug 2020',
    end_date: 'Jun 2022',
    location: 'Menlo Park, CA',
    description: 'Engineered high-performance React features within the core Meta Advertising Platform.\nReduced client-side render latencies by 25% through advanced state management optimization and code splitting.\nCollaborated closely with UX designers to develop and maintain a modular design token library.',
    display_order: 2,
  },
  {
    id: 'exp-3',
    company: 'Apple',
    role: 'Full-Stack Software Engineering Intern',
    type: 'internship',
    start_date: 'May 2019',
    end_date: 'Aug 2019',
    location: 'Cupertino, CA',
    description: 'Built a web-based internal tool for monitoring hardware test diagnostics using React and Go.\nIntegrated real-time websocket connections to stream telemetry data, displaying live charts with Canvas.\nDesigned and executed unit and integration testing workflows, increasing test coverage by 30%.',
    display_order: 3,
  },
  {
    id: 'exp-4',
    company: 'Microsoft',
    role: 'Frontend Engineering Intern',
    type: 'internship',
    start_date: 'May 2017',
    end_date: 'Aug 2017',
    location: 'Redmond, WA',
    description: 'Created accessibility features and UI components for the Microsoft Teams web client.\nImplemented keyboard navigation helpers and screen-reader optimizations complying with WCAG 2.1 guidelines.',
    display_order: 4,
  },
];

export const dummyProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'SaaS Analytics Dashboard',
    description: 'A premium, real-time metrics platform tracking revenue, customer acquisition, and server load.',
    long_description: 'This application provides real-time SaaS diagnostics using an event-driven architecture. Includes interactive charts, multi-workspace billing settings, and automated report exports.',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400',
    github_url: 'https://github.com',
    live_url: 'https://google.com',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Supabase'],
    display_order: 1,
  },
  {
    id: 'proj-2',
    title: 'AI Code Refactorer',
    description: 'An AI assistant that analyzes code complexity and suggests clean-code refactoring patterns.',
    long_description: 'An open-source desktop and web client integrating LLMs to perform automated refactoring suggestions, complexity analysis, and docstring generations directly in the browser.',
    image_url: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=600&h=400',
    github_url: 'https://github.com',
    live_url: 'https://google.com',
    tags: ['React', 'Node.js', 'OpenAI API', 'Tailwind CSS', 'Vite'],
    display_order: 2,
  },
  {
    id: 'proj-3',
    title: 'Decentralized Task Manager',
    description: 'A Web3 collaborative task planner featuring wallet authentication and state stored on-chain.',
    long_description: 'This task manager allows teams to track roadmap progress with verified smart contract completions. Built to showcase wallet connector libraries and gas-optimized updates.',
    image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600&h=400',
    github_url: 'https://github.com',
    live_url: 'https://google.com',
    tags: ['Next.js', 'Solidity', 'Ethers.js', 'Framer Motion'],
    display_order: 3,
  },
];

export const dummyCertifications: Certification[] = [
  {
    id: 'cert-1',
    name: 'AWS Certified Solutions Architect – Professional',
    issuer: 'Amazon Web Services (AWS)',
    issue_date: 'Nov 2024',
    expiration_date: 'Nov 2027',
    credential_id: 'SAP-C02-99238',
    credential_url: 'https://aws.amazon.com',
    display_order: 1,
  },
  {
    id: 'cert-2',
    name: 'Google Cloud Professional Cloud Architect',
    issuer: 'Google Cloud Platform (GCP)',
    issue_date: 'Mar 2023',
    expiration_date: 'Mar 2026',
    credential_id: 'GCP-PCA-112093',
    credential_url: 'https://cloud.google.com',
    display_order: 2,
  },
];

export const dummySkills: Skill[] = [
  // Languages
  { id: 'sk-1', name: 'TypeScript', category: 'Languages', proficiency: 95, display_order: 1 },
  { id: 'sk-2', name: 'JavaScript', category: 'Languages', proficiency: 95, display_order: 2 },
  { id: 'sk-3', name: 'Python', category: 'Languages', proficiency: 85, display_order: 3 },
  { id: 'sk-4', name: 'Golang', category: 'Languages', proficiency: 80, display_order: 4 },
  // Frontend
  { id: 'sk-5', name: 'React', category: 'Frontend', proficiency: 98, display_order: 5 },
  { id: 'sk-6', name: 'Next.js', category: 'Frontend', proficiency: 95, display_order: 6 },
  { id: 'sk-7', name: 'Tailwind CSS', category: 'Frontend', proficiency: 92, display_order: 7 },
  { id: 'sk-8', name: 'Framer Motion', category: 'Frontend', proficiency: 85, display_order: 8 },
  // Backend
  { id: 'sk-9', name: 'Node.js / Express', category: 'Backend', proficiency: 90, display_order: 9 },
  { id: 'sk-10', name: 'PostgreSQL / Supabase', category: 'Backend', proficiency: 88, display_order: 10 },
  { id: 'sk-11', name: 'GraphQL', category: 'Backend', proficiency: 82, display_order: 11 },
  { id: 'sk-12', name: 'Redis', category: 'Backend', proficiency: 80, display_order: 12 },
  // Tools
  { id: 'sk-13', name: 'Docker', category: 'Tools', proficiency: 85, display_order: 13 },
  { id: 'sk-14', name: 'AWS', category: 'Tools', proficiency: 82, display_order: 14 },
  { id: 'sk-15', name: 'Git / GitHub CI-CD', category: 'Tools', proficiency: 90, display_order: 15 },
];

export const dummyResumes: Resume[] = [
  {
    id: 'res-1',
    name: 'Alex Rivera - Senior Software Engineer.pdf',
    file_url: 'https://raw.githubusercontent.com/pdf-association/pdf-test-files/master/general/chevron.pdf', // Public PDF example
    is_active: true,
  },
  {
    id: 'res-2',
    name: 'Alex Rivera - Full Stack Developer (Tech Lead).pdf',
    file_url: 'https://raw.githubusercontent.com/pdf-association/pdf-test-files/master/general/chevron.pdf',
    is_active: false,
  },
];
