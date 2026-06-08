import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { CheckCircle, BookOpen, User, Calendar, Clock, AlertCircle, LayoutDashboard, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface BookingData {
  subject: string;
  tutor: string;
  date: string;
  time: string;
  participants: number;
  totalFee: number;
}

export function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state as BookingData | null;

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-gray-500">Data booking tidak ditemukan.</p>
        <button
          onClick={() => navigate('/tutee/book')}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Kembali ke Pemesanan
        </button>
      </div>
    );
  }

  const formattedDate = (() => {
    try {
      return format(parseISO(booking.date), 'EEEE, d MMMM yyyy', { locale: id });
    } catch {
      return booking.date;
    }
  })();

  const formatRupiah = (amount: number) =>
    `Rp${amount.toLocaleString('id-ID')}`;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Success Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6 shadow-sm">
        <div className="w-16 h-16 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-9 h-9 text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Berhasil Dikirim!</h1>
        <p className="text-gray-500">
          Terima kasih! Booking kamu sudah kami terima dan sedang menunggu konfirmasi.
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-5">Ringkasan Booking</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Mata Kuliah</p>
              <p className="font-semibold text-gray-900">{booking.subject}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-accent/15 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <User className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Tutor</p>
              <p className="font-semibold text-gray-900">{booking.tutor}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Jadwal</p>
              <p className="font-semibold text-gray-900">{formattedDate}</p>
              <p className="text-sm text-gray-600">{booking.time} · Durasi 1,5 jam</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-[#F9F3ED] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-4 h-4 text-[#C88A3E]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Status</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full text-sm font-medium">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                Menunggu Konfirmasi Pembayaran
              </span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center">
            <span className="text-gray-600 text-sm">Total Biaya ({booking.participants} peserta)</span>
            <span className="font-bold text-primary text-lg">{formatRupiah(booking.totalFee)}</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          Bukti pembayaran kamu sedang diperiksa. Kamu akan mendapat notifikasi segera
          setelah booking dikonfirmasi. Proses ini biasanya selesai dalam 1×24 jam.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/tutee/dashboard')}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
        >
          <LayoutDashboard className="w-4 h-4" />
          Kembali ke Dashboard
        </button>
        <button
          onClick={() => navigate('/tutee/sessions')}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <FileText className="w-4 h-4" />
          Lihat Detail Booking
        </button>
      </div>
    </div>
  );
}
