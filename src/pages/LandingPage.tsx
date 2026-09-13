import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  School, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Award, 
  CircleDollarSign, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Bus, 
  Building2, 
  Bell, 
  GraduationCap, 
  Briefcase, 
  CheckSquare, 
  FileSpreadsheet, 
  ChevronRight,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import campusHeroBg from '../assets/hero-campus.jpg';

export const LandingPage: React.FC = () => {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState<'COLLEGE' | 'SCHOOL'>('COLLEGE');

  const demoAccounts = [
    { role: 'Super Admin', email: 'admin@apex.edu', tag: 'Full Governance', color: 'border-purple-200 bg-purple-50 text-purple-700' },
    { role: 'Principal / Dean', email: 'principal@apex.edu', tag: 'Academic Head', color: 'border-indigo-200 bg-indigo-50 text-indigo-700' },
    { role: 'Faculty Member', email: 'faculty@apex.edu', tag: 'Attendance & Marks', color: 'border-blue-200 bg-blue-50 text-blue-700' },
    { role: 'Accountant', email: 'accountant@apex.edu', tag: 'Fees & Receipts', color: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
    { role: 'Student', email: 'student@apex.edu', tag: 'Personal Portal', color: 'border-amber-200 bg-amber-50 text-amber-700' },
    { role: 'Parent', email: 'parent@apex.edu', tag: 'Ward Attendance', color: 'border-rose-200 bg-rose-50 text-rose-700' },
  ];

  const modules = [
    {
      title: 'Conflict-Free Timetable',
      desc: '3-way algorithmic collision detection. Automatically alerts when room, faculty, or section conflicts occur.',
      icon: Calendar,
      color: 'text-indigo-600 bg-indigo-50',
      badge: 'Collision Engine'
    },
    {
      title: '75% Attendance & Shortage',
      desc: 'Session attendance with one-click bulk marking, automated percentage gauge, and statutory shortage disbarment alert.',
      icon: CheckSquare,
      color: 'text-emerald-600 bg-emerald-50',
      badge: 'Statutory Rule'
    },
    {
      title: 'BigDecimal Fee Accounting',
      desc: 'High-precision ledger math with scholarships, overdue penalties, and official receipt sequence generator (RCPT-2026-XXXXXX).',
      icon: CircleDollarSign,
      color: 'text-amber-600 bg-amber-50',
      badge: 'Zero Rounding Drift'
    },
    {
      title: 'Exams, GPA & Marksheets',
      desc: 'Exam timetable scheduling, marks entry validated against maximums, SGPA calculation, and printable official grade sheets.',
      icon: Award,
      color: 'text-purple-600 bg-purple-50',
      badge: 'Official Transcripts'
    },
    {
      title: 'Admissions & CRM Lifecycle',
      desc: 'Prospective student lead inquiries, application submission, verification status, and atomic admission confirmation.',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50',
      badge: 'Atomic Enrollment'
    },
    {
      title: 'Course Assignments & Rubrics',
      desc: 'Continuous CCE coursework, submission deadlines, file attachment tracking, and automated internal grading.',
      icon: FileSpreadsheet,
      color: 'text-teal-600 bg-teal-50',
      badge: 'Continuous CCE'
    },
    {
      title: 'Library RFID & Circulation',
      desc: 'Catalog management, barcode/ISBN search, copy tracking, and automatic late return penalty calculations.',
      icon: BookOpen,
      color: 'text-rose-600 bg-rose-50',
      badge: 'Fine Calculator'
    },
    {
      title: 'Campus Transport Logistics',
      desc: 'Bus fleet tracking, route stop allocations, driver compliance records, and transportation fee accounts.',
      icon: Bus,
      color: 'text-orange-600 bg-orange-50',
      badge: 'Route Tracking'
    },
    {
      title: 'Residential Hostels & Beds',
      desc: 'Boys and girls hostel blocks, room inventory, and atomic bed reservation preventing double-occupancy.',
      icon: Building2,
      color: 'text-cyan-600 bg-cyan-50',
      badge: 'Bed Allocation'
    },
    {
      title: 'Faculty & Staff Directory',
      desc: 'Teaching departments, faculty designations, qualifications, and class teaching subject assignments.',
      icon: Briefcase,
      color: 'text-violet-600 bg-violet-50',
      badge: 'HR & Workload'
    },
    {
      title: 'Notice Board & Circulars',
      desc: 'Campus-wide announcements with priority levels (Urgent, High, Normal) and target audience filters.',
      icon: Bell,
      color: 'text-pink-600 bg-pink-50',
      badge: 'Digital Circulars'
    },
    {
      title: 'Multi-Tenant Security & Audit',
      desc: 'Stateless JWT with refresh token rotation, institution isolation, and complete historical audit logs.',
      icon: ShieldCheck,
      color: 'text-slate-800 bg-slate-100',
      badge: 'Spring Security 6'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-navy-950/90 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white leading-none">EduSuite</span>
              <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider block">Enterprise ERP</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#tracks" className="hover:text-white transition-colors">School vs College</a>
            <a href="#modules" className="hover:text-white transition-colors">Core Modules</a>
            <a href="#demo-roles" className="hover:text-white transition-colors">Demo Logins</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          </nav>

          <div className="flex items-center gap-3">
            {token ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md transition-all"
              >
                Go to ERP Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-500 hover:from-brand-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all"
              >
                Sign In to Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Cinematic Campus Background & Glassmorphic UX */}
      <section className="relative overflow-hidden bg-navy-950 text-white pt-24 pb-32 min-h-[85vh] flex items-center justify-center">
        {/* Cinematic Campus Architecture Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={campusHeroBg}
            alt="Apex Global Educational Hub"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          {/* Multi-layered Contrast & Vignette Overlays */}
          <div className="absolute inset-0 bg-navy-950/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-transparent to-navy-950/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/25 via-transparent to-transparent" />
        </div>

        {/* Ambient Neon Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-brand-500/20 blur-[140px] rounded-full pointer-events-none z-1" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[300px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none z-1" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Status Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/15 text-xs font-semibold text-brand-300 backdrop-blur-md shadow-lg shadow-black/40">
            <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-spin-slow" />
            <span className="tracking-wide">Enterprise Multi-Campus Educational ERP 2026</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/80" />
          </div>

          {/* Main Title with Radiant Gradient */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.12] drop-shadow-md">
            Unified Digital Governance for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-emerald-300 to-teal-200">
              Schools, Colleges & Universities
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed drop-shadow-sm">
            Eliminate fragmented spreadsheets and fragile portals. EduSuite ERP delivers a production-grade 
            relational engine configured for both <span className="text-white font-semibold">K-12 Schools</span> and{' '}
            <span className="text-white font-semibold">Higher Education Colleges</span>. Real-time timetable collision detection, 
            statutory 75% attendance alerts, strict BigDecimal fee receipts, and automated SGPA report cards.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-2xl shadow-brand-600/50 text-base flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-1 hover:shadow-brand-500/60"
            >
              <span>Launch Live ERP Portal</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#modules"
              className="w-full sm:w-auto px-7 py-4 bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 hover:text-white font-semibold rounded-xl border border-white/15 backdrop-blur-md text-base transition-all shadow-lg hover:border-brand-400/40"
            >
              Explore 15 Core Modules
            </a>
          </div>

          {/* Frosted Glassmorphism KPI Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
            <div className="p-5 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 hover:border-brand-400/40 transition-all shadow-xl hover:-translate-y-0.5 group">
              <div className="flex items-center justify-center gap-2 text-brand-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Live Seeded Data</span>
              </div>
              <div className="text-3xl font-black text-white">50+ Students</div>
              <div className="text-xs text-slate-400 mt-1">With active enrollments & accounts</div>
            </div>

            <div className="p-5 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 hover:border-emerald-400/40 transition-all shadow-xl hover:-translate-y-0.5 group">
              <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Timetable Engine</span>
              </div>
              <div className="text-3xl font-black text-emerald-400">100% Collision-Free</div>
              <div className="text-xs text-slate-400 mt-1">Room & faculty collision queries</div>
            </div>

            <div className="p-5 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 hover:border-amber-400/40 transition-all shadow-xl hover:-translate-y-0.5 group">
              <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
                <CircleDollarSign className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Finance & Fees</span>
              </div>
              <div className="text-3xl font-black text-amber-300">BigDecimal</div>
              <div className="text-xs text-slate-400 mt-1">Zero-drift ledger math & receipts</div>
            </div>

            <div className="p-5 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 hover:border-purple-400/40 transition-all shadow-xl hover:-translate-y-0.5 group">
              <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Relational DB</span>
              </div>
              <div className="text-3xl font-black text-purple-300">15 Migrations</div>
              <div className="text-xs text-slate-400 mt-1">Versioned Flyway SQL schemas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live System Preview Mockup */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20">
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-2 sm:p-4 shadow-2xl">
          <div className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden">
            {/* Window bar */}
            <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">EduSuite ERP &bull; Apex Global Trust Portal</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                API Connected (:8080)
              </div>
            </div>

            {/* Mockup Body: 3 Live Feature Showcase Panels */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Feature 1: Collision Timetable */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Timetable Engine</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-md border border-rose-500/30">
                    Collision Guard
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Period Slot Collision Protection</h3>
                <p className="text-xs text-slate-400">
                  Prevents Room LH-101 and Faculty Dr. Ramesh from overlapping slots across sections.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="text-emerald-400 font-bold">&check; Room LH-101 &bull; Mon 09:00</div>
                  <div className="text-slate-400">Section A &bull; CS101 Algorithms</div>
                  <div className="text-rose-400 text-[10px] pt-1 border-t border-slate-800">
                    &times; Conflict: Blocked for Section B
                  </div>
                </div>
              </div>

              {/* Feature 2: 75% Attendance */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Statutory Rule</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md border border-amber-500/30">
                    75% Shortage
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Roster Marking & Gauge Alert</h3>
                <p className="text-xs text-slate-400">
                  Calculates cumulative percentage per semester and raises critical disbarment alerts for hall tickets.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white font-bold">Rohan Mehta (CS-04)</div>
                    <div className="text-[10px] text-rose-400 font-medium">Critical Shortage: 68.4%</div>
                  </div>
                  <div className="px-2.5 py-1 bg-rose-500/20 border border-rose-500/40 text-rose-400 font-extrabold text-xs rounded-lg">
                    DISBARRED
                  </div>
                </div>
              </div>

              {/* Feature 3: BigDecimal Finance */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Finance Ledger</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
                    Sequential
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">Official Receipt Sequence</h3>
                <p className="text-xs text-slate-400">
                  Instant receipt number generation (RCPT-2026-XXXXXX) with term-wise installments and print layout.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                  <div className="text-brand-400 font-bold">RCPT-2026-000042</div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Term 1 Fee</span>
                    <span className="text-emerald-400 font-bold">$2,500.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Institutional Architecture Section */}
      <section id="tracks" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Versatile Academic Modeling
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One Unified Engine. Two Institutional Tracks.
          </h2>
          <p className="text-slate-600 text-base">
            No code rewrites required. EduSuite is architected to dynamically adapt terminology and hierarchy 
            whether running a K-12 school or an accredited engineering college.
          </p>

          {/* Track Switcher */}
          <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mt-4">
            <button
              onClick={() => setActiveTrack('COLLEGE')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTrack === 'COLLEGE'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Higher Education / Engineering
            </button>
            <button
              onClick={() => setActiveTrack('SCHOOL')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTrack === 'SCHOOL'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              K-12 School Track
            </button>
          </div>
        </div>

        {/* Track Details Card */}
        <div className="mt-12 bg-slate-50 rounded-3xl border border-slate-200 p-8 lg:p-12">
          {activeTrack === 'COLLEGE' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 bg-brand-100 text-brand-800 text-xs font-bold rounded-lg uppercase">
                  Degree Colleges, Engineering & B-Schools
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Department, Program & Credit-Based Semester Structure
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Engineered for university regulations. Supports academic departments, multi-year degree programs 
                  (B.Tech, MBA, B.Sc), semester transitions (Sem 1 to Sem 8), course credits, and GPA grading formulas.
                </p>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Hierarchy: Organization &rarr; Campus &rarr; Dept &rarr; Program &rarr; Semester &rarr; Section</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Grading: Internal (30) + External (70) = Total (100) &rarr; SGPA & CGPA Calculation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Transcripts: Consolidated Semester Grade Cards with Backlog Tracking</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm font-mono text-xs space-y-3">
                <div className="text-slate-400 font-sans font-bold text-xs uppercase">Seeded College Hierarchy</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-brand-700 font-bold">Institution:</span> Apex Global Educational Trust
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 ml-4">
                  <span className="text-brand-700 font-bold">Campus:</span> Apex Tech Campus (Engineering)
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 ml-8">
                  <span className="text-brand-700 font-bold">Department:</span> Computer Science & Engineering
                </div>
                <div className="p-3 bg-brand-50/80 rounded-xl border border-brand-200 ml-12">
                  <span className="text-brand-900 font-bold">Program:</span> B.Tech CSE &bull; Sem 1 &bull; Section A
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg uppercase">
                  Primary, Secondary & Senior Secondary
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Class, Section & Continuous Evaluation (CCE)
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tailored for elementary and high school operations. Simplifies management to Grades/Classes (Grade 1 through 12), 
                  sections, homeroom daily attendance, and continuous assessment reporting.
                </p>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Hierarchy: Organization &rarr; Campus &rarr; Class (Grade 10) &rarr; Section (A/B/C)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Attendance: Single daily Homeroom marking or subject-wise periods</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Promotion: Annual batch promotion to next grade level with historical archive</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm font-mono text-xs space-y-3">
                <div className="text-slate-400 font-sans font-bold text-xs uppercase">Seeded School Hierarchy</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-emerald-700 font-bold">Institution:</span> Apex Global Educational Trust
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 ml-4">
                  <span className="text-emerald-700 font-bold">Campus:</span> Apex International School
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 ml-8">
                  <span className="text-emerald-700 font-bold">Class:</span> Class 10 (Secondary Board)
                </div>
                <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 ml-12">
                  <span className="text-emerald-900 font-bold">Section:</span> Section A (Capacity: 40 Students)
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 12 Core Modules Grid */}
      <section id="modules" className="py-24 bg-slate-50/75 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Comprehensive Domain Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              12 Production Modules. Built End-to-End.
            </h2>
            <p className="text-slate-600 text-base">
              Every card below is backed by relational JPA repositories, real database tables, and live REST controllers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${m.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                        {m.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Credentials Quick Switcher */}
      <section id="demo-roles" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Ready-to-Test Personas
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One-Click Demo Credentials
          </h2>
          <p className="text-slate-600 text-base">
            All accounts are provisioned by the seed database initializer with password: <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-brand-600 font-bold">password123</code>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoAccounts.map(acc => (
            <div 
              key={acc.email} 
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-brand-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{acc.role}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${acc.color}`}>
                    {acc.tag}
                  </span>
                </div>
                <div className="mt-2 font-mono text-xs text-slate-600">
                  {acc.email}
                </div>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center justify-between text-xs font-bold text-brand-600 hover:text-brand-700 pt-2 border-t border-slate-100"
              >
                <span>Login with this role</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Technology & Architecture Section */}
      <section id="architecture" className="py-20 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Enterprise Engineering Stack
            </h2>
            <p className="text-slate-400 text-sm">
              Strictly engineered with modern industry standards for high availability and auditability.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800">
              <div className="text-lg font-bold text-brand-400">Spring Boot 3.3.4</div>
              <div className="text-xs text-slate-400 mt-1">Java 17 / 21 &bull; REST APIs</div>
            </div>
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800">
              <div className="text-lg font-bold text-emerald-400">MySQL 8.0</div>
              <div className="text-xs text-slate-400 mt-1">15 Flyway Versioned Migrations</div>
            </div>
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800">
              <div className="text-lg font-bold text-amber-400">React 18 + Vite</div>
              <div className="text-xs text-slate-400 mt-1">TypeScript &bull; Tailwind CSS</div>
            </div>
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800">
              <div className="text-lg font-bold text-purple-400">Spring Security 6</div>
              <div className="text-xs text-slate-400 mt-1">Stateless JWT + Refresh Rotation</div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="p-8 sm:p-10 bg-gradient-to-r from-brand-900 to-slate-900 rounded-3xl border border-brand-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-white">Experience EduSuite ERP In Action</h3>
              <p className="text-sm text-brand-200 mt-1">
                Access the complete portal with pre-loaded students, schedules, fees, and report cards.
              </p>
            </div>
            <Link
              to="/login"
              className="px-8 py-3.5 bg-white text-brand-900 font-bold text-sm rounded-xl hover:bg-brand-50 shadow-lg transition-all shrink-0"
            >
              Enter ERP Portal Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 text-xs py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-slate-300">EduSuite ERP</span>
            <span>&bull;</span>
            <span>Enterprise Multi-Campus Management System</span>
          </div>
          <div className="font-mono text-[11px]">
            &copy; 2026 Apex Global Educational Trust. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
