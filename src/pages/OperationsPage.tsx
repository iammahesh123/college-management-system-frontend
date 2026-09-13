import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  BookOpen, 
  Bus, 
  Building2, 
  CalendarOff, 
  Plus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  User, 
  MapPin, 
  DollarSign 
} from 'lucide-react';
import api from '../api/client';
import { Book, Vehicle, TransportRoute, Hostel, LeaveRequest } from '../types/domain';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/StatusBadge';

export const OperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LIBRARY' | 'TRANSPORT' | 'HOSTEL' | 'LEAVE'>('LIBRARY');

  // Library State
  const [books, setBooks] = useState<Book[]>([]);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    totalCopies: '5',
    shelfLocation: 'Rack A-12'
  });

  // Transport State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({
    registrationNumber: '',
    vehicleType: 'BUS',
    capacity: '40',
    driverName: '',
    driverPhone: ''
  });

  // Hostel State
  const [hostels, setHostels] = useState<Hostel[]>([]);

  // Leave State
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    userType: 'STUDENT',
    leaveType: 'SICK',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [loading, setLoading] = useState(false);

  const fetchTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'LIBRARY') {
        const res = await api.get('/operations/library/books');
        if (res.data?.success) setBooks(res.data.data);
      } else if (activeTab === 'TRANSPORT') {
        const [vRes, rRes] = await Promise.all([
          api.get('/operations/transport/vehicles'),
          api.get('/operations/transport/routes')
        ]);
        if (vRes.data?.success) setVehicles(vRes.data.data);
        if (rRes.data?.success) setRoutes(rRes.data.data);
      } else if (activeTab === 'HOSTEL') {
        const res = await api.get('/operations/hostel/hostels');
        if (res.data?.success) setHostels(res.data.data);
      } else if (activeTab === 'LEAVE') {
        const res = await api.get('/operations/leave');
        if (res.data?.success) setLeaveRequests(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load operational data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData();
  }, [activeTab]);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: bookForm.title,
        author: bookForm.author,
        isbn: bookForm.isbn,
        category: bookForm.category,
        totalCopies: Number(bookForm.totalCopies),
        shelfLocation: bookForm.shelfLocation
      };
      const res = await api.post('/operations/library/books', payload);
      if (res.data?.success) {
        setIsBookModalOpen(false);
        fetchTabData();
      }
    } catch (err) {
      console.error('Failed to save book', err);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        registrationNumber: vehicleForm.registrationNumber,
        vehicleType: vehicleForm.vehicleType,
        capacity: Number(vehicleForm.capacity),
        driverName: vehicleForm.driverName,
        driverPhone: vehicleForm.driverPhone
      };
      const res = await api.post('/operations/transport/vehicles', payload);
      if (res.data?.success) {
        setIsVehicleModalOpen(false);
        fetchTabData();
      }
    } catch (err) {
      console.error('Failed to save vehicle', err);
    }
  };

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        userType: leaveForm.userType,
        leaveType: leaveForm.leaveType,
        startDate: leaveForm.startDate,
        endDate: leaveForm.endDate,
        reason: leaveForm.reason
      };
      const res = await api.post('/operations/leave', payload);
      if (res.data?.success) {
        setIsLeaveModalOpen(false);
        fetchTabData();
      }
    } catch (err) {
      console.error('Failed to submit leave', err);
    }
  };

  const handleReviewLeave = async (id: number, approve: boolean) => {
    try {
      const res = await api.put(`/operations/leave/${id}/approve?approve=${approve}&remarks=${approve ? 'Approved' : 'Rejected'}`);
      if (res.data?.success) {
        fetchTabData();
      }
    } catch (err) {
      console.error('Failed to review leave', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-brand-600" />
            Campus Facilities & Operations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Integrated library management, transport bus routes, hostel bed occupancies, and leave approvals.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 flex-wrap">
          <button
            onClick={() => setActiveTab('LIBRARY')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'LIBRARY' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Library
          </button>
          <button
            onClick={() => setActiveTab('TRANSPORT')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'TRANSPORT' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            Transport
          </button>
          <button
            onClick={() => setActiveTab('HOSTEL')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'HOSTEL' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Hostel
          </button>
          <button
            onClick={() => setActiveTab('LEAVE')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'LEAVE' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarOff className="w-3.5 h-3.5" />
            Leave Requests
          </button>
        </div>
      </div>

      {/* Tab Content: LIBRARY */}
      {activeTab === 'LIBRARY' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-sm font-bold text-slate-800">
              Library Catalog ({books.length} Titles Registered)
            </div>
            <button
              onClick={() => setIsBookModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Catalog New Book
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <th className="p-4">ISBN</th>
                    <th className="p-4">Book Title</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Shelf Location</th>
                    <th className="p-4 text-center">Available Copies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {books.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono text-xs font-bold text-brand-700">{b.isbn || 'N/A'}</td>
                      <td className="p-4 font-bold text-slate-900">{b.title}</td>
                      <td className="p-4 text-slate-600">{b.author}</td>
                      <td className="p-4 text-xs font-semibold text-slate-500">{b.category}</td>
                      <td className="p-4 font-mono text-xs text-slate-600">{b.shelfLocation || 'Main Stack'}</td>
                      <td className="p-4 text-center">
                        <span className={`font-bold px-2.5 py-1 rounded-full text-xs ${
                          b.availableCopies > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {b.availableCopies} / {b.totalCopies} Available
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: TRANSPORT */}
      {activeTab === 'TRANSPORT' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-sm font-bold text-slate-800">
              Fleet & Bus Management ({vehicles.length} Active Vehicles)
            </div>
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.map(v => (
              <div key={v.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-amber-50 text-amber-800 rounded-md">
                    {v.registrationNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{v.vehicleType}</span>
                </div>
                <div className="text-sm text-slate-700">
                  Capacity: <span className="font-bold text-slate-900">{v.capacity} seats</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{v.driverName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{v.driverPhone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Configured Transport Routes ({routes.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map(r => (
                <div key={r.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Route #{r.routeNumber}: {r.routeName}</span>
                    <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      ${r.annualFee} / yr
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{r.startLocation} &rarr; {r.endLocation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: HOSTEL */}
      {activeTab === 'HOSTEL' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-sm font-bold text-slate-800">
              Campus Hostels & Residential Blocks ({hostels.length})
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hostels.map(h => (
              <div key={h.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{h.name}</h3>
                  <span className="text-xs font-bold px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full">
                    {h.genderType} Hostel
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Chief Warden:</span>
                    <span className="font-bold text-slate-800">{h.wardenName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Warden Phone:</span>
                    <span className="font-mono text-slate-800">{h.wardenPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Rooms:</span>
                    <span className="font-bold text-slate-800">{h.totalRooms} Rooms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: LEAVE */}
      {activeTab === 'LEAVE' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-sm font-bold text-slate-800">
              Leave Requests & Approvals ({leaveRequests.length})
            </div>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Apply For Leave
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <th className="p-4">User Type</th>
                    <th className="p-4">Leave Type</th>
                    <th className="p-4">Period</th>
                    <th className="p-4 text-center">Days</th>
                    <th className="p-4">Reason</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {leaveRequests.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-800">{l.userType}</td>
                      <td className="p-4 font-semibold text-brand-700">{l.leaveType}</td>
                      <td className="p-4 font-mono text-xs text-slate-600">
                        {l.startDate} to {l.endDate}
                      </td>
                      <td className="p-4 text-center font-bold">{l.totalDays}</td>
                      <td className="p-4 text-xs text-slate-600 max-w-xs truncate">{l.reason}</td>
                      <td className="p-4 text-center">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="p-4 text-right">
                        {l.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReviewLeave(l.id, true)}
                              className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReviewLeave(l.id, false)}
                              className="p-1.5 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Reviewed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Book */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Catalog Library Book"
      >
        <form onSubmit={handleAddBook} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Book Title *</label>
            <input
              type="text"
              required
              value={bookForm.title}
              onChange={e => setBookForm({ ...bookForm, title: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Author *</label>
              <input
                type="text"
                required
                value={bookForm.author}
                onChange={e => setBookForm({ ...bookForm, author: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ISBN</label>
              <input
                type="text"
                value={bookForm.isbn}
                onChange={e => setBookForm({ ...bookForm, isbn: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={bookForm.category}
                onChange={e => setBookForm({ ...bookForm, category: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Copies</label>
              <input
                type="number"
                value={bookForm.totalCopies}
                onChange={e => setBookForm({ ...bookForm, totalCopies: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shelf Location</label>
              <input
                type="text"
                value={bookForm.shelfLocation}
                onChange={e => setBookForm({ ...bookForm, shelfLocation: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsBookModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
            >
              Save Book
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Vehicle */}
      <Modal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        title="Register Transport Vehicle"
      >
        <form onSubmit={handleAddVehicle} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Registration # *</label>
              <input
                type="text"
                required
                placeholder="e.g., KA-01-AB-1234"
                value={vehicleForm.registrationNumber}
                onChange={e => setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Capacity (Seats) *</label>
              <input
                type="number"
                required
                value={vehicleForm.capacity}
                onChange={e => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Driver Name</label>
              <input
                type="text"
                value={vehicleForm.driverName}
                onChange={e => setVehicleForm({ ...vehicleForm, driverName: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Driver Contact Phone</label>
              <input
                type="text"
                value={vehicleForm.driverPhone}
                onChange={e => setVehicleForm({ ...vehicleForm, driverPhone: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsVehicleModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
            >
              Save Vehicle
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Submit Leave */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Apply For Leave"
      >
        <form onSubmit={handleSubmitLeave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Applicant Type</label>
              <select
                value={leaveForm.userType}
                onChange={e => setLeaveForm({ ...leaveForm, userType: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty Member</option>
                <option value="STAFF">Administrative Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type</label>
              <select
                value={leaveForm.leaveType}
                onChange={e => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              >
                <option value="SICK">Medical / Sick Leave</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="ACADEMIC">Academic Conference / Duty</option>
                <option value="EMERGENCY">Family Emergency</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={leaveForm.startDate}
                onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={leaveForm.endDate}
                onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Leave *</label>
            <textarea
              required
              rows={3}
              value={leaveForm.reason}
              onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
            >
              Submit Leave Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
