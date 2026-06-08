import React from 'react';
import { ArrowLeft, Download, BookOpen, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { revenueBySubject, principalDashboardData } from '../../../data/mockData';

const COLORS = ['#915D16', '#E59539', '#8AC5BC', '#C88A3E', '#A67A4A'];

export function SubjectsReport() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = revenueBySubject.reduce((sum, s) => sum + s.revenue, 0);
  const totalSessions = revenueBySubject.reduce((sum, s) => sum + s.sessions, 0);
  const mostPopular = revenueBySubject.sort((a, b) => b.sessions - a.sessions)[0];

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
            <h1 className="text-3xl font-bold text-gray-900">Laporan Mata Kuliah</h1>
            <p className="text-gray-600 mt-1">Analisis popularitas dan performa mata kuliah</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Total Mata Kuliah</p>
          <h3 className="text-2xl font-bold text-gray-900">{revenueBySubject.length}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <h3 className="text-xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Total Booking</p>
          <h3 className="text-2xl font-bold text-gray-900">{totalSessions}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Paling Populer</p>
          <h3 className="text-base font-bold text-gray-900">{mostPopular.subject.split(' ')[0]}</h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Revenue per Mata Kuliah</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueBySubject}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ subject, percentage }) => `${subject.split(' ')[0]}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {revenueBySubject.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Jumlah Booking per Mata Kuliah</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueBySubject}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="subject" stroke="#6B7280" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="sessions" fill="#915D16" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Detail Performa Mata Kuliah</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mata Kuliah
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Booking
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  % Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Growth
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Tren
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {revenueBySubject.map((subject, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                    {formatCurrency(subject.revenue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">
                    {subject.sessions}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {subject.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        subject.growth > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {subject.growth > 0 ? '+' : ''}
                      {subject.growth}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {subject.growth > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600 mx-auto" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Insight Mata Kuliah</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Akuntansi Menengah I paling diminati dengan 15 booking (33.3% dari total)</li>
              <li>• Ekonometrika menunjukkan pertumbuhan tertinggi (+25%)</li>
              <li>• Statistika Bisnis mengalami penurunan -5%, perlu strategi promosi</li>
              <li>• Semua mata kuliah memiliki revenue positif dengan demand yang stabil</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
