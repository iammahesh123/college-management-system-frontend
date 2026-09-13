import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { Student, AttendanceStats, StudentFeeAccount, ReportCardDto } from '../types/domain';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { PrintableReportCard } from '../components/common/PrintableReportCard';
import { Search, Eye, CircleDollarSign, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals for Detail / Fees / Attendance / Marks
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [viewDetailModal, setViewDetailModal] = useState(false);
  const [feeAccount, setFeeAccount] = useState<StudentFeeAccount | null>(null);
  const [viewFeeModal, setViewFeeModal] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [viewAttendanceModal, setViewAttendanceModal] = useState(false);
  const [reportCard, setReportCard] = useState<ReportCardDto | null>(null);
  const [viewReportModal, setViewReportModal] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/students?query=${encodeURIComponent(query)}&page=${page}&size=10`);
      setStudents(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setTotalElements(res.data.data.totalElements);
    } catch (err) {
      console.error('Error fetching students', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, query]);

  const handleViewFees = async (student: Student) => {
    setSelectedStudent(student);
    try {
      const res = await apiClient.get(`/fees/students/${student.id}`);
      setFeeAccount(res.data.data);
      setViewFeeModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewAttendance = async (student: Student) => {
    setSelectedStudent(student);
    try {
      const res = await apiClient.get(`/attendance/students/${student.id}/stats`);
      setAttendanceStats(res.data.data);
      setViewAttendanceModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewResults = async (student: Student) => {
    setSelectedStudent(student);
    try {
      // Fetch report card from exam 1 (Mid-Term 1 seeded)
      const res = await apiClient.get(`/exams/1/report-card/${student.id}`);
      setReportCard(res.data.data);
      setViewReportModal(true);
    } catch (err) {
      alert('Report card for this student is currently being processed or pending exam.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Directory</h1>
          <p className="text-xs text-slate-500 font-medium">
            Total active students enrolled: <strong>{totalElements}</strong>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, admission no, roll..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* High-density Student Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Admission No</th>
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Gender / DOB</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                        {student.firstName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {student.firstName} {student.lastName}
                        </span>
                        <span className="text-[10px] text-slate-400">{student.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-brand-700">
                    {student.admissionNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {student.rollNumber || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span>{student.gender}</span>
                    <span className="block text-[10px] text-slate-400">{student.dateOfBirth}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span>{student.phone || '—'}</span>
                    <span className="block text-[10px] text-slate-400 truncate max-w-[140px]">{student.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={student.currentStatus} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setViewDetailModal(true);
                        }}
                        title="View Full Profile"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewFees(student)}
                        title="View Fees Ledger"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50"
                      >
                        <CircleDollarSign className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewAttendance(student)}
                        title="View Attendance Percentage"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewResults(student)}
                        title="View Marks Memo"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Award className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Page {page + 1} of {Math.max(1, totalPages)} ({totalElements} records)
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Detail Modal */}
      <Modal
        isOpen={viewDetailModal}
        onClose={() => setViewDetailModal(false)}
        title="Student Comprehensive Profile"
      >
        {selectedStudent && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Full Name</span>
                <span className="font-bold text-slate-900 text-sm">{selectedStudent.firstName} {selectedStudent.lastName}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Admission Number</span>
                <span className="font-mono font-bold text-brand-700 text-sm">{selectedStudent.admissionNumber}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Roll Number</span>
                <span className="font-mono font-bold text-slate-700">{selectedStudent.rollNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Admission Date</span>
                <span className="font-semibold text-slate-800">{selectedStudent.admissionDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Date of Birth</span>
                <span className="font-semibold text-slate-800">{selectedStudent.dateOfBirth} ({selectedStudent.gender})</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Current Status</span>
                <StatusBadge status={selectedStudent.currentStatus} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Fee Ledger Modal */}
      <Modal
        isOpen={viewFeeModal}
        onClose={() => setViewFeeModal(false)}
        title={`Student Fee Account - ${selectedStudent?.admissionNumber}`}
        maxWidth="xl"
      >
        {feeAccount && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl text-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Annual Fee</span>
                <span className="font-bold text-slate-900 text-base">₹{feeAccount.totalFeeAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Paid</span>
                <span className="font-bold text-emerald-700 text-base">₹{feeAccount.paidAmount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Outstanding</span>
                <span className="font-bold text-rose-600 text-base">₹{feeAccount.outstandingBalance.toLocaleString()}</span>
              </div>
            </div>

            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mt-4">Installment Schedule</h4>
            <div className="space-y-2">
              {feeAccount.installments?.map((inst) => (
                <div key={inst.id} className="p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 block">{inst.title}</span>
                    <span className="text-[10px] text-slate-400">Due: {inst.dueDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">₹{inst.amount.toLocaleString()}</span>
                    <StatusBadge status={inst.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Attendance Stats Modal */}
      <Modal
        isOpen={viewAttendanceModal}
        onClose={() => setViewAttendanceModal(false)}
        title={`Attendance Analytics - ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
      >
        {attendanceStats && (
          <div className="space-y-4 text-center">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-4xl font-black text-slate-900 block">
                {attendanceStats.attendancePercentage}%
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1 block">
                Overall Attendance
              </span>

              {attendanceStats.shortageAlert ? (
                <span className="inline-block mt-3 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200">
                  ⚠️ Critical Attendance Shortage (&lt; 75% threshold)
                </span>
              ) : (
                <span className="inline-block mt-3 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                  ✓ Attendance Eligible (&gt;= 75% requirement met)
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block">Total Classes</span>
                <span className="font-bold text-slate-800 text-sm">{attendanceStats.totalSessions}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <span className="text-emerald-700 block">Present</span>
                <span className="font-bold text-emerald-800 text-sm">{attendanceStats.presentSessions}</span>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl">
                <span className="text-rose-700 block">Absent</span>
                <span className="font-bold text-rose-800 text-sm">{attendanceStats.absentSessions}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Report Card Modal */}
      <Modal
        isOpen={viewReportModal}
        onClose={() => setViewReportModal(false)}
        title="Student Academic Report Card"
        maxWidth="3xl"
      >
        {reportCard && <PrintableReportCard data={reportCard} />}
      </Modal>
    </div>
  );
};
