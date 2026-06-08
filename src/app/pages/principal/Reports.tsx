import React from 'react';
import { Link } from 'react-router';
import {
  DollarSign,
  Users,
  BookOpen,
  TrendingUp,
  FileText,
  Download,
  Calendar,
} from 'lucide-react';

export function PrincipalReports() {
  const reports = [
    {
      id: 'revenue',
      title: 'Laporan Pendapatan',
      description: 'Analisis pendapatan detail per periode, mata kuliah, dan tutor',
      icon: DollarSign,
      color: 'bg-primary',
      path: '/principal/reports/revenue',
    },
    {
      id: 'payroll',
      title: 'Payroll Tutor',
      description: 'Rekap honor tutor, total jam mengajar, dan pembayaran',
      icon: Users,
      color: 'bg-accent',
      path: '/principal/reports/payroll',
    },
    {
      id: 'students',
      title: 'Aktivitas Mahasiswa',
      description: 'Statistik penggunaan layanan tutoring oleh mahasiswa',
      icon: BookOpen,
      color: 'bg-blue-500',
      path: '/principal/reports/students',
    },
    {
      id: 'tutors',
      title: 'Kinerja Tutor',
      description: 'Evaluasi performa tutor berdasarkan rating dan jumlah sesi',
      icon: Users,
      color: 'bg-secondary',
      path: '/principal/reports/tutors',
    },
    {
      id: 'subjects',
      title: 'Analisis Mata Kuliah',
      description: 'Performa dan popularitas per mata kuliah',
      icon: BookOpen,
      color: 'bg-purple-500',
      path: '/principal/reports/subjects',
    },
    {
      id: 'operational',
      title: 'Laporan Operasional',
      description: 'Overview operasional harian dan mingguan',
      icon: TrendingUp,
      color: 'bg-green-500',
      path: '/principal/reports/operational',
    },
    {
      id: 'financial',
      title: 'Laporan Keuangan',
      description: 'Ringkasan keuangan lengkap dengan profit & loss',
      icon: FileText,
      color: 'bg-indigo-500',
      path: '/principal/reports/financial',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laporan Bisnis</h1>
          <p className="text-gray-600 mt-1">
            Akses berbagai laporan untuk monitoring bisnis Economic Space
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Semua
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.id}
              to={report.path}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-primary/50 group"
            >
              <div
                className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {report.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{report.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm text-primary font-medium group-hover:underline">
                  Lihat Laporan →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">Laporan Otomatis</h3>
            <p className="text-sm text-gray-600 mb-4">
              Laporan bulanan akan digenerate otomatis setiap awal bulan dan dikirim ke email
              Anda. Anda juga dapat mengakses arsip laporan di halaman ini.
            </p>
            <button className="text-sm text-primary font-medium hover:underline">
              Atur Preferensi Laporan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
