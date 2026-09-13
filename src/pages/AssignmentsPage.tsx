import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  User, 
  Upload, 
  Award,
  Filter
} from 'lucide-react';
import api from '../api/client';
import { Assignment, Section, Subject, Faculty } from '../types/domain';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/StatusBadge';

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  
  const [selectedSectionId, setSelectedSectionId] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    maxMarks: '25',
    dueDate: '',
    sectionId: '',
    subjectId: '',
    facultyId: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [assRes, secRes, subRes, facRes] = await Promise.all([
        api.get('/assignments'),
        api.get('/academics/sections'),
        api.get('/academics/subjects'),
        api.get('/faculty')
      ]);

      if (assRes.data?.success) setAssignments(assRes.data.data);
      if (secRes.data?.success) setSections(secRes.data.data);
      if (subRes.data?.success) setSubjects(subRes.data.data);
      if (facRes.data?.success) {
        setFacultyList(facRes.data.data);
        if (facRes.data.data.length > 0) setForm(prev => ({ ...prev, facultyId: String(facRes.data.data[0].id) }));
      }
    } catch (err) {
      console.error('Failed to load assignments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        description: form.description,
        maxMarks: Number(form.maxMarks),
        dueDate: form.dueDate,
        section: { id: Number(form.sectionId) },
        subject: { id: Number(form.subjectId) },
        faculty: { id: Number(form.facultyId) }
      };

      const res = await api.post('/assignments', payload);
      if (res.data?.success) {
        setIsModalOpen(false);
        setForm({
          title: '',
          description: '',
          maxMarks: '25',
          dueDate: '',
          sectionId: '',
          subjectId: '',
          facultyId: facultyList[0]?.id ? String(facultyList[0].id) : ''
        });
        fetchData();
      }
    } catch (err) {
      console.error('Failed to create assignment', err);
    }
  };

  const filteredAssignments = assignments.filter(a => {
    if (selectedSectionId === 'ALL') return true;
    return a.section?.id === Number(selectedSectionId);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-brand-600" />
            Course Assignments & Continuous Assessment
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish coursework, set grading rubrics, manage student submissions, and award internal marks.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <Filter className="w-4 h-4 text-slate-400" />
        <label className="text-xs font-bold text-slate-700 uppercase">Filter Section:</label>
        <select
          value={selectedSectionId}
          onChange={e => setSelectedSectionId(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 font-medium"
        >
          <option value="ALL">All Sections (Entire Institution)</option>
          {sections.map(s => (
            <option key={s.id} value={s.id}>
              Section {s.name} {s.schoolClass ? `(Class ${s.schoolClass.name})` : s.program ? `(${s.program.shortName || s.program.code})` : ''}
            </option>
          ))}
        </select>
        <span className="ml-auto text-xs text-slate-400">
          Showing {filteredAssignments.length} assignments
        </span>
      </div>

      {/* Assignments Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map(a => (
            <div key={a.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 hover:border-brand-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md">
                    {a.subject?.code || 'SUB-101'}
                  </span>
                  <StatusBadge status={a.status || 'ACTIVE'} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{a.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-3">{a.description}</p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Max Score:</span>
                  <span className="font-bold text-emerald-700">{a.maxMarks} Points</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Due Deadline:</span>
                  <span className="font-mono font-bold text-rose-700">{a.dueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Faculty:</span>
                  <span className="font-medium text-slate-800">
                    {a.faculty ? `${a.faculty.firstName} ${a.faculty.lastName}` : 'Course Instructor'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Section:</span>
                  <span className="font-semibold text-brand-700">Section {a.section?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Assignment */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Course Assignment"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Laboratory Report on Binary Search Trees"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Instructions *</label>
            <textarea
              required
              rows={3}
              placeholder="Problem statement, deliverables, citation rules..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Marks *</label>
              <input
                type="number"
                required
                value={form.maxMarks}
                onChange={e => setForm({ ...form, maxMarks: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Due Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section *</label>
              <select
                required
                value={form.sectionId}
                onChange={e => setForm({ ...form, sectionId: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              >
                <option value="">-- Choose Section --</option>
                {sections.map(s => (
                  <option key={s.id} value={s.id}>
                    Section {s.name} {s.schoolClass ? `(Class ${s.schoolClass.name})` : s.program ? `(${s.program.shortName || s.program.code})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
              <select
                required
                value={form.subjectId}
                onChange={e => setForm({ ...form, subjectId: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>[{s.code}] {s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Instructor *</label>
            <select
              required
              value={form.facultyId}
              onChange={e => setForm({ ...form, facultyId: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
            >
              {facultyList.map(f => (
                <option key={f.id} value={f.id}>{f.firstName} {f.lastName} ({f.designation})</option>
              ))}
            </select>
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
              className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
