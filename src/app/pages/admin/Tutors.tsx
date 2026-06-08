import React, { useState } from 'react';
import { Search, Star, Phone, Mail, BookOpen, Eye, Edit } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function AdminTutors() {
  const { tutors, updateTutor } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const viewDetails = (tutor: any) => {
    setSelectedTutor(tutor);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">Aktif</span>;
    }
    return <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">Nonaktif</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Tutor</h1>
        <p className="text-gray-600 mt-1">Kelola dan pantau tutor Economic Space</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Tutor</h3>
          <p className="text-3xl font-bold text-gray-900">{tutors.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Tutor Aktif</h3>
          <p className="text-3xl font-bold text-accent">{tutors.filter(t => t.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Rata-rata Rating</h3>
          <p className="text-3xl font-bold text-secondary">
            {(tutors.reduce((sum, t) => sum + t.rating, 0) / tutors.length).toFixed(1)}★
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Sesi</h3>
          <p className="text-3xl font-bold text-primary">
            {tutors.reduce((sum, t) => sum + t.totalSessions, 0)}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari tutor berdasarkan nama atau mata kuliah..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Tutors Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tutor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mata Kuliah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Sesi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTutors.map((tutor) => (
                <tr key={tutor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tutor.avatar}
                        alt={tutor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{tutor.name}</p>
                        <p className="text-sm text-gray-500">{tutor.experience}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {tutor.specializations.map((spec: string, idx: number) => (
                        <span key={idx} className="text-sm text-gray-600 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {tutor.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {tutor.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{tutor.totalSessions}</span>
                    <span className="text-sm text-gray-500"> sesi</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{tutor.rating}</span>
                      <span className="text-sm text-gray-500">({tutor.reviews})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(tutor.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewDetails(tutor)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Data"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTutors.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">Tutor Tidak Ditemukan</h3>
          <p className="text-gray-600">Tidak ada tutor yang sesuai dengan pencarian Anda.</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedTutor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Detail Tutor</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={selectedTutor.avatar}
                  alt={selectedTutor.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedTutor.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{selectedTutor.rating}</span>
                    <span className="text-sm text-gray-500">({selectedTutor.reviews} ulasan)</span>
                  </div>
                  {getStatusBadge(selectedTutor.status)}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Informasi Kontak</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{selectedTutor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{selectedTutor.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Mata Kuliah yang Diajar</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedTutor.specializations.map((spec: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Statistik</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Total Sesi</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedTutor.totalSessions}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Pengalaman</p>
                      <p className="text-2xl font-bold text-gray-900">{selectedTutor.experience}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tentang</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 text-sm">{selectedTutor.bio}</p>
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