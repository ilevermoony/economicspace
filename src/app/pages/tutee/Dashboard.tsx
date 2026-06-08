import React from 'react';
import { useNavigate } from 'react-router';
import { Calendar, Clock, BookOpen, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { bookings, sessions } from '../../data/mockData';

export function TuteeDashboard() {
  const navigate = useNavigate();
  const upcomingSessions = bookings.filter((b) => b.status === 'confirmed').slice(0, 3);
  const recentSessions = sessions.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Selamat Datang Kembali, Sarah!</h1>
        <p className="text-gray-600 mt-1">Ini ringkasan kemajuan belajar Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">3</h3>
          <p className="text-gray-600 text-sm">Sesi Mendatang</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">12</h3>
          <p className="text-gray-600 text-sm">Sesi Selesai</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">1</h3>
          <p className="text-gray-600 text-sm">Umpan Balik Tertunda</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">8</h3>
          <p className="text-gray-600 text-sm">Materi Terbuka</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-bold text-lg text-gray-900">Sesi Mendatang</h2>
            <button
              onClick={() => navigate('/tutee/sessions')}
              className="text-sm text-primary hover:text-primary"
            >
              Lihat Semua
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{session.subject}</h3>
                    <p className="text-sm text-gray-600 mb-2">with {session.tutorName}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.time}
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                    Terkonfirmasi
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aksi Cepat */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/tutee/book')}
              className="w-full p-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Pesan Sesi Baru
            </button>
            <button
              onClick={() => navigate('/tutee/materials')}
              className="w-full p-4 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Jelajahi Materi
            </button>
            <button
              onClick={() => navigate('/tutee/feedback')}
              className="w-full p-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Kirim Umpan Balik
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Sesi Terbaru</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentSessions.map((session) => (
            <div key={session.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{session.subject}</h3>
                  <p className="text-sm text-gray-600 mb-2">with {session.tutor}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {new Date(session.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>{session.duration} jam</span>
                  </div>
                </div>
                {!session.feedbackSubmitted ? (
                  <button
                    onClick={() => navigate('/tutee/feedback')}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary/20 transition-colors text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Kirim Umpan Balik
                  </button>
                ) : (
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                    Selesai
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
