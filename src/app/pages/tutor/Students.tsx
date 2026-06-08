import React, { useState } from 'react';
import { Search, Mail, Phone, Calendar, TrendingUp, MessageSquare, User } from 'lucide-react';
import { tutorStudents } from '../../data/mockData';

export function TutorStudents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPerformance, setFilterPerformance] = useState<'all' | 'Sangat Baik' | 'Baik'>('all');

  const filteredStudents = tutorStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.enrolledSubject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPerformance =
      filterPerformance === 'all' || student.performance === filterPerformance;

    return matchesSearch && matchesPerformance;
  });

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Sangat Baik':
        return 'bg-accent/20 text-accent';
      case 'Baik':
        return 'bg-primary/15 text-primary';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mahasiswa Saya</h1>
        <p className="text-gray-600 mt-1">Kelola dan pantau perkembangan mahasiswa Anda</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{tutorStudents.length}</h3>
          <p className="text-gray-600 text-sm">Total Mahasiswa</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {tutorStudents.filter((s) => s.performance === 'Sangat Baik').length}
          </h3>
          <p className="text-gray-600 text-sm">Performa Sangat Baik</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {tutorStudents.reduce((sum, s) => sum + s.sessionsAttended, 0)}
          </h3>
          <p className="text-gray-600 text-sm">Total Sesi Dihadiri</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {tutorStudents.filter((s) => s.feedbackGiven).length}
          </h3>
          <p className="text-gray-600 text-sm">Feedback Diterima</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari mahasiswa berdasarkan nama, email, atau mata kuliah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterPerformance('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterPerformance === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterPerformance('Sangat Baik')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterPerformance === 'Sangat Baik'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sangat Baik
            </button>
            <button
              onClick={() => setFilterPerformance('Baik')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterPerformance === 'Baik'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Baik
            </button>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-600">
                    {student.major} - Semester {student.semester}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getPerformanceColor(
                  student.performance
                )}`}
              >
                {student.performance}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                {student.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                {student.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                Sesi terakhir: {new Date(student.lastSession).toLocaleDateString('id-ID')}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Mata Kuliah</span>
                <span className="text-sm font-semibold text-gray-900">
                  {student.enrolledSubject}
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Sesi Dihadiri</span>
                <span className="text-sm font-semibold text-gray-900">
                  {student.sessionsAttended} sesi
                </span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                  Lihat Detail
                </button>
                <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                  Hubungi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">Tidak Ada Mahasiswa Ditemukan</h3>
          <p className="text-gray-600">Coba sesuaikan filter pencarian Anda.</p>
        </div>
      )}
    </div>
  );
}
