import React from 'react';
import { ArrowLeft, Download, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { principalDashboardData, monthlyRevenue } from '../../../data/mockData';

export function StudentsReport() {
  const studentEngagement = [
    { month: 'Jan', active: 20, new: 5, returning: 15 },
    { month: 'Feb', active: 22, new: 4, returning: 18 },
    { month: 'Mar', active: 24, new: 6, returning: 18 },
    { month: 'Apr', active: 23, new: 3, returning: 20 },
    { month: 'Mei', active: 25, new: 5, returning: 20 },
    { month: 'Jun', active: 28, new: 6, returning: 22 },
  ];

  const subjectPreferences = [
    { subject: 'Akuntansi Menengah I', students: 12, avgBookings: 1.25 },
    { subject: 'Mikroekonomi Lanjutan', students: 8, avgBookings: 1.12 },
    { subject: 'Ekonometrika', students: 6, avgBookings: 1.33 },
    { subject: 'Statistika Bisnis', students: 5, avgBookings: 1.4 },
    { subject: 'Akuntansi Biaya', students: 4, avgBookings: 1.25 },
  ];

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
            <h1 className="text-3xl font-bold text-gray-900">Laporan Aktivitas Mahasiswa</h1>
            <p className="text-gray-600 mt-1">Analisis engagement dan perilaku mahasiswa</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Mahasiswa Aktif</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {principalDashboardData.currentMonth.activeStudents}
          </h3>
          <p className="text-xs text-green-600 mt-1">+3 dari bulan lalu</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Mahasiswa Baru</p>
          <h3 className="text-2xl font-bold text-gray-900">6</h3>
          <p className="text-xs text-gray-500 mt-1">Bulan Juni</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Retention Rate</p>
          <h3 className="text-2xl font-bold text-gray-900">78.6%</h3>
          <p className="text-xs text-green-600 mt-1">+5% vs bulan lalu</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Kepuasan</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {principalDashboardData.currentMonth.satisfaction}/5.0
          </h3>
          <p className="text-xs text-green-600 mt-1">92% mahasiswa puas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-6">Tren Mahasiswa Aktif</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={studentEngagement}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="active"
              stroke="#915D16"
              strokeWidth={3}
              name="Total Aktif"
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="new"
              stroke="#8AC5BC"
              strokeWidth={2}
              name="Mahasiswa Baru"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="returning"
              stroke="#E59539"
              strokeWidth={2}
              name="Mahasiswa Lama"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Preferensi Mata Kuliah</h2>
          <div className="space-y-4">
            {subjectPreferences.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.subject}</p>
                  <p className="text-xs text-gray-500">{item.students} mahasiswa aktif</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.avgBookings.toFixed(2)} booking/mhs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Statistik Penggunaan</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">Rata-rata Booking per Mahasiswa</p>
                <p className="text-lg font-bold text-blue-700">1.6</p>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">Feedback Response Rate</p>
                <p className="text-lg font-bold text-green-700">85%</p>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">Material Access Rate</p>
                <p className="text-lg font-bold text-purple-700">72%</p>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Insight Mahasiswa</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Pertumbuhan mahasiswa aktif konsisten (+12% YoY)</li>
              <li>• Retention rate meningkat signifikan, indikasi kepuasan tinggi</li>
              <li>• Mahasiswa cenderung booking lebih dari 1 sesi (avg 1.6 booking)</li>
              <li>• Feedback response rate tinggi (85%), menunjukkan engagement baik</li>
              <li>• Akuntansi Menengah I paling diminati dengan 12 mahasiswa aktif</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
