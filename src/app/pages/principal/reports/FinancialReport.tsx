import React from 'react';
import { ArrowLeft, Download, TrendingUp, DollarSign } from 'lucide-react';
import { Link } from 'react-router';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { monthlyRevenue, principalDashboardData, transactions } from '../../../data/mockData';

export function FinancialReport() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const { financial } = principalDashboardData;

  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

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
            <h1 className="text-3xl font-bold text-gray-900">Laporan Keuangan</h1>
            <p className="text-gray-600 mt-1">Profit & Loss Statement - Juni 2026</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export P&L
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Income Statement</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-600">Pendapatan Kotor</span>
              <span className="text-base font-bold text-gray-900">
                {formatCurrency(financial.totalRevenue)}
              </span>
            </div>

            <div className="pl-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pembayaran Sesi Tutoring</span>
                <span className="text-sm text-gray-900">
                  {formatCurrency(financial.totalRevenue)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-600">Biaya Operasional</span>
                <span className="text-base font-bold text-red-600">
                  ({formatCurrency(financial.tutorPayroll + financial.operationalCosts)})
                </span>
              </div>

              <div className="pl-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Honor Tutor</span>
                  <span className="text-sm text-gray-900">
                    ({formatCurrency(financial.tutorPayroll)})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Operasional & Maintenance</span>
                  <span className="text-sm text-gray-900">
                    ({formatCurrency(financial.operationalCosts)})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Laba Bersih</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(financial.netProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">Margin Laba</span>
                <span className="text-sm font-semibold text-green-600">
                  {financial.profitMargin.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Financial Metrics</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Total Revenue (6 Months)</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0))}
              </p>
              <p className="text-xs text-gray-500 mt-1">Jan - Jun 2026</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Total Profit (6 Months)</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(monthlyRevenue.reduce((sum, m) => sum + m.profit, 0))}
              </p>
              <p className="text-xs text-gray-500 mt-1">Akumulasi laba bersih</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Avg Monthly Profit</p>
              <p className="text-2xl font-bold text-purple-700">
                {formatCurrency(monthlyRevenue.reduce((sum, m) => sum + m.profit, 0) / 6)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Rata-rata per bulan</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium text-gray-900">Tren Positif</p>
              </div>
              <p className="text-xs text-gray-600">
                Revenue dan profit menunjukkan pertumbuhan konsisten selama 6 bulan terakhir
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-6">Tren Revenue vs Profit</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyRevenue}>
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
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#915D16"
              strokeWidth={3}
              name="Revenue"
              dot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#8AC5BC"
              strokeWidth={3}
              name="Profit"
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Riwayat Transaksi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.slice(0, 10).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.description}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <span
                      className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {transaction.status}
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
