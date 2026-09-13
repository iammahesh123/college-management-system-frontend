import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building, 
  UserCheck, 
  UserPlus 
} from 'lucide-react';
import api from '../api/client';
import { Faculty, Department } from '../types/domain';
import { Modal } from '../components/common/Modal';

export const FacultyPage: React.FC = () => {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeTab, setActiveTab] = useState<'FACULTY' | 'STAFF'>('FACULTY');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [facultyForm, setFacultyForm] = useState({
    employeeNumber: '',
    firstName: '',
    lastName: '',
    designation: 'Assistant Professor',
    qualification: 'M.Tech, Ph.D',
    email: '',
    phone: '',
    departmentId: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [facRes, staffRes, deptRes] = await Promise.all([
        api.get('/faculty'),
        api.get('/faculty/staff'),
        api.get('/academics/departments')
      ]);

      if (facRes.data?.success) setFacultyList(facRes.data.data);
      if (staffRes.data?.success) setStaffList(staffRes.data.data);
      if (deptRes.data?.success) setDepartments(deptRes.data.data);
    } catch (err) {
      console.error('Failed to load faculty records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        employeeNumber: facultyForm.employeeNumber,
        firstName: facultyForm.firstName,
        lastName: facultyForm.lastName,
        designation: facultyForm.designation,
        qualification: facultyForm.qualification,
        email: facultyForm.email,
        phone: facultyForm.phone,
        department: { id: Number(facultyForm.departmentId) }
      };

      const res = await api.post('/faculty', payload);
      if (res.data?.success) {
        setIsFacultyModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to save faculty member', err);
    }
  };

  const filteredFaculty = facultyList.filter(f => 
    `${f.firstName} ${f.lastName} ${f.employeeNumber} ${f.designation}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-brand-600" />
            Faculty & Administrative Staff Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Professors, lecturers, teachers, and campus operational staff profiles and department assignments.
          </p>
        </div>

        <button
          onClick={() => setIsFacultyModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Faculty Member
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('FACULTY')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'FACULTY' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Academic Faculty ({facultyList.length})
          </button>
          <button
            onClick={() => setActiveTab('STAFF')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'STAFF' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Support Staff ({staffList.length})
          </button>
        </div>

        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, employee code, designation..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-xl pl-10 pr-4 py-2 bg-slate-50 focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : activeTab === 'FACULTY' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map(f => (
            <div key={f.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 hover:border-brand-300 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md">
                    {f.employeeNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {f.firstName} {f.lastName}
                  </h3>
                  <div className="text-xs font-semibold text-brand-600">{f.designation}</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                  {f.firstName[0]}{f.lastName[0]}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{f.qualification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{f.department?.name || 'Department of Computer Science'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{f.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono">{f.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Staff Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.map((s: any) => (
            <div key={s.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                  {s.employeeNumber}
                </span>
                <span className="text-xs font-bold text-slate-500">{s.roleCategory}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{s.firstName} {s.lastName}</h3>
              <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                <div>Email: <span className="font-medium text-slate-800">{s.email}</span></div>
                <div>Phone: <span className="font-mono text-slate-800">{s.phone}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add Faculty */}
      <Modal
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        title="Register Faculty Member"
      >
        <form onSubmit={handleCreateFaculty} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Employee Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. FAC-2026-042"
                value={facultyForm.employeeNumber}
                onChange={e => setFacultyForm({ ...facultyForm, employeeNumber: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Designation *</label>
              <input
                type="text"
                required
                value={facultyForm.designation}
                onChange={e => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={facultyForm.firstName}
                onChange={e => setFacultyForm({ ...facultyForm, firstName: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={facultyForm.lastName}
                onChange={e => setFacultyForm({ ...facultyForm, lastName: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={facultyForm.email}
                onChange={e => setFacultyForm({ ...facultyForm, email: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone *</label>
              <input
                type="text"
                required
                value={facultyForm.phone}
                onChange={e => setFacultyForm({ ...facultyForm, phone: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Qualification *</label>
              <input
                type="text"
                required
                value={facultyForm.qualification}
                onChange={e => setFacultyForm({ ...facultyForm, qualification: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
              <select
                required
                value={facultyForm.departmentId}
                onChange={e => setFacultyForm({ ...facultyForm, departmentId: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              >
                <option value="">-- Choose Department --</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>[{d.code}] {d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFacultyModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
            >
              Save Faculty Member
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
