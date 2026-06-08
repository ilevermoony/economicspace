import React from 'react';
import { ArrowLeft, Download, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { principalDashboardData } from '../../../data/mockData';

export function OperationalReport() {
  const weeklyData = [
    { day: 'Sen', bookings: 8, completed: 7, cancelled: 1 },
    { day: 'Sel', bookings: 10, completed: 9, cancelled: 1 },
    { day: 'Rab', bookings: 12, completed: 11, cancelled: 1 },
    { day: 'Kam', bookings: 9, completed: 8, cancelled: 1 },
    { day: 'Jum', bookings: 6, completed: 5, cancelled: 1 },
  ];

  const { currentMonth } = principalDashboardData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/principal/reports"
            className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan Operasional</h1>
            <p className="text-gray-600 mt-1">Overview operasi harian dan mingguan</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-blue-700 text-sm mb-1">Booking Baru</p>
          <h3 className="text-2xl font-bold text-blue-900">{currentMonth.newBookings}</h3>
          <p className="text-xs text-blue-600 mt-1">Minggu ini</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-yellow-700 text-sm mb-1">Sesi Pending</p>
          <h3 className="text-2xl font-bold text-yellow-900">{currentMonth.pendingSessions}</h3>
          <p className="text-xs text-yellow-600 mt-1">Akan datang</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-orange-700 text-sm mb-1">Butuh Verifikasi</p>
          <h3 className="text-2xl font-bold text-orange-900">{currentMonth.pendingPayments}</h3>
          <p className="text-xs text-orange-600 mt-1">Pembayaran</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-green-700 text-sm mb-1">Sesi Selesai</p>
          <h3 className="text-2xl font-bold text-green-900">{currentMonth.completedSessions}</h3>
          <p className="text-xs text-green-600 mt-1">Bulan ini</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-6">Aktivitas Mingguan</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="bookings" fill="#915D16" name="Total Booking" radius={[8, 8, 0, 0]} />
            <Bar dataKey="completed" fill="#8AC5BC" name="Selesai" radius={[8, 8, 0, 0]} />
            <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Metrik Operasional</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Completion Rate</p>
                <p className="text-xs text-gray-500">Sesi yang selesai</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">84.4%</p>
                <p className="text-xs text-green-600">+2% vs minggu lalu</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Cancellation Rate</p>
                <p className="text-xs text-gray-500">Booking dibatalkan</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">11.1%</p>
                <p className="text-xs text-yellow-600">Dalam batas normal</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Payment Verification Time</p>
                <p className="text-xs text-gray-500">Rata-rata waktu verifikasi</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">4.2 jam</p>
                <p className="text-xs text-green-600">-1.3 jam vs minggu lalu</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Average Session Size</p>
                <p className="text-xs text-gray-500">Rata-rata peserta per sesi</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">4.8 org</p>
                <p className="text-xs text-gray-500">Stabil</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Status Sesi Hari Ini</h2>
          <div className="space-y-3">
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Sesi Selesai</p>
                  <p className="text-sm text-gray-600">3 sesi telah dikonfirmasi selesai</p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>

            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Sedang Berlangsung</p>
                  <p className="text-sm text-gray-600">2 sesi sedang berlangsung</p>
                </div>
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Terjadwal Hari Ini</p>
                  <p className="text-sm text-gray-600">4 sesi akan berlangsung</p>
                </div>
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Menunggu Konfirmasi</p>
                  <p className="text-sm text-gray-600">2 booking perlu dikonfirmasi</p>
                </div>
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6">
        <h3 className="font-bold text-gray-900 mb-3">Ringkasan Operasional</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold mb-2">Kinerja Baik:</h4>
            <ul className="space-y-1">
              <li>• Completion rate stabil di atas 80%</li>
              <li>• Waktu verifikasi pembayaran menurun signifikan</li>
              <li>• Jumlah booking baru meningkat konsisten</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Area Perhatian:</h4>
            <ul className="space-y-1">
              <li>• 3 pembayaran masih menunggu verifikasi lebih dari 6 jam</li>
              <li>• Sesi hari Jumat cenderung lebih sedikit (perlu promosi)</li>
              <li>• Beberapa booking pending konfirmasi lokasi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
