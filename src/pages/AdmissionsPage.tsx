import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { GraduationCap, UserPlus, CheckCircle, Clock, Search, ArrowRight } from 'lucide-react';

export const AdmissionsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [targetSectionId, setTargetSectionId] = useState<number>(1);
  const [actionSuccess, setActionSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '2005-05-15',
    gender: 'MALE',
    guardianName: '',
    guardianPhone: '',
  });

  const fetchApplications = async () => {
    try {
      const res = await apiClient.get('/admissions/applications');
      setApplications(res.data.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/admissions/applications', {
        ...formData,
        academicYear: { id: 1 },
        program: { id: 1 },
      });
      setCreateModal(false);
      setActionSuccess('Admission application submitted successfully!');
      fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting application');
    }
  };

  const handleConfirmAdmission = async () => {
    if (!selectedApp) return;
    try {
      const res = await apiClient.post(`/admissions/applications/${selectedApp.id}/confirm?sectionId=${targetSectionId}`);
      setConfirmModal(false);
      setActionSuccess(`Student ${res.data.data.firstName} ${res.data.data.lastName} admitted with Admission Number ${res.data.data.admissionNumber}!`);
      fetchApplications();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to confirm admission');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admissions Funnel</h1>
          <p className="text-xs text-slate-500 font-medium">
            Review applicant inquiries and confirm enrollment into active classes
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-brand-600/20 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          New Application
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-emerald-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Application No</th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Guardian</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">{app.applicationNumber}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{app.firstName} {app.lastName}</span>
                      <span className="text-[10px] text-slate-400">{app.gender} • DOB: {app.dateOfBirth}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span>{app.phone}</span>
                      <span className="block text-[10px] text-slate-400">{app.email}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-semibold text-slate-800 block">{app.guardianName}</span>
                      <span className="text-[10px] text-slate-400">{app.guardianPhone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {app.status !== 'ADMITTED' ? (
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setConfirmModal(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          Confirm Admission
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Admitted
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No admission applications submitted yet. Click "New Application" to register one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Admission Modal */}
      <Modal
        isOpen={confirmModal}
        onClose={() => setConfirmModal(false)}
        title="Confirm Student Admission & Enrollment"
      >
        {selectedApp && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 block">Applicant Name:</span>
              <strong className="text-slate-900 text-sm">{selectedApp.firstName} {selectedApp.lastName}</strong>
              <span className="text-slate-400 block mt-1">Application #{selectedApp.applicationNumber}</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Assign to Section (Enforces Section Capacity)
              </label>
              <select
                value={targetSectionId}
                onChange={(e) => setTargetSectionId(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 text-xs focus:border-brand-500 focus:outline-none"
              >
                <option value={1}>B.Tech CSE - Section A (Capacity: 60)</option>
                <option value={2}>B.Tech CSE - Section B (Capacity: 60)</option>
                <option value={3}>Class 10 - Section A (Capacity: 40)</option>
              </select>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
              Confirming admission will atomically create the student record, assign an official Admission Number (ADM-2026-XXXXXX), and register the student into the active section.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAdmission}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-600/20"
              >
                Confirm & Enroll Student
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Application Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Submit Admission Application"
      >
        <form onSubmit={handleCreateApplication} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">First Name</label>
              <input
                required
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Last Name</label>
              <input
                required
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Phone</label>
              <input
                required
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Guardian Name</label>
              <input
                required
                type="text"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Guardian Phone</label>
              <input
                required
                type="text"
                value={formData.guardianPhone}
                onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-brand-600 text-white font-bold shadow-sm hover:bg-brand-700"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
