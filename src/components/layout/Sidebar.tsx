import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  CheckSquare,
  FileSpreadsheet,
  Award,
  CircleDollarSign,
  Briefcase,
  Layers,
  Bell,
  School,
  X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Admissions', href: '/admissions', icon: GraduationCap },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Academics', href: '/academics', icon: BookOpen },
    { name: 'Timetable', href: '/timetable', icon: Calendar },
    { name: 'Attendance', href: '/attendance', icon: CheckSquare },
    { name: 'Assignments', href: '/assignments', icon: FileSpreadsheet },
    { name: 'Examinations', href: '/examinations', icon: Award },
    { name: 'Finance & Fees', href: '/finance', icon: CircleDollarSign },
    { name: 'Faculty & Staff', href: '/faculty', icon: Briefcase },
    { name: 'Facilities & Ops', href: '/operations', icon: Layers },
    { name: 'Notice Board', href: '/notices', icon: Bell },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-950 text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white leading-none">EduSuite</h2>
              <span className="text-[10px] text-brand-400 font-bold uppercase tracking-wider">Enterprise ERP</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Info Card */}
        <div className="mx-4 my-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Educational Group</p>
          <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">Apex Global Educational Trust</p>
          <span className="inline-block text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full mt-1.5 font-medium border border-emerald-800/40">
            Multi-Campus Active
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer User Info */}
        <div className="p-4 border-t border-slate-800/80 bg-navy-900/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-brand-400">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="truncate text-left">
              <p className="text-xs font-bold text-slate-200 truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email || 'admin@apex.edu'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
