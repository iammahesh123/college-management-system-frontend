import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  Printer, 
  Check, 
  BookOpen, 
  Users,
  Search
} from 'lucide-react';
import api from '../api/client';
import { Exam, ExamSchedule, AcademicYear, Subject, Student, ReportCardDto } from '../types/domain';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/StatusBadge';
import { PrintableReportCard } from '../components/common/PrintableReportCard';

export const ExaminationsPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs within an exam
  const [examTab, setExamTab] = useState<'SCHEDULE' | 'MARKS_ENTRY' | 'RESULTS'>('SCHEDULE');

  // New Exam Modal
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [examForm, setExamForm] = useState({
    code: '',
    name: '',
    examType: 'MID_TERM',
    startDate: '',
    endDate: '',
    academicYearId: ''
  });

  // New Schedule Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    subjectId: '',
    examDate: '',
    startTime: '10:00:00',
    endTime: '13:00:00',
    maxMarks: '100',
    minPassMarks: '40'
  });

  // Marks Entry State
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [marksData, setMarksData] = useState<{
    [studentId: number]: {
      internal: string;
      external: string;
      practical: string;
      isAbsent: boolean;
    };
  }>({});
  const [savingMarks, setSavingMarks] = useState(false);
  const [marksMessage, setMarksMessage] = useState<string | null>(null);

  // Report Card Modal State
  const [reportCardData, setReportCardData] = useState<ReportCardDto | null>(null);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [loadingReportCard, setLoadingReportCard] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const [examsRes, yearsRes, subsRes, studentsRes] = await Promise.all([
        api.get('/exams'),
        api.get('/academics/academic-years'),
        api.get('/academics/subjects'),
        api.get('/students?size=50')
      ]);

      if (examsRes.data?.success) {
        const list: Exam[] = examsRes.data.data;
        setExams(list);
        if (list.length > 0 && !selectedExam) {
          setSelectedExam(list[0]);
        }
      }
      if (yearsRes.data?.success) setAcademicYears(yearsRes.data.data);
      if (subsRes.data?.success) setSubjects(subsRes.data.data);
      if (studentsRes.data?.success) setStudents(studentsRes.data.data.content);
    } catch (err) {
      console.error('Failed to load exam data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchSchedules = async (examId: number) => {
    try {
      const res = await api.get(`/exams/${examId}/schedules`);
      if (res.data?.success) {
        setSchedules(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedScheduleId(String(res.data.data[0].id));
        }
      }
    } catch (err) {
      console.error('Failed to fetch schedules', err);
    }
  };

  useEffect(() => {
    if (selectedExam) {
      fetchSchedules(selectedExam.id);
    }
  }, [selectedExam]);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        code: examForm.code,
        name: examForm.name,
        examType: examForm.examType,
        startDate: examForm.startDate,
        endDate: examForm.endDate,
        academicYear: { id: Number(examForm.academicYearId) }
      };

      const res = await api.post('/exams', payload);
      if (res.data?.success) {
        setIsExamModalOpen(false);
        fetchExams();
      }
    } catch (err) {
      console.error('Failed to create exam', err);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;
    try {
      const payload = {
        examDate: scheduleForm.examDate,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
        maxMarks: Number(scheduleForm.maxMarks),
        minPassMarks: Number(scheduleForm.minPassMarks),
        subject: { id: Number(scheduleForm.subjectId) }
      };

      const res = await api.post(`/exams/${selectedExam.id}/schedules`, payload);
      if (res.data?.success) {
        setIsScheduleModalOpen(false);
        fetchSchedules(selectedExam.id);
      }
    } catch (err) {
      console.error('Failed to create schedule', err);
    }
  };

  const handleSaveMarksForStudent = async (studentId: number) => {
    if (!selectedScheduleId) return;
    const entry = marksData[studentId] || { internal: '0', external: '0', practical: '0', isAbsent: false };
    
    try {
      const params = new URLSearchParams();
      params.append('studentId', String(studentId));
      if (entry.internal) params.append('internal', entry.internal);
      if (entry.external) params.append('external', entry.external);
      if (entry.practical) params.append('practical', entry.practical);
      params.append('isAbsent', String(entry.isAbsent));

      await api.post(`/exams/schedules/${selectedScheduleId}/marks?${params.toString()}`);
      setMarksMessage(`Marks saved for student #${studentId}`);
      setTimeout(() => setMarksMessage(null), 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save marks.');
    }
  };

  const handlePublishResults = async () => {
    if (!selectedExam) return;
    if (!confirm(`Are you sure you want to officially publish results for ${selectedExam.name}?`)) return;
    try {
      const res = await api.post(`/exams/${selectedExam.id}/publish`);
      if (res.data?.success) {
        alert('Results successfully published campus-wide!');
        fetchExams();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to publish results');
    }
  };

  const handleViewReportCard = async (studentId: number) => {
    if (!selectedExam) return;
    setLoadingReportCard(true);
    try {
      const res = await api.get(`/exams/${selectedExam.id}/report-card/${studentId}`);
      if (res.data?.success) {
        setReportCardData(res.data.data);
        setIsReportCardOpen(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Report card not available. Marks may need calculation.');
    } finally {
      setLoadingReportCard(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Award className="w-7 h-7 text-brand-600" />
            Examinations & Results Processing
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Exam schedules, marks entry with validation against max marks, consolidated GPA calculation, and report cards.
          </p>
        </div>
        <button
          onClick={() => setIsExamModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Examination
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col: Exams List */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
            Active Examinations ({exams.length})
          </h2>

          <div className="space-y-2">
            {exams.map(exam => {
              const isSelected = selectedExam?.id === exam.id;
              return (
                <div
                  key={exam.id}
                  onClick={() => setSelectedExam(exam)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50/80 border-brand-300 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-700">{exam.code}</span>
                    <StatusBadge status={exam.status} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{exam.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.startDate} to {exam.endDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected Exam Details & Tabs */}
        <div className="lg:col-span-3 space-y-6">
          {selectedExam ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              {/* Exam Banner */}
              <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gradient-to-r from-slate-50 to-white">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-100 text-brand-800 rounded-md">
                      {selectedExam.code}
                    </span>
                    <StatusBadge status={selectedExam.status} />
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      {selectedExam.examType.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedExam.name}</h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePublishResults}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Publish Results
                  </button>
                </div>
              </div>

              {/* Sub Tabs */}
              <div className="flex border-b border-slate-200 px-6">
                <button
                  onClick={() => setExamTab('SCHEDULE')}
                  className={`py-3 px-4 font-bold text-sm border-b-2 transition-all ${
                    examTab === 'SCHEDULE'
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Schedules ({schedules.length})
                </button>
                <button
                  onClick={() => setExamTab('MARKS_ENTRY')}
                  className={`py-3 px-4 font-bold text-sm border-b-2 transition-all ${
                    examTab === 'MARKS_ENTRY'
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Marks Entry Sheet
                </button>
                <button
                  onClick={() => setExamTab('RESULTS')}
                  className={`py-3 px-4 font-bold text-sm border-b-2 transition-all ${
                    examTab === 'RESULTS'
                      ? 'border-brand-600 text-brand-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Report Cards & Transcripts
                </button>
              </div>

              {/* Tab 1: Schedules */}
              {examTab === 'SCHEDULE' && (
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800">Subject Timetable & Passing Marks</h3>
                    <button
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-700 font-bold text-xs rounded-lg hover:bg-brand-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Subject Schedule
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                          <th className="p-3.5">Subject</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Timing</th>
                          <th className="p-3.5 text-center">Max Marks</th>
                          <th className="p-3.5 text-center">Min Pass Marks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {schedules.map(sch => (
                          <tr key={sch.id} className="hover:bg-slate-50/50">
                            <td className="p-3.5 font-bold text-slate-900">
                              [{sch.subject.code}] {sch.subject.name}
                            </td>
                            <td className="p-3.5 text-slate-600 font-mono text-xs">{sch.examDate}</td>
                            <td className="p-3.5 text-slate-600 font-mono text-xs">
                              {sch.startTime} - {sch.endTime}
                            </td>
                            <td className="p-3.5 text-center font-bold text-brand-700">{sch.maxMarks}</td>
                            <td className="p-3.5 text-center font-bold text-emerald-700">{sch.minPassMarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Marks Entry */}
              {examTab === 'MARKS_ENTRY' && (
                <div className="p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <label className="text-xs font-bold text-slate-700 shrink-0">Select Subject Exam:</label>
                      <select
                        value={selectedScheduleId}
                        onChange={e => setSelectedScheduleId(e.target.value)}
                        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 font-medium"
                      >
                        {schedules.map(sch => (
                          <option key={sch.id} value={sch.id}>
                            [{sch.subject.code}] {sch.subject.name} (Max: {sch.maxMarks})
                          </option>
                        ))}
                      </select>
                    </div>

                    {marksMessage && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        {marksMessage}
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                          <th className="p-3.5">Roll No</th>
                          <th className="p-3.5">Student</th>
                          <th className="p-3.5 text-center">Internal</th>
                          <th className="p-3.5 text-center">External</th>
                          <th className="p-3.5 text-center">Practical</th>
                          <th className="p-3.5 text-center">Absent?</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {students.map(st => {
                          const curr = marksData[st.id] || { internal: '', external: '', practical: '', isAbsent: false };
                          return (
                            <tr key={st.id} className="hover:bg-slate-50/50">
                              <td className="p-3.5 font-mono font-bold text-slate-700">{st.rollNumber || 'N/A'}</td>
                              <td className="p-3.5 font-semibold text-slate-900">
                                {st.firstName} {st.lastName}
                              </td>
                              <td className="p-3.5 text-center">
                                <input
                                  type="number"
                                  placeholder="0"
                                  disabled={curr.isAbsent}
                                  value={curr.internal}
                                  onChange={e => {
                                    setMarksData({
                                      ...marksData,
                                      [st.id]: { ...curr, internal: e.target.value }
                                    });
                                  }}
                                  className="w-16 text-center font-mono text-sm border border-slate-200 rounded-lg p-1.5 bg-slate-50 disabled:opacity-30"
                                />
                              </td>
                              <td className="p-3.5 text-center">
                                <input
                                  type="number"
                                  placeholder="0"
                                  disabled={curr.isAbsent}
                                  value={curr.external}
                                  onChange={e => {
                                    setMarksData({
                                      ...marksData,
                                      [st.id]: { ...curr, external: e.target.value }
                                    });
                                  }}
                                  className="w-16 text-center font-mono text-sm border border-slate-200 rounded-lg p-1.5 bg-slate-50 disabled:opacity-30"
                                />
                              </td>
                              <td className="p-3.5 text-center">
                                <input
                                  type="number"
                                  placeholder="0"
                                  disabled={curr.isAbsent}
                                  value={curr.practical}
                                  onChange={e => {
                                    setMarksData({
                                      ...marksData,
                                      [st.id]: { ...curr, practical: e.target.value }
                                    });
                                  }}
                                  className="w-16 text-center font-mono text-sm border border-slate-200 rounded-lg p-1.5 bg-slate-50 disabled:opacity-30"
                                />
                              </td>
                              <td className="p-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={curr.isAbsent}
                                  onChange={e => {
                                    setMarksData({
                                      ...marksData,
                                      [st.id]: { ...curr, isAbsent: e.target.checked }
                                    });
                                  }}
                                  className="w-4 h-4 text-rose-600 rounded-sm focus:ring-rose-500"
                                />
                              </td>
                              <td className="p-3.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleSaveMarksForStudent(st.id)}
                                  className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition-colors"
                                >
                                  Save
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Report Cards */}
              {examTab === 'RESULTS' && (
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Consolidated Student Grade Sheets</h3>
                      <p className="text-xs text-slate-500">
                        View official institution report card with subject-wise breakdown, GPA, percentage, and print formatting.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.slice(0, 15).map(st => (
                      <div key={st.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-mono font-bold text-brand-700">{st.rollNumber || st.admissionNumber}</div>
                          <div className="text-sm font-bold text-slate-900 mt-0.5">{st.firstName} {st.lastName}</div>
                          <div className="text-[11px] text-slate-500">{st.category || 'Regular Student'}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleViewReportCard(st.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-brand-300 text-brand-700 text-xs font-bold rounded-lg shadow-2xs transition-all"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Report Card
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              Select an examination from the left panel
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Exam */}
      <Modal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        title="Create New Examination Term"
      >
        <form onSubmit={handleCreateExam} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Exam Code *</label>
            <input
              type="text"
              required
              placeholder="e.g., EXAM-2026-SEM1"
              value={examForm.code}
              onChange={e => setExamForm({ ...examForm, code: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Exam Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., Autumn 2026 Mid-Semester Examination"
              value={examForm.name}
              onChange={e => setExamForm({ ...examForm, name: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Exam Type *</label>
              <select
                value={examForm.examType}
                onChange={e => setExamForm({ ...examForm, examType: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              >
                <option value="MID_TERM">Mid Term Exam</option>
                <option value="END_SEMESTER">End Semester Final</option>
                <option value="UNIT_TEST">Unit Test</option>
                <option value="ANNUAL">Annual Board Exam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year *</label>
              <select
                required
                value={examForm.academicYearId}
                onChange={e => setExamForm({ ...examForm, academicYearId: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              >
                <option value="">-- Select Year --</option>
                {academicYears.map(y => (
                  <option key={y.id} value={y.id}>{y.name} ({y.code})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={examForm.startDate}
                onChange={e => setExamForm({ ...examForm, startDate: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={examForm.endDate}
                onChange={e => setExamForm({ ...examForm, endDate: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsExamModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
            >
              Save Examination
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Schedule */}
      <Modal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        title="Add Subject Exam Schedule"
      >
        <form onSubmit={handleCreateSchedule} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
            <select
              required
              value={scheduleForm.subjectId}
              onChange={e => setScheduleForm({ ...scheduleForm, subjectId: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
            >
              <option value="">-- Choose Subject --</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>[{s.code}] {s.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
              <input
                type="date"
                required
                value={scheduleForm.examDate}
                onChange={e => setScheduleForm({ ...scheduleForm, examDate: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="text"
                value={scheduleForm.startTime}
                onChange={e => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
              <input
                type="text"
                value={scheduleForm.endTime}
                onChange={e => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Maximum Marks *</label>
              <input
                type="number"
                required
                value={scheduleForm.maxMarks}
                onChange={e => setScheduleForm({ ...scheduleForm, maxMarks: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Minimum Pass Marks *</label>
              <input
                type="number"
                required
                value={scheduleForm.minPassMarks}
                onChange={e => setScheduleForm({ ...scheduleForm, minPassMarks: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
            >
              Add Schedule Entry
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Report Card Modal */}
      <Modal
        isOpen={isReportCardOpen}
        onClose={() => setIsReportCardOpen(false)}
        title="Official Academic Report Card"
        maxWidth="4xl"
      >
        {reportCardData && (
          <PrintableReportCard data={reportCardData} />
        )}
      </Modal>
    </div>
  );
};
