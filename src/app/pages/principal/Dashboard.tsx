import React from 'react';
import { Link } from 'react-router';
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Star,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
  Heart,
  AlertTriangle,
  FileText,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  principalDashboardData,
  monthlyRevenue,
  revenueBySubject,
  revenueByTutor,
  businessInsights,
} from '../../data/mockData';

const COLORS = ['#915D16', '#E59539', '#8AC5BC', '#C88A3E', '#A67A4A'];

export function PrincipalDashboard() {
  const { currentMonth, previousMonth, financial, topTutors, subjectPerformance } =
    principalDashboardData;

  const revenueGrowth = (
    ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) *
    100
  ).toFixed(1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompact = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}jt`;
    }
    return formatCurrency(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pusat Monitoring Bisnis</h1>
          <p className="text-gray-600 mt-1">Dashboard komprehensif Economic Space Platform</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/principal/reports"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Laporan
          </Link>
        </div>
      </div>

      {/* Business Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        {businessInsights.slice(0, 3).map((insight) => {
          const Icon =
            insight.icon === 'trending-up'
              ? TrendingUp
              : insight.icon === 'award'
                ? Award
                : insight.icon === 'heart'
                  ? Heart
                  : insight.icon === 'star'
                    ? Star
                    : insight.icon === 'alert-triangle'
                      ? AlertTriangle
                      : DollarSign;

          const bgColor =
            insight.type === 'success'
              ? 'bg-green-50'
              : insight.type === 'warning'
                ? 'bg-yellow-50'
                : 'bg-blue-50';
          const iconColor =
            insight.type === 'success'
              ? 'text-green-600'
              : insight.type === 'warning'
                ? 'text-yellow-600'
                : 'text-blue-600';

          return (
            <div key={insight.id} className={`${bgColor} rounded-xl p-4 border border-gray-200`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{insight.title}</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">{insight.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main KPI Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Link
          to="/principal/revenue"
          className="bg-gradient-to-br from-primary to-[#7A4D12] text-white rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded font-medium">
              +{revenueGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-1">{formatCompact(currentMonth.revenue)}</h3>
          <p className="text-white/80 text-xs">Pendapatan Bulan Ini</p>
        </Link>

        <div className="bg-gradient-to-br from-accent to-[#6FA89D] text-white rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{currentMonth.sessions}</h3>
          <p className="text-white/80 text-xs">Total Sesi Tutoring</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{currentMonth.activeStudents}</h3>
          <p className="text-white/80 text-xs">Mahasiswa Aktif</p>
        </div>

        <div className="bg-gradient-to-br from-secondary to-[#D17F27] text-white rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{currentMonth.activeTutors}</h3>
          <p className="text-white/80 text-xs">Tutor Aktif</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{currentMonth.satisfaction}</h3>
          <p className="text-white/80 text-xs">Kepuasan (dari 5.0)</p>
        </div>
      </div>

      {/* Operational Monitoring */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-4">Monitoring Operasional</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentMonth.newBookings}</p>
              <p className="text-sm text-gray-600">Booking Baru</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentMonth.pendingSessions}</p>
              <p className="text-sm text-gray-600">Sesi Akan Datang</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentMonth.pendingPayments}</p>
              <p className="text-sm text-gray-600">Menunggu Verifikasi</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentMonth.completedSessions}</p>
              <p className="text-sm text-gray-600">Sesi Selesai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg text-gray-900">Tren Pendapatan Bulanan</h2>
            <Link
              to="/principal/revenue"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Detail <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#915D16" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#915D16" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
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
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Subject */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-6">Pendapatan per Mata Kuliah</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={revenueBySubject}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ subject, percentage }) => `${subject.split(' ')[0]}: ${percentage}%`}
                outerRadius={90}
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
      </div>

      {/* Financial Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg text-gray-900">Ringkasan Keuangan</h2>
          <Link
            to="/principal/reports/financial"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Laporan Lengkap <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Total Pemasukan</p>
            <p className="text-xl font-bold text-green-700">{formatCompact(financial.totalRevenue)}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600 mb-1">Payroll Tutor</p>
            <p className="text-xl font-bold text-red-700">{formatCompact(financial.tutorPayroll)}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600 mb-1">Biaya Operasional</p>
            <p className="text-xl font-bold text-orange-700">
              {formatCompact(financial.operationalCosts)}
            </p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Laba Bersih</p>
            <p className="text-xl font-bold text-blue-700">{formatCompact(financial.netProfit)}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-600 mb-1">Margin Laba</p>
            <p className="text-xl font-bold text-purple-700">{financial.profitMargin.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Top Tutors */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg text-gray-900">Tutor Terbaik Bulan Ini</h2>
          <Link
            to="/principal/reports/tutors"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {topTutors.map((tutor, index) => (
            <div
              key={tutor.tutorId}
              className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{tutor.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium text-gray-700">{tutor.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sesi:</span>
                  <span className="font-semibold text-gray-900">{tutor.sessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold text-gray-900">{formatCompact(tutor.revenue)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {tutor.subjects.slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg text-gray-900">Performa Mata Kuliah</h2>
          <Link
            to="/principal/reports/subjects"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Analisis Lengkap <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mata Kuliah
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Booking
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Mahasiswa
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Pendapatan
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjectPerformance.map((subject, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{subject.subject}</td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">
                    {subject.bookings}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-900">
                    {subject.students}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                    {formatCompact(subject.revenue)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-900">{subject.avgRating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-4">
        <Link
          to="/principal/reports/revenue"
          className="p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Laporan Pendapatan</h3>
          <p className="text-sm text-gray-600">Analisis revenue detail</p>
        </Link>

        <Link
          to="/principal/reports/payroll"
          className="p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Payroll Tutor</h3>
          <p className="text-sm text-gray-600">Rekap honor tutor</p>
        </Link>

        <Link
          to="/principal/reports/students"
          className="p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Aktivitas Mahasiswa</h3>
          <p className="text-sm text-gray-600">Statistik penggunaan</p>
        </Link>

        <Link
          to="/principal/reports/operational"
          className="p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Laporan Operasional</h3>
          <p className="text-sm text-gray-600">Overview operasi</p>
        </Link>
      </div>
    </div>
  );
}
