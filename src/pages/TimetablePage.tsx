import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  AlertTriangle, 
  Filter, 
  CheckCircle2, 
  Trash2,
  BookOpen
} from 'lucide-react';
import api from '../api/client';
import { TimetableEntry, Classroom, Section, Subject, Faculty } from '../types/domain';
import { Modal } from '../components/common/Modal';

export const TimetablePage: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  
  const [selectedSectionId, setSelectedSectionId] = useState<number | 'ALL'>('ALL');
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collisionError, setCollisionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: 'MONDAY',
    startTime: '09:00:00',
    endTime: '10:00:00',
    sessionType: 'THEORY',
    sectionId: '',
    subjectId: '',
    facultyId: '',
    classroomId: ''
  });

  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const timeSlots = [
    { start: '09:00', end: '10:00', label: 'Period 1 (09:00 - 10:00)' },
    { start: '10:00', end: '11:00', label: 'Period 2 (10:00 - 11:00)' },
    { start: '11:00', end: '12:00', label: 'Period 3 (11:00 - 12:00)' },
    { start: '12:00', end: '13:00', label: 'Period 4 (12:00 - 13:00)' },
    { start: '13:00', end: '14:00', label: 'Lunch Break (13:00 - 14:00)', isBreak: true },
    { start: '14:00', end: '15:00', label: 'Period 5 (14:00 - 15:00)' },
    { start: '15:00', end: '16:00', label: 'Period 6 (15:00 - 16:00)' },
  ];

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [entriesRes, roomsRes, subjectsRes, facultyRes, sectionsRes] = await Promise.all([
        api.get('/timetable'),
        api.get('/timetable/classrooms'),
        api.get('/academics/subjects'),
        api.get('/faculty'),
        api.get('/academics/sections')
      ]);

      if (entriesRes.data?.success) setEntries(entriesRes.data.data);
      if (roomsRes.data?.success) setClassrooms(roomsRes.data.data);
      if (subjectsRes.data?.success) setSubjects(subjectsRes.data.data);
      if (facultyRes.data?.success) setFacultyList(facultyRes.data.data);
      if (sectionsRes.data?.success) {
        setSections(sectionsRes.data.data);
        if (sectionsRes.data.data.length > 0 && selectedSectionId === 'ALL') {
          // Keep ALL as default to view institution schedule
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load timetable and reference data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setCollisionError(null);
    setSaving(true);

    try {
      const payload = {
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        sessionType: formData.sessionType,
        section: { id: Number(formData.sectionId) },
        subject: { id: Number(formData.subjectId) },
        faculty: { id: Number(formData.facultyId) },
        classroom: { id: Number(formData.classroomId) }
      };

      const res = await api.post('/timetable', payload);
      if (res.data?.success) {
        setIsModalOpen(false);
        setFormData({
          dayOfWeek: 'MONDAY',
          startTime: '09:00:00',
          endTime: '10:00:00',
          sessionType: 'THEORY',
          sectionId: '',
          subjectId: '',
          facultyId: '',
          classroomId: ''
        });
        fetchInitialData();
      }
    } catch (err: any) {
      // Collision error returned from backend
      const message = err.response?.data?.message || 'Conflict detected in schedule allocation.';
      setCollisionError(message);
    } finally {
      setSaving(false);
    }
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSection = selectedSectionId === 'ALL' || entry.section?.id === Number(selectedSectionId);
    const matchesDay = selectedDay === 'ALL' || entry.dayOfWeek === selectedDay;
    return matchesSection && matchesDay;
  });

  const getSlotEntry = (day: string, startTime: string) => {
    return filteredEntries.find(e => {
      const eDay = e.dayOfWeek?.toUpperCase();
      const eStart = e.startTime?.substring(0, 5);
      return eDay === day && eStart === startTime;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-brand-600" />
            Class Timetable & Scheduling
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Weekly period grid with real-time room, faculty, and section collision detection.
          </p>
        </div>
        <button
          onClick={() => {
            setCollisionError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Slot
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          Filter By:
        </div>

        <div className="flex-1 min-w-[200px] max-w-xs">
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="w-full text-sm font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Sections (Entire Institution)</option>
            {sections.map(sec => (
              <option key={sec.id} value={sec.id}>
                Section {sec.name} {sec.schoolClass ? `(Class ${sec.schoolClass.name})` : sec.program ? `(${sec.program.shortName || sec.program.code} Sem ${sec.semester?.semesterNumber || ''})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-[150px]">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full text-sm font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          >
            <option value="ALL">All Weekdays (Mon - Sat)</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredEntries.length}</span> scheduled periods
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Timetable Grid */}
      {loading ? (
        <div className="h-96 flex items-center justify-center bg-white rounded-2xl border border-slate-200/80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-32 border-r border-slate-200">
                    Day / Time
                  </th>
                  {timeSlots.map(slot => (
                    <th 
                      key={slot.start} 
                      className={`p-3 text-center text-xs font-bold uppercase tracking-wider min-w-[170px] border-r border-slate-200 ${
                        slot.isBreak ? 'bg-amber-50/60 text-amber-800' : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-900">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {slot.start} - {slot.end}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">{slot.label.split('(')[0]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(selectedDay === 'ALL' ? daysOfWeek : [selectedDay]).map(day => (
                  <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-sm text-slate-800 bg-slate-50/50 border-r border-slate-200 align-top">
                      {day}
                    </td>
                    {timeSlots.map(slot => {
                      if (slot.isBreak) {
                        return (
                          <td key={slot.start} className="p-2 bg-amber-50/30 border-r border-slate-200 text-center text-xs text-amber-700 font-medium">
                            <span className="inline-block py-8">Lunch Break</span>
                          </td>
                        );
                      }

                      const entry = getSlotEntry(day, slot.start);

                      return (
                        <td key={slot.start} className="p-2.5 border-r border-slate-200 align-top">
                          {entry ? (
                            <div className="p-3 bg-brand-50/70 hover:bg-brand-50 border border-brand-200/80 rounded-xl space-y-1.5 shadow-2xs transition-all">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-brand-950 line-clamp-1">
                                  {entry.subject?.name || 'Subject'}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-100 text-brand-700 rounded-md uppercase">
                                  {entry.sessionType || 'THEORY'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                                <User className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{entry.faculty ? `${entry.faculty.firstName} ${entry.faculty.lastName}` : 'Faculty'}</span>
                              </div>
                              <div className="flex items-center justify-between pt-1 border-t border-brand-100 text-[11px] text-slate-500">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {entry.classroom?.roomNumber || 'Room TBA'}
                                </span>
                                <span className="font-semibold text-brand-700 text-[10px]">
                                  Sec {entry.section?.name}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-24 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-[11px] text-slate-400 hover:border-brand-300 hover:text-brand-600 transition-colors cursor-pointer"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  dayOfWeek: day,
                                  startTime: `${slot.start}:00`,
                                  endTime: `${slot.end}:00`
                                }));
                                setCollisionError(null);
                                setIsModalOpen(true);
                              }}
                            >
                              + Free Slot
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Classroom Status Cards */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Classrooms & Lab Capacities
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {classrooms.map(room => (
            <div key={room.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-brand-300 transition-all">
              <div className="text-sm font-bold text-slate-900">{room.roomNumber}</div>
              <div className="text-xs text-slate-500">{room.building || 'Main Campus'}</div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{room.roomType}</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                  Cap: {room.capacity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal to Schedule Slot */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Timetable Slot"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          {collisionError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Collision Conflict Detected!</p>
                <p className="mt-0.5">{collisionError}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Day of Week *</label>
              <select
                required
                value={formData.dayOfWeek}
                onChange={e => setFormData({ ...formData, dayOfWeek: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
              >
                {daysOfWeek.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Session Type *</label>
              <select
                required
                value={formData.sessionType}
                onChange={e => setFormData({ ...formData, sessionType: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
              >
                <option value="THEORY">Theory Lecture</option>
                <option value="PRACTICAL">Lab / Practical</option>
                <option value="TUTORIAL">Tutorial</option>
                <option value="SEMINAR">Seminar</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Time (HH:MM:SS) *</label>
              <input
                type="text"
                required
                placeholder="09:00:00"
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Time (HH:MM:SS) *</label>
              <input
                type="text"
                required
                placeholder="10:00:00"
                value={formData.endTime}
                onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Academic Section *</label>
            <select
              required
              value={formData.sectionId}
              onChange={e => setFormData({ ...formData, sectionId: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
            >
              <option value="">-- Select Section --</option>
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>
                  Section {sec.name} {sec.schoolClass ? `(Class ${sec.schoolClass.name})` : sec.program ? `(${sec.program.shortName || sec.program.code})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Course *</label>
            <select
              required
              value={formData.subjectId}
              onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
            >
              <option value="">-- Select Subject --</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>
                  [{sub.code}] {sub.name} ({sub.subjectType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Member *</label>
              <select
                required
                value={formData.facultyId}
                onChange={e => setFormData({ ...formData, facultyId: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
              >
                <option value="">-- Select Faculty --</option>
                {facultyList.map(fac => (
                  <option key={fac.id} value={fac.id}>
                    {fac.firstName} {fac.lastName} ({fac.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Classroom / Hall *</label>
              <select
                required
                value={formData.classroomId}
                onChange={e => setFormData({ ...formData, classroomId: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-brand-500"
              >
                <option value="">-- Select Room --</option>
                {classrooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.roomNumber} ({room.roomType}, Cap: {room.capacity})
                  </option>
                ))}
              </select>
            </div>
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
              {saving ? 'Validating Collision...' : 'Schedule Period'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
