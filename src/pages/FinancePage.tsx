import React, { useState, useEffect } from 'react';
import { 
  CircleDollarSign, 
  Search, 
  CreditCard, 
  Receipt, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  User, 
  ArrowUpRight, 
  FileSpreadsheet, 
  Printer, 
  Building
} from 'lucide-react';
import api from '../api/client';
import { StudentFeeAccount, Payment, Student } from '../types/domain';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/StatusBadge';
import { PrintableFeeReceipt } from '../components/common/PrintableFeeReceipt';

export const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LEDGER' | 'PAYMENTS'>('LEDGER');

  // Student Ledger Search
  const [studentSearchId, setStudentSearchId] = useState<string>('1');
  const [feeAccount, setFeeAccount] = useState<StudentFeeAccount | null>(null);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [ledgerError, setLedgerError] = useState<string | null>(null);

  // Payments List
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Collect Payment Modal
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payForm, setPayForm] = useState({
    amount: '',
    paymentMethod: 'UPI',
    remarks: 'Fee payment via portal'
  });
  const [processingPay, setProcessingPay] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Printable Receipt Modal
  const [activeReceiptPayment, setActiveReceiptPayment] = useState<Payment | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const fetchStudentLedger = async (studentId: string) => {
    if (!studentId) return;
    setLoadingLedger(true);
    setLedgerError(null);
    try {
      const res = await api.get(`/fees/students/${studentId}`);
      if (res.data?.success) {
        setFeeAccount(res.data.data);
        setPayForm(prev => ({
          ...prev,
          amount: String(res.data.data.outstandingBalance || '')
        }));
      }
    } catch (err: any) {
      setFeeAccount(null);
      setLedgerError(err.response?.data?.message || 'Fee account not found for this student.');
    } finally {
      setLoadingLedger(false);
    }
  };

  const fetchAllPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await api.get('/fees/payments');
      if (res.data?.success) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    fetchStudentLedger('1');
    fetchAllPayments();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudentLedger(studentSearchId);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeAccount) return;
    setProcessingPay(true);
    setPayError(null);

    try {
      const params = new URLSearchParams();
      params.append('accountId', String(feeAccount.id));
      params.append('amount', payForm.amount);
      params.append('paymentMethod', payForm.paymentMethod);
      if (payForm.remarks) params.append('remarks', payForm.remarks);

      const res = await api.post(`/fees/payments?${params.toString()}`);
      if (res.data?.success) {
        const recordedPayment: Payment = res.data.data;
        setIsPayModalOpen(false);
        // Refresh ledger & payment list
        fetchStudentLedger(String(feeAccount.student.id));
        fetchAllPayments();
        // Show printable receipt immediately
        setActiveReceiptPayment(recordedPayment);
        setIsReceiptModalOpen(true);
      }
    } catch (err: any) {
      setPayError(err.response?.data?.message || 'Failed to process payment.');
    } finally {
      setProcessingPay(false);
    }
  };

  const handleViewReceipt = (payment: Payment) => {
    setActiveReceiptPayment(payment);
    setIsReceiptModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CircleDollarSign className="w-7 h-7 text-emerald-600" />
            Fee Management & Financial Ledgers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Student fee accounts, installment tracking, payment receipts, and reconciliation.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'LEDGER'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Fee Ledger
          </button>
          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'PAYMENTS'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Receipts & Transactions ({payments.length})
          </button>
        </div>
      </div>

      {activeTab === 'LEDGER' ? (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter Student ID (e.g. 1, 2, 3...)"
                  value={studentSearchId}
                  onChange={e => setStudentSearchId(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={loadingLedger}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50"
              >
                {loadingLedger ? 'Loading Ledger...' : 'Find Fee Ledger'}
              </button>
            </form>

            {ledgerError && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {ledgerError}
              </div>
            )}
          </div>

          {/* Ledger Details */}
          {feeAccount && (
            <div className="space-y-6">
              {/* Account Summary Banner */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {feeAccount.student.rollNumber || feeAccount.student.admissionNumber}
                    </span>
                    <StatusBadge status={feeAccount.accountStatus} />
                    <span className="text-xs font-semibold text-slate-500">
                      {feeAccount.academicYear?.name || 'Academic Year 2026-2027'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    {feeAccount.student.firstName} {feeAccount.student.lastName}
                  </h2>
                  <div className="text-xs text-slate-500 mt-1">
                    Admission #: <span className="font-mono">{feeAccount.student.admissionNumber}</span> | Category: {feeAccount.student.category}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {feeAccount.outstandingBalance > 0 && (
                    <button
                      onClick={() => setIsPayModalOpen(true)}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      Collect Fee Payment
                    </button>
                  )}
                </div>
              </div>

              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Gross Fee</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">
                    ${Number(feeAccount.totalFeeAmount).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-emerald-600 uppercase">Scholarship</div>
                  <div className="text-xl font-extrabold text-emerald-700 mt-1">
                    -${Number(feeAccount.scholarshipAmount).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-amber-600 uppercase">Penalty Fines</div>
                  <div className="text-xl font-extrabold text-amber-700 mt-1">
                    +${Number(feeAccount.penaltyAmount).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-bold text-slate-600 uppercase">Net Payable</div>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">
                    ${Number(feeAccount.netPayableAmount).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-2xs">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase">Total Paid</div>
                  <div className="text-xl font-extrabold text-emerald-800 mt-1">
                    ${Number(feeAccount.paidAmount).toLocaleString()}
                  </div>
                </div>

                <div className={`p-4 rounded-xl border shadow-2xs ${
                  feeAccount.outstandingBalance > 0
                    ? 'bg-rose-50 border-rose-300'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="text-[11px] font-bold text-rose-700 uppercase">Balance Due</div>
                  <div className={`text-xl font-extrabold mt-1 ${
                    feeAccount.outstandingBalance > 0 ? 'text-rose-800' : 'text-slate-900'
                  }`}>
                    ${Number(feeAccount.outstandingBalance).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Installment Breakdown */}
              {feeAccount.installments && feeAccount.installments.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900">Term-wise Installment Schedule</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                          <th className="p-4">#</th>
                          <th className="p-4">Installment Title</th>
                          <th className="p-4">Due Date</th>
                          <th className="p-4 text-right">Amount</th>
                          <th className="p-4 text-right">Paid</th>
                          <th className="p-4 text-right">Penalty</th>
                          <th className="p-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {feeAccount.installments.map(inst => (
                          <tr key={inst.id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-mono font-bold text-slate-400">{inst.installmentNumber}</td>
                            <td className="p-4 font-bold text-slate-900">{inst.title}</td>
                            <td className="p-4 text-slate-600 font-mono text-xs">{inst.dueDate}</td>
                            <td className="p-4 text-right font-bold text-slate-900">${inst.amount}</td>
                            <td className="p-4 text-right font-bold text-emerald-700">${inst.paidAmount}</td>
                            <td className="p-4 text-right font-bold text-rose-700">${inst.penaltyAmount}</td>
                            <td className="p-4 text-center">
                              <StatusBadge status={inst.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Payments & Receipts History */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Official Fee Receipt Logs</h2>
              <p className="text-xs text-slate-500">Chronological transaction register of all recorded fee collections.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="p-4">Receipt Number</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Student</th>
                  <th className="p-4 text-right">Amount Paid</th>
                  <th className="p-4 text-center">Method</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map(pm => (
                  <tr key={pm.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono font-bold text-brand-700">{pm.receiptNumber}</td>
                    <td className="p-4 font-mono text-xs text-slate-500">{pm.paymentDate}</td>
                    <td className="p-4 font-semibold text-slate-900">
                      {pm.student ? `${pm.student.firstName} ${pm.student.lastName}` : 'Student'}
                    </td>
                    <td className="p-4 text-right font-extrabold text-emerald-700">
                      ${Number(pm.amount).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {pm.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <StatusBadge status={pm.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleViewReceipt(pm)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-brand-300 text-brand-700 text-xs font-bold rounded-lg shadow-2xs transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Collect Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Record Fee Payment & Issue Receipt"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          {payError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              {payError}
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500">Paying for:</div>
            <div className="text-base font-bold text-slate-900">
              {feeAccount?.student.firstName} {feeAccount?.student.lastName} ({feeAccount?.student.admissionNumber})
            </div>
            <div className="text-xs text-rose-700 font-bold mt-1">
              Outstanding Balance: ${feeAccount?.outstandingBalance}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Amount to Pay ($) *</label>
            <input
              type="number"
              step="0.01"
              required
              value={payForm.amount}
              onChange={e => setPayForm({ ...payForm, amount: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method *</label>
            <select
              value={payForm.paymentMethod}
              onChange={e => setPayForm({ ...payForm, paymentMethod: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-medium"
            >
              <option value="UPI">UPI / Instant Transfer</option>
              <option value="CASH">Cash Deposit</option>
              <option value="CARD">Credit / Debit Card</option>
              <option value="NET_BANKING">Net Banking / NEFT</option>
              <option value="CHEQUE">Bank Cheque / Demand Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Payment Remarks / Reference</label>
            <input
              type="text"
              value={payForm.remarks}
              onChange={e => setPayForm({ ...payForm, remarks: e.target.value })}
              placeholder="e.g. Cheque #459201 or Transaction ID"
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPayModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processingPay}
              className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-50"
            >
              {processingPay ? 'Issuing Official Receipt...' : 'Confirm Payment & Generate Receipt'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Official Printable Fee Receipt Modal */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Official Fee Payment Receipt"
        maxWidth="2xl"
      >
        {activeReceiptPayment && (
          <PrintableFeeReceipt payment={activeReceiptPayment} />
        )}
      </Modal>
    </div>
  );
};
