import React, { useState } from 'react';
import { Search, FileText, Download, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

export function AdminMaterials() {
  const { materials, deleteMaterial, updateMaterial } = useData();
  const { showToast } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [viewingMaterial, setViewingMaterial] = useState<any>(null);

  const subjects = Array.from(new Set(materials.map((m) => m.subject)));

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.tutor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || material.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
      deleteMaterial(id);
      showToast('Materi berhasil dihapus', 'success');
    }
  };

  const handleApprove = (id: string) => {
    updateMaterial(id, { approved: true });
    showToast('Materi disetujui', 'success');
  };

  const handleReject = (id: string) => {
    updateMaterial(id, { approved: false });
    showToast('Materi ditolak', 'error');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Materi</h1>
        <p className="text-gray-600 mt-1">Kelola dan moderasi materi pembelajaran</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari materi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Semua Mata Kuliah</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Judul Materi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mata Kuliah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tutor
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Tanggal Upload
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Tidak ada materi ditemukan
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{material.title}</p>
                          <p className="text-xs text-gray-500">{material.type.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{material.subject}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{material.tutor}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">
                      {new Date(material.uploadDate).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {material.approved !== undefined ? (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            material.approved
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {material.approved ? 'Disetujui' : 'Ditolak'}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingMaterial(material)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Lihat"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {material.approved === undefined && (
                          <>
                            <button
                              onClick={() => handleApprove(material.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded"
                              title="Setujui"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(material.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                              title="Tolak"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Material Modal */}
      {viewingMaterial && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Detail Materi</h2>
              <button
                onClick={() => setViewingMaterial(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Judul</label>
                <p className="text-gray-900">{viewingMaterial.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Mata Kuliah</label>
                  <p className="text-gray-900">{viewingMaterial.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tutor</label>
                  <p className="text-gray-900">{viewingMaterial.tutor}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipe File</label>
                  <p className="text-gray-900">{viewingMaterial.type.toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tanggal Upload</label>
                  <p className="text-gray-900">
                    {new Date(viewingMaterial.uploadDate).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                <p className="text-gray-600">
                  {viewingMaterial.description || 'Tidak ada deskripsi'}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                {viewingMaterial.approved === undefined && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(viewingMaterial.id);
                        setViewingMaterial(null);
                      }}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Setujui Materi
                    </button>
                    <button
                      onClick={() => {
                        handleReject(viewingMaterial.id);
                        setViewingMaterial(null);
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Tolak Materi
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
