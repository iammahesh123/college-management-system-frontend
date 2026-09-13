import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Search, Bell, LogOut, Building2, UserCircle, School } from 'lucide-react';
import apiClient from '../../api/client';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, activeCampus, setActiveCampus } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await apiClient.get(`/dashboard/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 md:px-6">
      {/* Mobile Menu & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students, faculty, admission no, receipts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100/70 hover:bg-slate-100 focus:bg-white rounded-xl border border-transparent focus:border-brand-500 focus:outline-none transition-all placeholder:text-slate-400"
            />
          </form>

          {/* Quick Search Popover */}
          {searchResults && (
            <div className="absolute left-0 mt-2 w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Search Results</span>
                <button
                  onClick={() => setSearchResults(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>
              {searchResults.students?.length > 0 ? (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">Students</span>
                  {searchResults.students.map((s: any) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSearchResults(null);
                        navigate('/students');
                      }}
                      className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-800">{s.firstName} {s.lastName}</span>
                      <span className="text-slate-400 font-mono">{s.admissionNumber}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-2">No matching records found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Campus Selector, User Profile & Actions */}
      <div className="flex items-center gap-3">
        {/* Campus Switcher */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 text-xs font-medium text-slate-700">
          <Building2 className="w-3.5 h-3.5 text-brand-600" />
          <select
            value={activeCampus}
            onChange={(e) => setActiveCampus(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-xs text-slate-700 font-medium cursor-pointer"
          >
            <option value="Apex Tech Campus (Engineering & Higher Ed)">Tech Campus (Engineering)</option>
            <option value="Apex Global School Campus (K-12)">School Campus (K-12)</option>
          </select>
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-800 font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'Administrator'}</p>
            <span className="text-[10px] font-semibold text-brand-700 uppercase tracking-wider">
              {user?.roles?.[0]?.replace('ROLE_', '') || 'STAFF'}
            </span>
          </div>

          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 ml-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
