import React from 'react';
import { ReportCardDto } from '../../types/domain';
import { Printer } from 'lucide-react';

interface PrintableReportCardProps {
  data: ReportCardDto;
}

export const PrintableReportCard: React.FC<PrintableReportCardProps> = ({ data }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      <div id="printable-area" className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-800">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">Apex Global Education</h1>
          <p className="text-sm text-slate-500 font-medium">Autonomous Institution | Hyderabad, India</p>
          <div className="inline-block bg-slate-900 text-white text-xs font-bold uppercase px-4 py-1 rounded-full mt-3 tracking-widest">
            Official Academic Grade Memo
          </div>
        </div>

        {/* Student Meta Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-sm">
          <div>
            <span className="text-xs text-slate-500 block uppercase font-bold">Student Name</span>
            <span className="font-semibold text-slate-900">{data.studentName}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block uppercase font-bold">Admission No</span>
            <span className="font-semibold text-slate-900">{data.admissionNumber}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block uppercase font-bold">Roll Number</span>
            <span className="font-semibold text-slate-900">{data.rollNumber || 'N/A'}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block uppercase font-bold">Academic Year</span>
            <span className="font-semibold text-slate-900">{data.academicYear}</span>
          </div>
        </div>

        {/* Marks Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="py-3 px-4 text-left font-bold">Code</th>
                <th className="py-3 px-4 text-left font-bold">Subject Name</th>
                <th className="py-3 px-3 text-center font-bold">Max</th>
                <th className="py-3 px-3 text-center font-bold">Pass</th>
                <th className="py-3 px-3 text-center font-bold">Internal</th>
                <th className="py-3 px-3 text-center font-bold">External</th>
                <th className="py-3 px-3 text-center font-bold">Total</th>
                <th className="py-3 px-3 text-center font-bold">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.subjectMarks.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 font-mono font-semibold text-slate-600">{s.subjectCode}</td>
                  <td className="py-2.5 px-4 font-medium text-slate-900">{s.subjectName}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">{s.maxMarks}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">{s.passMarks}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">{s.internalMarks}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">{s.externalMarks}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-900">{s.totalMarks}</td>
                  <td className="py-2.5 px-3 text-center font-bold">
                    <span className={s.grade === 'F' ? 'text-rose-600' : 'text-emerald-700'}>
                      {s.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900 text-white mb-8">
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">Total Obtained</span>
            <span className="text-lg font-bold">{data.totalObtainedMarks} / {data.totalMaxMarks}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">Percentage</span>
            <span className="text-lg font-bold">{data.percentage}%</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">GPA / SGPA</span>
            <span className="text-lg font-bold">{data.gpa}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold">Final Status</span>
            <span className={`text-lg font-bold ${data.overallResult === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {data.overallResult}
            </span>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end pt-12 text-center text-xs text-slate-500">
          <div>
            <div className="border-t border-slate-300 w-40 mb-1"></div>
            <span>Prepared by</span>
          </div>
          <div>
            <div className="border-t border-slate-300 w-40 mb-1"></div>
            <span>Controller of Examinations</span>
          </div>
          <div>
            <div className="border-t border-slate-300 w-40 mb-1"></div>
            <span>Principal / Dean</span>
          </div>
        </div>
      </div>
    </div>
  );
};
