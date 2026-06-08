import React from 'react';
import { useNavigate } from 'react-router';
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  BookOpen,
  MapPin,
  Bell,
  CheckCircle,
} from 'lucide-react';
import { bookings, tutors, tutorStudents, sessionCompletions } from '../../data/mockData';

export function TutorDashboard() {
  const navigate = useNavigate();
  const currentTutor = tutors[0]; // Zaky Khalif Amri
  const todaySessions = bookings
    .filter((b) => b.tutorId === '1' && b.status === 'confirmed')
    .slice(0, 3);
  const upcomingSessions = bookings.filter((b) => b.tutorId === '1' && b.status === 'confirmed');
  const completedSessions = sessionCompletions.filter((sc) => sc.tutorId === '1');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Selamat Datang Kembali, {currentTutor.name}!
        </h1>
        <p className="text-gray-600 mt-1">Ini jadwal mengajar Anda hari ini</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs text-accent font-medium">+12%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">18</h3>
          <p className="text-gray-600 text-sm">Sesi Bulan Ini</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{tutorStudents.length}</h3>
          <p className="text-gray-600 text-sm">Mahasiswa Aktif</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-xs text-accent font-medium">+8%</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Rp1.080.000</h3>
          <p className="text-gray-600 text-sm">Pendapatan Bulan Ini</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{currentTutor.rating}</h3>
          <p className="text-gray-600 text-sm">Rating Rata-rata</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">Jadwal Hari Ini</h2>
              <button
                onClick={() => navigate('/tutor/schedule')}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Lihat Semua
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {todaySessions.length > 0 ? (
                todaySessions.map((session) => (
                  <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary/15 rounded-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{session.subject}</h3>
                            <p className="text-sm text-gray-600">{session.tuteeName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 ml-13">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.time} ({session.duration} jam)
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {session.participants} mahasiswa
                          </span>
                          {session.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {session.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Tidak Ada Sesi Hari Ini</h3>
                  <p className="text-gray-600">Anda tidak memiliki sesi yang dijadwalkan untuk hari ini.</p>
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="font-bold text-lg text-gray-900">Notifikasi Terbaru</h2>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    Booking baru untuk <span className="font-semibold">Akuntansi Menengah I</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">10 menit yang lalu</p>
                </div>
              </div>
              <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Pembayaran dikonfirmasi untuk sesi besok</p>
                  <p className="text-xs text-gray-500 mt-1">2 jam yang lalu</p>
                </div>
              </div>
              <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/15 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Sarah Johnson memberikan rating 5★</p>
                  <p className="text-xs text-gray-500 mt-1">5 jam yang lalu</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary to-[#7A4D12] text-white rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">Minggu Ini</h3>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-primary-foreground/80">Sesi</span>
                <span className="text-2xl font-bold">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-foreground/80">Jam</span>
                <span className="text-2xl font-bold">9</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-foreground/80">Pendapatan</span>
                <span className="text-2xl font-bold">Rp360.000</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/tutor/schedule')}
                className="w-full p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-left font-medium transition-colors"
              >
                📅 Perbarui Ketersediaan
              </button>
              <button
                onClick={() => navigate('/tutor/locations')}
                className="w-full p-3 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg text-left font-medium transition-colors"
              >
                📍 Kelola Lokasi
              </button>
              <button
                onClick={() => navigate('/tutor/materials')}
                className="w-full p-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg text-left font-medium transition-colors"
              >
                📚 Unggah Materi
              </button>
              <button
                onClick={() => navigate('/tutor/students')}
                className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-left font-medium text-gray-900 transition-colors"
              >
                👥 Lihat Mahasiswa
              </button>
            </div>
          </div>

          {/* Subject Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Mata Kuliah Saya</h3>
            <div className="space-y-3">
              {currentTutor.specializations.map((subject, index) => (
                <div
                  key={index}
                  className="p-3 bg-primary/5 border border-primary/20 rounded-lg"
                >
                  <p className="font-medium text-gray-900">{subject}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {upcomingSessions.filter((s) => s.subject === subject).length} sesi mendatang
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
