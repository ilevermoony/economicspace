import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Download, X, Calendar, User, DollarSign, FileText } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

export function AdminPayments() {
  const { showToast } = useNotification();
  const { bookings, updateBooking, addNotification } = useData();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const pendingPayments = bookings.filter((b) => b.status === 'verification');

  const filteredPayments = pendingPayments.filter((payment) => {
    if (filter === 'pending') return true;
    // In real app, would filter by actual status
    return true;
  });

  const viewProof = (payment: any) => {
    setSelectedPayment(payment);
    setShowProofModal(true);
  };

  const handleApprove = (payment: any) => {
    // Update booking status
    updateBooking(payment.id, { status: 'confirmed' });
    
    // Add notification for tutee
    addNotification({
      id: `N${Date.now()}`,
      userId: payment.tuteeId,
      userRole: 'tutee',
      type: 'payment',
      title: 'Pembayaran Berhasil Diverifikasi',
      message: `Pembayaran Anda untuk sesi ${payment.subject} tanggal ${new Date(payment.date).toLocaleDateString('id-ID')} telah disetujui.`,
      icon: 'check-circle',
      color: 'accent',
      timestamp: new Date().toISOString(),
      isRead: false,
      actionLabel: 'Lihat Sesi',
      actionUrl: '/tutee/sessions',
    });

    showToast('success', 'Pembayaran Disetujui', `Pembayaran dari ${payment.tuteeName} sebesar Rp${payment.fee.toLocaleString('id-ID')} telah disetujui.`);
    setShowProofModal(false);
  };

  const openRejectModal = (payment: any) => {
    setSelectedPayment(payment);
    setShowProofModal(false);
    setShowRejectModal(true);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      showToast('error', 'Alasan Diperlukan', 'Mohon berikan alasan penolakan.');
      return;
    }

    // Update booking status
    updateBooking(selectedPayment.id, { status: 'rejected' });

    // Add notification for tutee
    addNotification({
      id: `N${Date.now()}`,
      userId: selectedPayment.tuteeId,
      userRole: 'tutee',
      type: 'payment',
      title: 'Pembayaran Ditolak',
      message: `Pembayaran Anda ditolak. Alasan: ${rejectReason}`,
      icon: 'x-circle',
      color: 'red',
      timestamp: new Date().toISOString(),
      isRead: false,
      actionLabel: 'Lihat Detail',
      actionUrl: '/tutee/sessions',
    });

    showToast('success', 'Pembayaran Ditolak', `Pembayaran dari ${selectedPayment.tuteeName} telah ditolak. Notifikasi telah dikirim.`);
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verifikasi Pembayaran</h1>
        <p className="text-gray-600 mt-1">Tinjau dan setujui bukti pembayaran</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Menunggu Verification</h3>
          <p className="text-3xl font-bold text-secondary">{pendingPayments.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Disetujui Today</h3>
          <p className="text-3xl font-bold text-accent">12</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Amount Menunggu</h3>
          <p className="text-3xl font-bold text-gray-900">
            Rp{pendingPayments.reduce((sum, p) => sum + p.fee, 0).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 inline-flex gap-2">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending' ? 'bg-secondary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Menunggu
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'approved' ? 'bg-secondary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Disetujui
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'rejected' ? 'bg-secondary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Ditolak
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-secondary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All
        </button>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tutor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mata Kuliah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment Proof
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{payment.tuteeName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.tutorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    Rp{payment.fee.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button 
                      onClick={() => viewProof(payment)}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Lihat Bukti
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApprove(payment)}
                        className="p-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
                        title="Setujui Pembayaran"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openRejectModal(payment)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Tolak Pembayaran"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No pending payment verifications.</p>
        </div>
      )}

      {/* Proof Modal */}
      {showProofModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Bukti Pembayaran</h2>
              <button 
                onClick={() => setShowProofModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Payment Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Detail Pembayaran</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Nama Mahasiswa:</span>
                    </div>
                    <span className="font-medium text-gray-900">{selectedPayment.tuteeName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="text-sm">Tutor:</span>
                    </div>
                    <span className="font-medium text-gray-900">{selectedPayment.tutorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">Mata Kuliah:</span>
                    </div>
                    <span className="font-medium text-gray-900">{selectedPayment.subject}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Tanggal Sesi:</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      {new Date(selectedPayment.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Jumlah Pembayaran:</span>
                    </div>
                    <span className="font-bold text-primary text-lg">
                      Rp{selectedPayment.fee.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Proof Image */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Bukti Transfer</h3>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">{selectedPayment.paymentProof}</p>
                      <p className="text-xs text-gray-400 mt-1">Gambar bukti pembayaran</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => handleApprove(selectedPayment)}
                  className="flex-1 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Setujui Pembayaran
                </button>
                <button 
                  onClick={() => openRejectModal(selectedPayment)}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Tolak Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Tolak Pembayaran</h2>
              <button 
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  Anda akan menolak pembayaran dari <strong>{selectedPayment.tuteeName}</strong> sebesar{' '}
                  <strong>Rp{selectedPayment.fee.toLocaleString('id-ID')}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Alasan Penolakan <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  placeholder="Berikan alasan penolakan yang jelas kepada mahasiswa..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Alasan ini akan dikirimkan ke mahasiswa melalui notifikasi
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Batal
                </button>
                <button 
                  onClick={handleReject}
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Tolak Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}