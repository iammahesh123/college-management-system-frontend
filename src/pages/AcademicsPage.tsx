import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { Department, Program, SchoolClass, Section, Subject } from '../types/domain';
import { BookOpen, School, Layers, CheckCircle2 } from 'lucide-react';

export const AcademicsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'college' | 'school' | 'subjects'>('college');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const [deptRes, progRes, classRes, secRes, subjRes] = await Promise.all([
          apiClient.get('/academics/departments'),
          apiClient.get('/academics/programs'),
          apiClient.get('/academics/classes'),
          apiClient.get('/academics/sections'),
          apiClient.get('/academics/subjects'),
        ]);
        setDepartments(deptRes.data.data);
        setPrograms(progRes.data.data);
        setClasses(classRes.data.data);
        setSections(secRes.data.data);
        setSubjects(subjRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademicData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Academic Structure</h1>
          <p className="text-xs text-slate-500 font-medium">
            Unified multi-model engine supporting School (K-12) & Higher Education (Colleges & Universities)
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('college')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'college' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            College / University
          </button>
          <button
            onClick={() => setActiveTab('school')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'school' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            School (K-12)
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'subjects' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Course Catalog
          </button>
        </div>
      </div>

      {/* College View */}
      {activeTab === 'college' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Departments */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600" />
              Academic Departments
            </h3>
            <div className="space-y-3">
              {departments.map((d) => (
                <div key={d.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{d.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Code: {d.code}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Degrees & Programs
            </h3>
            <div className="space-y-3">
              {programs.map((p) => (
                <div key={p.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{p.name} ({p.shortName || p.code})</span>
                    <span className="text-[10px] text-slate-400">Duration: {p.totalSemestersOrYears} Semesters • {p.level}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono">{p.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* School View */}
      {activeTab === 'school' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <School className="w-4 h-4 text-brand-600" />
            School Classes & Sections
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {classes.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                  <span className="text-[10px] font-bold bg-brand-100 text-brand-800 px-2 py-0.5 rounded-full">Grade {c.gradeLevel}</span>
                </div>
                <p className="text-xs text-slate-500">Configured Capacity: {c.capacity} students</p>
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sections: Section A, Section B</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course Catalog */}
      {activeTab === 'subjects' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Subject Code</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Max Marks</th>
                  <th className="py-3 px-4">Pass Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-brand-700">{s.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {s.subjectType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{s.credits} Credits</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{s.maxMarks}</td>
                    <td className="py-3 px-4 text-slate-600">{s.passMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
