import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Search, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import api from '../api/client';
import { Section, Enrollment, Faculty, Subject, AttendanceStats } from '../types/domain';
import { Modal } from '../components/common/Modal';

export const AttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TAKE_ATTENDANCE' | 'SHORTAGE_MONITOR'>('TAKE_ATTENDANCE');

  // References
  const [sections, setSections] = useState<Section[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Take Attendance State
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('');
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessionType, setSessionType] = useState<string>('LECTURE');
  
  const [roster, setRoster] = useState<Enrollment[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<{ [studentId: number]: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' }>({});
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Shortage Audit State
  const [auditStudentId, setAuditStudentId] = useState<string>('');
  const [studentStats, setStudentStats] = useState<AttendanceStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [secRes, facRes, subRes] = await Promise.all([
          api.get('/academics/sections'),
          api.get('/faculty'),
          api.get('/academics/subjects')
        ]);
        if (secRes.data?.success) setSections(secRes.data.data);
        if (facRes.data?.success) {
          setFacultyList(facRes.data.data);
          if (facRes.data.data.length > 0) setSelectedFacultyId(String(facRes.data.data[0].id));
        }
        if (subRes.data?.success) setSubjects(subRes.data.data);
      } catch (err) {
        console.error('Failed to load attendance metadata', err);
      }
    };
    fetchDropdowns();
  }, []);

  const handleLoadRoster = async () => {
    if (!selectedSectionId) return;
    setLoadingRoster(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const res = await api.get(`/enrollments/section/${selectedSectionId}`);
      if (res.data?.success) {
        const enrollments: Enrollment[] = res.data.data;
        setRoster(enrollments);
        // Default everyone to PRESENT
        const initialMap: { [id: number]: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' } = {};
        enrollments.forEach(en => {
          initialMap[en.student.id] = 'PRESENT';
        });
        setAttendanceMap(initialMap);
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to load enrolled section students.');
    } finally {
      setLoadingRoster(false);
    }
  };

  const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
    const updated: { [id: number]: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' } = {};
    roster.forEach(en => {
      updated[en.student.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleStatusChange = (studentId: number, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedSectionId || roster.length === 0) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      // 1. Create or schedule session
      const sessionPayload: any = {
        sessionDate,
        sessionType,
        section: { id: Number(selectedSectionId) },
        takenByFaculty: { id: Number(selectedFacultyId || facultyList[0]?.id || 1) }
      };
      if (selectedSubjectId) {
        sessionPayload.subject = { id: Number(selectedSubjectId) };
      }

      const sessionRes = await api.post('/attendance/sessions', sessionPayload);
      if (!sessionRes.data?.success) {
        throw new Error(sessionRes.data?.message || 'Failed to create session');
      }

      const sessionId = sessionRes.data.data.id;

      // 2. Submit bulk marking
      const markRes = await api.post(`/attendance/sessions/${sessionId}/mark`, attendanceMap);
      if (markRes.data?.success) {
        const presentCount = Object.values(attendanceMap).filter(s => s === 'PRESENT').length;
        setSubmitSuccess(`Attendance successfully saved! ${presentCount} of ${roster.length} students recorded present.`);
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Failed to record attendance session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckStudentStats = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditStudentId) return;
    setLoadingStats(true);
    setStatsError(null);
    setStudentStats(null);
    try {
      const res = await api.get(`/attendance/students/${auditStudentId}/stats`);
      if (res.data?.success) {
        setStudentStats(res.data.data);
      }
    } catch (err: any) {
      setStatsError(err.response?.data?.message || 'Student not found or no attendance recorded.');
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-brand-600" />
            Attendance Management System
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bulk class roster attendance recording, percentage calculation, and 75% shortage monitoring.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('TAKE_ATTENDANCE')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'TAKE_ATTENDANCE'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Roster Marking
          </button>
          <button
            onClick={() => setActiveTab('SHORTAGE_MONITOR')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'SHORTAGE_MONITOR'
                ? 'bg-white text-brand-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            75% Shortage & Audit
          </button>
        </div>
      </div>

      {activeTab === 'TAKE_ATTENDANCE' ? (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Session Parameters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section *</label>
                <select
                  value={selectedSectionId}
                  onChange={(e) => {
                    setSelectedSectionId(e.target.value);
                    setRoster([]);
                  }}
                  className="w-full text-sm font-medium border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full text-sm font-medium border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Session Type *</label>
                <select
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  className="w-full text-sm font-medium border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="LECTURE">Theory Lecture</option>
                  <option value="LAB">Lab Session</option>
                  <option value="TUTORIAL">Tutorial</option>
                  <option value="HOMEROOM">Daily Homeroom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject (Higher Ed)</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full text-sm font-medium border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">All / Class-wide</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>[{sub.code}] {sub.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  disabled={!selectedSectionId || loadingRoster}
                  onClick={handleLoadRoster}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                >
                  {loadingRoster ? 'Loading...' : 'Load Class Roster'}
                </button>
              </div>
            </div>
          </div>

          {submitSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              {submitSuccess}
            </div>
          )}

          {submitError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              {submitError}
            </div>
          )}

          {/* Student Roster Table */}
          {roster.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Active Student Roster ({roster.length} Enrolled)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mark individual attendance or use bulk toggles below.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleMarkAll('PRESENT')}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    Mark All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAll('ABSENT')}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="p-4 w-16">#</th>
                      <th className="p-4">Roll No</th>
                      <th className="p-4">Admission #</th>
                      <th className="p-4">Student Name</th>
                      <th className="p-4 text-center">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {roster.map((en, index) => {
                      const st = en.student;
                      const status = attendanceMap[st.id] || 'PRESENT';

                      return (
                        <tr key={en.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-mono text-xs text-slate-400">{index + 1}</td>
                          <td className="p-4 font-mono font-bold text-slate-800">{st.rollNumber || 'N/A'}</td>
                          <td className="p-4 font-mono text-xs text-slate-500">{st.admissionNumber}</td>
                          <td className="p-4 font-bold text-slate-900">
                            {st.firstName} {st.lastName}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, 'PRESENT')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                  status === 'PRESENT'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
                                }`}
                              >
                                PRESENT
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, 'ABSENT')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                  status === 'ABSENT'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-rose-50'
                                }`}
                              >
                                ABSENT
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, 'LATE')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                  status === 'LATE'
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
                                }`}
                              >
                                LATE
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(st.id, 'EXCUSED')}
                                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                  status === 'EXCUSED'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-blue-50'
                                }`}
                              >
                                EXCUSED
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-5 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitAttendance}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-50 transition-colors"
                >
                  <CheckSquare className="w-4 h-4" />
                  {submitting ? 'Saving to Database...' : 'Save & Finalize Attendance'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* 75% Shortage & Audit Tab */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-2">Student Attendance Percentage & Shortage Check</h2>
            <p className="text-sm text-slate-500 mb-6">
              Instant evaluation of student cumulative attendance against the statutory 75% mandatory requirement.
            </p>

            <form onSubmit={handleCheckStudentStats} className="flex gap-3 max-w-md">
              <input
                type="number"
                required
                placeholder="Enter Student ID (e.g., 1, 2, 3...)"
                value={auditStudentId}
                onChange={e => setAuditStudentId(e.target.value)}
                className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                disabled={loadingStats}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-xl disabled:opacity-50"
              >
                {loadingStats ? 'Checking...' : 'Check Status'}
              </button>
            </form>

            {statsError && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                {statsError}
              </div>
            )}
          </div>

          {studentStats && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              {studentStats.shortageAlert && (
                <div className="p-5 bg-rose-50 border-2 border-rose-400 rounded-2xl flex items-start gap-4">
                  <ShieldAlert className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-bold text-rose-900">
                      CRITICAL ATTENDANCE SHORTAGE ALERT (BELOW 75%)
                    </h3>
                    <p className="text-sm text-rose-800 mt-1">
                      Student attendance is currently at <span className="font-extrabold">{studentStats.attendancePercentage}%</span>. 
                      Regulations mandate at least 75% attendance for examination hall ticket eligibility. 
                      Parents must be formally notified and a condonation request is required.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase">Total Sessions Held</div>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2">{studentStats.totalSessions}</div>
                </div>

                <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                  <div className="text-xs font-bold text-emerald-700 uppercase">Sessions Attended</div>
                  <div className="text-3xl font-extrabold text-emerald-800 mt-2">{studentStats.presentSessions}</div>
                </div>

                <div className="p-5 bg-rose-50 rounded-xl border border-rose-200 text-center">
                  <div className="text-xs font-bold text-rose-700 uppercase">Sessions Absent</div>
                  <div className="text-3xl font-extrabold text-rose-800 mt-2">{studentStats.absentSessions}</div>
                </div>

                <div className={`p-5 rounded-xl border text-center ${
                  studentStats.shortageAlert 
                    ? 'bg-rose-100 border-rose-300' 
                    : 'bg-brand-50 border-brand-200'
                }`}>
                  <div className="text-xs font-bold text-slate-600 uppercase">Overall Attendance %</div>
                  <div className={`text-3xl font-extrabold mt-2 ${
                    studentStats.shortageAlert ? 'text-rose-700' : 'text-brand-700'
                  }`}>
                    {studentStats.attendancePercentage}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
