import React from 'react';
import { Payment } from '../../types/domain';
import { Printer, CheckCircle2 } from 'lucide-react';

interface PrintableFeeReceiptProps {
  payment: Payment;
}

export const PrintableFeeReceipt: React.FC<PrintableFeeReceiptProps> = ({ payment }) => {
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
          Print Receipt
        </button>
      </div>

      <div id="printable-area" className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-800">
        {/* Receipt Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide text-slate-900">Apex Global Educational Trust</h1>
            <p className="text-xs text-slate-500">Finance & Fee Operations Department</p>
            <p className="text-xs text-slate-500">Tel: +91 98765 00000 | accounts@apex.edu</p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> PAID
            </span>
            <p className="text-sm font-bold text-slate-900 mt-2">Receipt #{payment.receiptNumber}</p>
            <p className="text-xs text-slate-500">{new Date(payment.paymentDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-sm">
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold block">Received From</span>
            <span className="font-bold text-slate-900 text-base">
              {payment.student.firstName} {payment.student.lastName}
            </span>
            <p className="text-xs text-slate-500">Admission No: {payment.student.admissionNumber}</p>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-bold block">Payment Method</span>
            <span className="font-bold text-slate-900">{payment.paymentMethod}</span>
            <p className="text-xs text-slate-500">Reference: {payment.paymentReference}</p>
          </div>
        </div>

        {/* Ledger Details */}
        <table className="w-full border-collapse text-sm mb-6">
          <thead>
            <tr className="border-b-2 border-slate-200 text-slate-600">
              <th className="py-2 text-left">Description</th>
              <th className="py-2 text-right">Amount (INR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="py-3 text-slate-800 font-medium">Academic Tuition & Institutional Fees</td>
              <td className="py-3 text-right font-bold text-slate-900">₹{payment.amount.toLocaleString()}</td>
            </tr>
            {payment.remarks && (
              <tr>
                <td colSpan={2} className="py-2 text-xs text-slate-500 italic">
                  Note: {payment.remarks}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-900 text-base">
              <th className="py-3 text-left font-bold text-slate-900">Total Paid</th>
              <th className="py-3 text-right font-bold text-slate-900">₹{payment.amount.toLocaleString()}</th>
            </tr>
          </tfoot>
        </table>

        {/* Footer */}
        <div className="flex justify-between items-end pt-8 text-xs text-slate-500">
          <div>
            <p>This is a computer generated official fee payment receipt.</p>
            <p className="font-mono text-[10px] text-slate-400">TXN-ID: {payment.paymentReference}</p>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-300 w-36 mb-1"></div>
            <span>Authorized Cashier / Accountant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
