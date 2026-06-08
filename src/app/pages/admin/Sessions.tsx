import React, { useState } from 'react';
import { Calendar, Search, Filter, Download, Eye } from 'lucide-react';
import { bookings } from '../../data/mockData';

export function AdminSessions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredSessions = bookings.filter((booking) => {
    const matchesSearch =
      booking.tuteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-accent/20 text-accent';
      case 'verification':
        return 'bg-secondary/10 text-secondary';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-primary/15 text-primary';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Session Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage all tutoring sessions</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Sessions</h3>
          <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Terkonfirmasi</h3>
          <p className="text-3xl font-bold text-accent">
            {bookings.filter((b) => b.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Menunggu</h3>
          <p className="text-3xl font-bold text-secondary">
            {bookings.filter((b) => b.status === 'verification').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">This Month Revenue</h3>
          <p className="text-3xl font-bold text-primary">
            ${bookings.reduce((sum, b) => sum + b.fee, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan mahasiswa, tutor, atau mata kuliah..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Terkonfirmasi</option>
          <option value="verification">Verification</option>
          <option value="pending_payment">Menunggu Payment</option>
          <option value="completed">Selesai</option>
        </select>
        <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl border border-gray-200">
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
                  Tanggal & Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Durasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {session.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{session.tuteeName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{session.tutorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{session.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(session.date).toLocaleDateString()} {session.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{session.duration}h</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${session.fee}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {session.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-primary hover:text-primary flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSessions.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
