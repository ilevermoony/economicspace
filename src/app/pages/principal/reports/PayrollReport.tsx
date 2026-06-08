import React, { useState } from 'react';
import { ArrowLeft, Download, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router';
import { revenueByTutor, principalDashboardData } from '../../../data/mockData';

export function PayrollReport() {
  const [filterStatus, setFilterStatus] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalPayroll = principalDashboardData.financial.tutorPayroll;
  const tutorCount = revenueByTutor.length;
  const avgPayroll = totalPayroll / tutorCount;

  const tutorsWithPayroll = revenueByTutor.map((tutor) => ({
    ...tutor,
    paymentAmount: tutor.revenue * 0.6,
    paymentStatus: tutor.sessions >= 10 ? 'paid' : 'pending',
    paymentDate: tutor.sessions >= 10 ? '2026-06-05' : '-',
  }));

  const filteredTutors =
    filterStatus === 'all'
      ? tutorsWithPayroll
      : tutorsWithPayroll.filter((t) => t.paymentStatus === filterStatus);

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
            <h1 className="text-3xl font-bold text-gray-900">Payroll Tutor</h1>
            <p className="text-gray-600 mt-1">Rekap honor dan pembayaran tutor</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Payroll
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-white/80 text-sm mb-2">Total Payroll</p>
          <h3 className="text-2xl font-bold">{formatCurrency(totalPayroll)}</h3>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Jumlah Tutor</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{tutorCount}</h3>
          <p className="text-xs text-gray-500">Tutor aktif bulan ini</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Rata-rata Honor</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(avgPayroll)}</h3>
          <p className="text-xs text-gray-500">Per tutor</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-gray-600 text-sm mb-2">Total Jam Mengajar</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {revenueByTutor.reduce((sum, t) => sum + t.totalHours, 0)}
          </h3>
          <p className="text-xs text-gray-500">Jam (bulan ini)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg text-gray-900">Daftar Payroll Tutor</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                filterStatus === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                filterStatus === 'paid'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sudah Dibayar
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                filterStatus === 'pending'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Menunggu
            </button>
          </div>
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
                  Total Jam
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Revenue Generated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Honor (60%)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Tanggal Bayar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTutors.map((tutor, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tutor.name}</p>
                      <p className="text-xs text-gray-500">Rating: {tutor.rating}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">
                    {tutor.sessions}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">
                    {tutor.totalHours} jam
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                    {formatCurrency(tutor.revenue)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-bold text-primary">
                    {formatCurrency(tutor.paymentAmount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {tutor.paymentStatus === 'paid' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Dibayar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-600">
                    {tutor.paymentDate}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900">
                  TOTAL
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-gray-900">
                  {formatCurrency(filteredTutors.reduce((sum, t) => sum + t.revenue, 0))}
                </td>
                <td className="px-6 py-4 text-sm text-right font-bold text-primary">
                  {formatCurrency(filteredTutors.reduce((sum, t) => sum + t.paymentAmount, 0))}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Ketentuan Payroll</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Tutor menerima 60% dari total revenue yang dihasilkan</li>
              <li>• Pembayaran dilakukan setiap tanggal 5 bulan berikutnya</li>
              <li>
                • Minimum 3 sesi harus diselesaikan untuk memenuhi syarat pembayaran bulanan
              </li>
              <li>• Honor dihitung berdasarkan sesi yang telah dikonfirmasi selesai</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
