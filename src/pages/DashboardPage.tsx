import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../api/client';
import { AdminDashboardMetrics, Notice } from '../types/domain';
import {
  Users,
  GraduationCap,
  Briefcase,
  CircleDollarSign,
  TrendingUp,
  Award,
  Bell,
  ArrowUpRight,
  UserCheck,
  CalendarCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user, activeCampus } = useAuthStore();
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsRes, noticesRes] = await Promise.all([
          apiClient.get('/dashboard/admin'),
          apiClient.get('/operations/notices')
        ]);
        setMetrics(metricsRes.data.data);
        setNotices(noticesRes.data.data);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 mb-3">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Live Educational Group Operations
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Administrator'}
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Active Campus: <strong className="text-white">{activeCampus}</strong>. Complete institutional records, live admissions, financial ledgers, and exam processing are operational.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900">
            {metrics?.totalStudents ?? 50}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{metrics?.activeStudents ?? 50} active students</span>
          </div>
        </div>

        {/* Total Fee Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Fee Collected</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CircleDollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900">
            ₹{metrics?.totalFeeCollected ? Number(metrics.totalFeeCollected).toLocaleString() : '0'}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500">
            <span>Outstanding: ₹{metrics?.totalOutstandingFees ? Number(metrics.totalOutstandingFees).toLocaleString() : '0'}</span>
          </div>
        </div>

        {/* Admissions Funnel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Admissions</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900">
            {metrics?.admittedCount ?? 0}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500">
            <span>{metrics?.applicationCount ?? 0} total applications</span>
          </div>
        </div>

        {/* Faculty Ratio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Faculty Ratio</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl md:text-3xl font-black text-slate-900">
            {metrics?.studentToFacultyRatio ?? '5.0'}:1
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500">
            <span>{metrics?.facultyCount ?? 10} teaching professors</span>
          </div>
        </div>
      </div>

      {/* Quick Workflows & Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Operations Shortcuts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">Core Educational Workflows</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admissions"
              className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-brand-50/40 hover:border-brand-200 transition-all flex items-start gap-3"
            >
              <div className="p-2.5 rounded-xl bg-white text-brand-600 shadow-sm group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700">Admission Processing</h4>
                <p className="text-xs text-slate-500 mt-0.5">Review applications and confirm admission to active classes</p>
              </div>
            </Link>

            <Link
              to="/attendance"
              className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-brand-50/40 hover:border-brand-200 transition-all flex items-start gap-3"
            >
              <div className="p-2.5 rounded-xl bg-white text-emerald-600 shadow-sm group-hover:scale-105 transition-transform">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">Take Class Attendance</h4>
                <p className="text-xs text-slate-500 mt-0.5">One-click bulk attendance marking & 75% shortage alerts</p>
              </div>
            </Link>

            <Link
              to="/finance"
              className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-brand-50/40 hover:border-brand-200 transition-all flex items-start gap-3"
            >
              <div className="p-2.5 rounded-xl bg-white text-amber-600 shadow-sm group-hover:scale-105 transition-transform">
                <CircleDollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700">Fee Ledger & Receipts</h4>
                <p className="text-xs text-slate-500 mt-0.5">Accept student fees and print official sequence receipts</p>
              </div>
            </Link>

            <Link
              to="/examinations"
              className="group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-brand-50/40 hover:border-brand-200 transition-all flex items-start gap-3"
            >
              <div className="p-2.5 rounded-xl bg-white text-indigo-600 shadow-sm group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">Exams & Report Cards</h4>
                <p className="text-xs text-slate-500 mt-0.5">Enter marks, process results, and generate grade memos</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Live Notices Feed */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-600" />
              Notice Board
            </h2>
            <Link to="/notices" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {notices.length > 0 ? (
              notices.slice(0, 4).map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                    <span className="bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">{n.priority}</span>
                    <span>{new Date(n.publishedDate).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{n.content}</p>
                </div>
              ))
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">ANNOUNCEMENT</span>
                <h4 className="text-xs font-bold text-slate-900 mt-2">Semester Mid-Term Examinations</h4>
                <p className="text-[11px] text-slate-600 mt-1">Schedules are published. Faculty mark submission portal is now active.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
