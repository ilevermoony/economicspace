import React from 'react';
import {
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export function AdminDashboard() {
  const { bookings, payroll } = useData();
  const pendingPayments = bookings.filter((b) => b.status === 'verification').length;
  const pendingPayroll = payroll.filter((p) => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage operations and monitor activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{pendingPayments}</h3>
          <p className="text-gray-600 text-sm">Menunggu Payment Verification</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">156</h3>
          <p className="text-gray-600 text-sm">Total Sessions This Month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">89</h3>
          <p className="text-gray-600 text-sm">Active Students</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-accent font-medium">+15%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Rp9.360.000</h3>
          <p className="text-gray-600 text-sm">Pendapatan Bulan Ini</p>
        </div>
      </div>

      {/* Aksi Required */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-900">Payment Verification Queue</h2>
            <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
              {pendingPayments} pending
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {bookings
              .filter((b) => b.status === 'verification')
              .slice(0, 3)
              .map((booking) => (
                <div key={booking.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {booking.tuteeName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {booking.subject} with {booking.tutorName}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                        <span>Rp{booking.fee.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-accent text-white rounded-lg hover:bg-accent/90 text-sm">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-900">Payroll Processing</h2>
            <span className="px-3 py-1 bg-primary/15 text-primary rounded-full text-sm font-medium">
              {pendingPayroll} pending
            </span>
          </div>
          <div className="divide-y divide-gray-200">
            {payroll
              .filter((p) => p.status === 'pending')
              .map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.tutorName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.month}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{item.sessionsCompleted} sessions</span>
                        <span>{item.totalHours} hours</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">Rp{item.totalEarnings.toLocaleString('id-ID')}</p>
                      <button className="mt-2 px-3 py-1 bg-accent text-white rounded-lg hover:bg-accent/90 text-sm">
                        Process Payment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tutor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mata Kuliah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.tuteeName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.tutorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(booking.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-accent/20 text-accent'
                          : booking.status === 'verification'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Rp{booking.fee.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}