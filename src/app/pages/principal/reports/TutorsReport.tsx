import React, { useState } from 'react';
import { ArrowLeft, Download, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { revenueByTutor, principalDashboardData } from '../../../data/mockData';

export function TutorsReport() {
  const [sortBy, setSortBy] = useState('revenue');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const sortedTutors = [...revenueByTutor].sort((a, b) => {
    if (sortBy === 'revenue') return b.revenue - a.revenue;
    if (sortBy === 'sessions') return b.sessions - a.sessions;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

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
            <h1 className="text-3xl font-bold text-gray-900">Laporan Kinerja Tutor</h1>
            <p className="text-gray-600 mt-1">Evaluasi performa dan produktivitas tutor</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="revenue">Urutkan: Revenue</option>
            <option value="sessions">Urutkan: Jumlah Sesi</option>
            <option value="rating">Urutkan: Rating</option>
          </select>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Total Tutor Aktif</p>
          <h3 className="text-2xl font-bold text-gray-900">{revenueByTutor.length}</h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Rata-rata Rating</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {(revenueByTutor.reduce((sum, t) => sum + t.rating, 0) / revenueByTutor.length).toFixed(1)}
          </h3>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Total Sesi Bulan Ini</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {revenueByTutor.reduce((sum, t) => sum + t.sessions, 0)}
          </h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-6">Perbandingan Revenue per Tutor</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={sortedTutors} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" stroke="#6B7280" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`} />
            <YAxis dataKey="name" type="category" stroke="#6B7280" tick={{ fontSize: 11 }} width={120} />
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="revenue" fill="#8AC5BC" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Detail Kinerja Tutor</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nama Tutor
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Sesi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Jam Mengajar
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Avg/Sesi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedTutors.map((tutor, index) => (
                <tr key={tutor.tutorId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">#{index + 1}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{tutor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">
                    {tutor.sessions}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">
                    {tutor.totalHours} jam
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                    {formatCurrency(tutor.revenue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-600">
                    {formatCurrency(tutor.avgSessionRevenue)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">{tutor.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tutor.rating >= 4.7
                        ? 'bg-green-100 text-green-700'
                        : tutor.rating >= 4.5
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {tutor.rating >= 4.7 ? 'Excellent' : tutor.rating >= 4.5 ? 'Good' : 'Average'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Top Performer</h3>
              <p className="text-sm text-gray-700">
                {principalDashboardData.topTutors[0].name} mencatat revenue tertinggi dengan {formatCurrency(principalDashboardData.topTutors[0].revenue)} dari {principalDashboardData.topTutors[0].sessions} sesi.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Highest Rating</h3>
              <p className="text-sm text-gray-700">
                {revenueByTutor.sort((a, b) => b.rating - a.rating)[0].name} memiliki rating tertinggi ({revenueByTutor.sort((a, b) => b.rating - a.rating)[0].rating}) dengan konsistensi pelayanan excellent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
