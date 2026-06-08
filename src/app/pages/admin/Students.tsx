import React, { useState } from 'react';
import { Search, User, BookOpen, Calendar, Filter, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { subjects } from '../../data/mockData';

export function AdminStudents() {
  const { students: tutorStudents, updateStudent } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredStudents = tutorStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.major.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject =
      selectedSubject === 'all' || student.enrolledSubject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  const viewDetails = (student: any) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const getPerformanceBadge = (performance: string) => {
    if (performance === 'Sangat Baik') {
      return <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">Sangat Baik</span>;
    }
    if (performance === 'Baik') {
      return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Baik</span>;
    }
    return <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">{performance}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Mahasiswa</h1>
        <p className="text-gray-600 mt-1">Kelola dan pantau mahasiswa yang menggunakan layanan tutoring</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Mahasiswa</h3>
          <p className="text-3xl font-bold text-gray-900">{tutorStudents.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Aktif Bulan Ini</h3>
          <p className="text-3xl font-bold text-accent">
            {tutorStudents.filter(s => new Date(s.lastSession).getMonth() === new Date().getMonth()).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Sesi</h3>
          <p className="text-3xl font-bold text-secondary">
            {tutorStudents.reduce((sum, s) => sum + s.sessionsAttended, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Rata-rata Sesi</h3>
          <p className="text-3xl font-bold text-primary">
            {(tutorStudents.reduce((sum, s) => sum + s.sessionsAttended, 0) / tutorStudents.length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari mahasiswa berdasarkan nama, NIM, atau jurusan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="relative min-w-[250px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Semua Mata Kuliah</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mahasiswa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  NIM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Jurusan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mata Kuliah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Jumlah Sesi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sesi Terakhir
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Performa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">Semester {student.semester}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-900">{student.nim}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{student.major}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      {student.enrolledSubject}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{student.sessionsAttended}</span>
                    <span className="text-sm text-gray-500"> sesi</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(student.lastSession).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getPerformanceBadge(student.performance)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => viewDetails(student)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">Mahasiswa Tidak Ditemukan</h3>
          <p className="text-gray-600">Tidak ada mahasiswa yang sesuai dengan pencarian Anda.</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Detail Mahasiswa</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedStudent.name}</h3>
                  <p className="text-gray-600 mb-2">{selectedStudent.nim}</p>
                  {getPerformanceBadge(selectedStudent.performance)}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Informasi Akademik</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Jurusan:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.major}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Semester:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.semester}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mata Kuliah:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.enrolledSubject}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Informasi Kontak</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Telepon:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Riwayat Tutoring</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Sesi Diikuti</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedStudent.sessionsAttended}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Sesi Terakhir</p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(selectedStudent.lastSession).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Feedback Diberikan:</span>
                      {selectedStudent.feedbackGiven ? (
                        <span className="text-accent font-medium">✓ Ya</span>
                      ) : (
                        <span className="text-gray-500">✗ Belum</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full mt-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}