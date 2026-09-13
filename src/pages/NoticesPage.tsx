import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Tag, 
  Users, 
  Clock 
} from 'lucide-react';
import api from '../api/client';
import { Notice } from '../types/domain';
import { Modal } from '../components/common/Modal';

export const NoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAudience, setFilterAudience] = useState<string>('ALL');

  // New Notice Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    audience: 'ALL',
    priority: 'NORMAL'
  });
  const [saving, setSaving] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/operations/notices');
      if (res.data?.success) {
        setNotices(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load notices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/operations/notices', noticeForm);
      if (res.data?.success) {
        setIsModalOpen(false);
        setNoticeForm({
          title: '',
          content: '',
          audience: 'ALL',
          priority: 'NORMAL'
        });
        fetchNotices();
      }
    } catch (err) {
      console.error('Failed to post notice', err);
    } finally {
      setSaving(false);
    }
  };

  const filteredNotices = notices.filter(n => {
    if (filterAudience === 'ALL') return true;
    return n.audience === filterAudience || n.audience === 'ALL';
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 font-extrabold text-[10px] rounded-md uppercase tracking-wider">Urgent</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-extrabold text-[10px] rounded-md uppercase tracking-wider">High Priority</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded-md uppercase tracking-wider">General</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-brand-600" />
            Institutional Notice Board & Circulars
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Official announcements, academic calendars, fee deadlines, and circulars for students, faculty, and parents.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Publish Notice
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-700 uppercase">Target Audience:</span>
        <div className="flex gap-2">
          {['ALL', 'STUDENTS', 'FACULTY', 'PARENTS'].map(aud => (
            <button
              key={aud}
              onClick={() => setFilterAudience(aud)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filterAudience === aud
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {aud}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotices.map(notice => (
            <div
              key={notice.id}
              className={`bg-white p-6 rounded-2xl border transition-all space-y-4 shadow-xs ${
                notice.priority === 'URGENT'
                  ? 'border-rose-300 ring-1 ring-rose-300'
                  : 'border-slate-200/80 hover:border-brand-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPriorityBadge(notice.priority)}
                  <span className="text-xs font-bold px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md">
                    To: {notice.audience}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  {notice.publishedDate}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{notice.title}</h3>
                <p className="text-sm text-slate-600 mt-2 whitespace-pre-line leading-relaxed">
                  {notice.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Apex Global Administration</span>
                <span className="font-mono">Circular #{notice.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Publish Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Official Notice"
      >
        <form onSubmit={handleCreateNotice} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notice Headline *</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule for Mid-Term Examination 2026"
              value={noticeForm.title}
              onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience *</label>
              <select
                value={noticeForm.audience}
                onChange={e => setNoticeForm({ ...noticeForm, audience: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
              >
                <option value="ALL">Entire Campus (All)</option>
                <option value="STUDENTS">Students Only</option>
                <option value="FACULTY">Faculty & Staff</option>
                <option value="PARENTS">Parents & Guardians</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level *</label>
              <select
                value={noticeForm.priority}
                onChange={e => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
              >
                <option value="NORMAL">Normal / Routine</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent / Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notice Content *</label>
            <textarea
              required
              rows={4}
              placeholder="Write circular details, dates, instructions..."
              value={noticeForm.content}
              onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg disabled:opacity-50"
            >
              {saving ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
