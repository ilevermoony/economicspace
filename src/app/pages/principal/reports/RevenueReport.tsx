import React, { useState } from 'react';
import { ArrowLeft, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { monthlyRevenue, revenueBySubject, revenueByTutor } from '../../../data/mockData';

export function RevenueReport() {
  const [period, setPeriod] = useState('6months');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
  const avgRevenue = totalRevenue / monthlyRevenue.length;
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const previousMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const growth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;

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
            <h1 className="text-3xl font-bold text-gray-900">Laporan Pendapatan</h1>
            <p className="text-gray-600 mt-1">Analisis pendapatan komprehensif</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="3months">3 Bulan Terakhir</option>
            <option value="6months">6 Bulan Terakhir</option>
            <option value="12months">12 Bulan Terakhir</option>
          </select>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-5">
          <p className="text-white/80 text-sm mb-2">Total Pendapatan (6 Bulan)</p>
          <h3 className="text-2xl font-bold mb-1">{formatCurrency(totalRevenue)}</h3>
          <p className="text-xs text-white/60">Periode: Jan - Jun 2026</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Rata-rata per Bulan</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(avgRevenue)}</h3>
          <p className="text-xs text-gray-500">Average monthly revenue</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Bulan Terbaik</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Juni 2026</h3>
          <p className="text-xs text-green-600 font-medium">{formatCurrency(currentMonth.revenue)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Pertumbuhan MoM</p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-gray-900">{growth.toFixed(1)}%</h3>
            {growth > 0 ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
          </div>
          <p className="text-xs text-gray-500">vs bulan sebelumnya</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-6">Tren Pendapatan Bulanan</h2>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={monthlyRevenue}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#915D16" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#915D16" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`} />
            <Tooltip
              formatter={(value) => formatCurrency(value as number)}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#915D16"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Pendapatan per Mata Kuliah</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueBySubject}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="subject" stroke="#6B7280" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#6B7280" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`} />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="revenue" fill="#915D16" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Pendapatan per Tutor</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueByTutor} layout="horizontal">
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
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Detail Pendapatan per Mata Kuliah</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mata Kuliah
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Pendapatan
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Sesi
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  % Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {revenueBySubject.map((subject, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{subject.subject}</td>
                  <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                    {formatCurrency(subject.revenue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-600">
                    {subject.sessions}
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {subject.percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
