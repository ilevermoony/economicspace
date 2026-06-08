import React, { useState } from 'react';
import { DollarSign, Calendar, CheckCircle, Clock, Download, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { payrollRules } from '../../data/mockData';
import { useNotification } from '../../context/NotificationContext';

export function AdminPayroll() {
  const { showToast } = useNotification();
  const { payroll, tutors, updatePayroll, addNotification } = useData();
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredPayroll = payroll.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const viewDetails = (payrollItem: any) => {
    setSelectedPayroll(payrollItem);
    setShowDetailModal(true);
  };

  const handlePayment = (payrollItem: any) => {
    // Update payroll status to paid
    updatePayroll(payrollItem.id, {
      status: 'paid',
      paidDate: new Date().toISOString().split('T')[0],
    });

    // Add notification for tutor
    addNotification({
      id: `N${Date.now()}`,
      userId: payrollItem.tutorId,
      userRole: 'tutor',
      type: 'payment',
      title: 'Gaji Telah Dibayar',
      message: `Gaji Anda sebesar Rp${payrollItem.totalEarnings.toLocaleString('id-ID')} untuk periode ${payrollItem.month} telah diproses.`,
      icon: 'check-circle',
      color: 'accent',
      timestamp: new Date().toISOString(),
      isRead: false,
      actionLabel: 'Lihat Detail',
      actionUrl: '/tutor/dashboard',
    });

    showToast('success', 'Pembayaran Berhasil', `Gaji ${payrollItem.tutorName} sebesar Rp${payrollItem.totalEarnings.toLocaleString('id-ID')} telah diproses.`);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Dibayar
      </span>;
    }
    return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
      <Clock className="w-3 h-3" />
      Pending
    </span>;
  };

  const totalPending = payroll.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.totalEarnings, 0);
  const totalPaid = payroll.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.totalEarnings, 0);
  const totalSessions = payroll.reduce((sum, p) => sum + p.sessionsCompleted, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Penggajian Tutor</h1>
        <p className="text-gray-600 mt-1">Kelola pembayaran honor tutor bulanan</p>
      </div>

      {/* Aturan Bisnis Info */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
        <h3 className="font-semibold text-primary mb-2">Aturan Penggajian</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• Tarif per sesi: <span className="font-semibold">Rp{payrollRules.tutorPayPerSession.toLocaleString('id-ID')}</span></p>
          <p>• Durasi sesi: <span className="font-semibold">1,5 jam</span></p>
          <p>• Pembayaran dilakukan setiap akhir bulan</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">
            Rp{totalPending.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Dibayar</h3>
          <p className="text-2xl font-bold text-accent">
            Rp{totalPaid.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Sesi</h3>
          <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Tutor Aktif</h3>
          <p className="text-2xl font-bold text-primary">{payroll.length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 inline-flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'paid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Dibayar
        </button>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nama Tutor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Periode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Jumlah Sesi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tarif/Sesi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Gaji
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
              {filteredPayroll.map((payrollItem) => (
                <tr key={payrollItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {payrollItem.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const tutor = tutors.find(t => t.id === payrollItem.tutorId);
                        return tutor ? (
                          <>
                            <img
                              src={tutor.avatar}
                              alt={payrollItem.tutorName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-medium text-gray-900">{payrollItem.tutorName}</span>
                          </>
                        ) : (
                          <span className="font-medium text-gray-900">{payrollItem.tutorName}</span>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {payrollItem.month}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{payrollItem.sessionsCompleted}</span>
                    <span className="text-sm text-gray-500"> sesi</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">
                      Rp{payrollRules.tutorPayPerSession.toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary">
                        Rp{payrollItem.totalEarnings.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {payrollItem.sessionsCompleted} × Rp{payrollRules.tutorPayPerSession.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(payrollItem.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewDetails(payrollItem)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payrollItem.status === 'pending' && (
                        <button
                          onClick={() => handlePayment(payrollItem)}
                          className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                          title="Proses Pembayaran"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Download Slip"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Detail Penggajian</h2>
              <p className="text-sm text-gray-600 mt-1">ID: {selectedPayroll.id}</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Tutor Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Informasi Tutor</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {(() => {
                      const tutor = tutors.find(t => t.id === selectedPayroll.tutorId);
                      return tutor ? (
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={tutor.avatar}
                            alt={selectedPayroll.tutorName}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{selectedPayroll.tutorName}</p>
                            <p className="text-sm text-gray-600">{tutor.email}</p>
                            <p className="text-sm text-gray-600">{tutor.phone}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="font-semibold text-gray-900 mb-2">{selectedPayroll.tutorName}</p>
                      );
                    })()}
                  </div>
                </div>

                {/* Periode */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Periode Penggajian</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{selectedPayroll.month}</span>
                    </div>
                  </div>
                </div>

                {/* Rincian */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Rincian Gaji</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Jumlah Sesi Selesai:</span>
                      <span className="font-semibold text-gray-900">{selectedPayroll.sessionsCompleted} sesi</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Jam Mengajar:</span>
                      <span className="font-semibold text-gray-900">{selectedPayroll.totalHours} jam</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tarif per Sesi:</span>
                      <span className="font-semibold text-gray-900">Rp{payrollRules.tutorPayPerSession.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total Gaji:</span>
                        <span className="text-2xl font-bold text-primary">
                          Rp{selectedPayroll.totalEarnings.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 text-right mt-1">
                        {selectedPayroll.sessionsCompleted} sesi × Rp{payrollRules.tutorPayPerSession.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Status Pembayaran</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedPayroll.status)}
                    </div>
                    {selectedPayroll.status === 'paid' && selectedPayroll.paidDate && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <span className="text-gray-600">Tanggal Dibayar:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(selectedPayroll.paidDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {selectedPayroll.status === 'pending' && (
                  <button
                    onClick={() => {
                      handlePayment(selectedPayroll);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-5 h-5" />
                    Proses Pembayaran
                  </button>
                )}
                <button
                  className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Slip
                </button>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full mt-3 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
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