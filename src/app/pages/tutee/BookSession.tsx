import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronRight,
  Star,
  Calendar,
  Upload,
  CheckCircle,
  Users,
  DollarSign,
} from 'lucide-react';
import { subjects, tutors, pricingRules } from '../../data/mockData';
import { format, addDays } from 'date-fns';
import { useNotification } from '../../context/NotificationContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export function BookSession() {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const { addBooking, addNotification } = useData();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTutor, setSelectedTutor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [participants, setParticipants] = useState(1);
  const [materials, setMaterials] = useState<File[]>([]);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const selectedTutorData = tutors.find((t) => t.id === selectedTutor);

  // Calculate fee based on pricing rules
  const calculateFee = (numParticipants: number) => {
    if (numParticipants <= pricingRules.maxTuteesIncluded) {
      return pricingRules.baseFee;
    }
    const extraTutees = numParticipants - pricingRules.maxTuteesIncluded;
    return pricingRules.baseFee + (extraTutees * pricingRules.additionalTuteeFee);
  };

  const totalFee = calculateFee(participants);

  // Format currency in Indonesian Rupiah
  const formatRupiah = (amount: number) => {
    return `Rp${amount.toLocaleString('id-ID')}`;
  };

  const timeSlots = [
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  const handleSubmit = () => {
    const subjectName = subjects.find((s) => s.id === selectedSubject)?.name ?? '';
    const tutorName = selectedTutorData?.name ?? '';

    // Create booking record
    const newBooking = {
      id: `B${Date.now()}`,
      tuteeId: user?.id || '1',
      tuteeName: user?.name || 'Current User',
      tutorId: selectedTutor,
      tutorName: tutorName,
      subject: subjectName,
      date: selectedDate,
      time: selectedTime,
      duration: 1.5,
      status: 'pending_payment' as const,
      participants: participants,
      fee: totalFee,
      location: '',
      paymentProof: '',
    };

    // Save booking to database
    addBooking(newBooking);

    // Add notification for admin
    addNotification({
      id: `N${Date.now()}`,
      userId: '1',
      userRole: 'admin',
      type: 'payment',
      title: 'Booking Baru Menunggu Pembayaran',
      message: `${user?.name || 'Mahasiswa'} melakukan booking ${subjectName} dengan ${tutorName}`,
      icon: 'calendar',
      color: 'primary',
      timestamp: new Date().toISOString(),
      isRead: false,
      actionLabel: 'Verifikasi',
      actionUrl: '/admin/payments',
    });

    navigate('/tutee/booking-confirmation', {
      state: {
        bookingId: newBooking.id,
        subject: subjectName,
        tutor: tutorName,
        date: selectedDate,
        time: selectedTime,
        participants,
        totalFee,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          {[
            'Select Mata Kuliah',
            'Choose Tutor',
            'Pick Schedule',
            'Upload Materials',
            'Payment',
          ].map((label, index) => (
            <div key={label} className="flex items-center">
              <div
                className={`flex items-center gap-3 ${
                  index + 1 < step ? 'text-accent' : index + 1 === step ? 'text-primary' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    index + 1 < step
                      ? 'bg-accent/20'
                      : index + 1 === step
                      ? 'bg-primary/15'
                      : 'bg-gray-100'
                  }`}
                >
                  {index + 1 < step ? <CheckCircle className="w-5 h-5" /> : index + 1}
                </div>
                <span className="font-medium hidden md:block">{label}</span>
              </div>
              {index < 4 && (
                <ChevronRight className="w-5 h-5 text-gray-400 mx-2 md:mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Step 1: Select Mata Kuliah */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Mata Kuliah</h2>
            <p className="text-gray-600 mb-6">Choose the course you need help with</p>
            <div className="grid md:grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedSubject === subject.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.code}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Choose Tutor */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Tutor</h2>
            <p className="text-gray-600 mb-6">Select from available qualified tutors</p>
            <div className="space-y-4">
              {tutors.map((tutor) => (
                <button
                  key={tutor.id}
                  onClick={() => setSelectedTutor(tutor.id)}
                  className={`w-full p-6 rounded-lg border-2 text-left transition-colors ${
                    selectedTutor === tutor.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{tutor.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{tutor.bio}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {tutor.rating} ({tutor.reviews} reviews)
                        </span>
                        <span>{tutor.experience}</span>
                        <span className="font-semibold text-primary">
                          {formatRupiah(tutor.sessionRate)}/sesi
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {tutor.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Pick Schedule */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pick Schedule</h2>
            <p className="text-gray-600 mb-6">Select your preferred date and time</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-900 mb-3">Select Tanggal</label>
                <div className="space-y-2">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const date = addDays(new Date(), i + 1);
                    const dateStr = format(date, 'yyyy-MM-dd');
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                          selectedDate === dateStr
                            ? 'border-primary bg-primary/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">
                          {format(date, 'EEEE, MMMM d')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-900 mb-3">Select Waktu</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedTime === time
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="block font-medium text-gray-900 mb-3">
                    Jumlah Peserta
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-gray-900">{participants}</span>
                    <button
                      onClick={() => setParticipants(participants + 1)}
                      className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900 font-medium mb-2">Informasi Harga:</p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Biaya dasar: {formatRupiah(pricingRules.baseFee)} (hingga {pricingRules.maxTuteesIncluded} peserta)</li>
                      <li>• Biaya tambahan: {formatRupiah(pricingRules.additionalTuteeFee)} per peserta tambahan</li>
                      <li>• Durasi: {pricingRules.sessionDuration} jam per sesi</li>
                    </ul>
                    <div className="mt-2 pt-2 border-t border-blue-300">
                      <p className="text-sm font-bold text-blue-900">
                        Total untuk {participants} peserta: {formatRupiah(calculateFee(participants))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Upload Materials */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Study Materials</h2>
            <p className="text-gray-600 mb-6">
              Share any materials you'd like the tutor to review (optional)
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-sm text-gray-600 mb-4">PDF, DOC, or images up to 10MB</p>
              <input
                type="file"
                multiple
                onChange={(e) => setMaterials(Array.from(e.target.files || []))}
                className="hidden"
                id="materials-upload"
              />
              <label
                htmlFor="materials-upload"
                className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
              >
                Choose Files
              </label>
            </div>
            {materials.length > 0 && (
              <div className="mt-4 space-y-2">
                {materials.map((file, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="text-sm text-gray-900">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Payment */}
        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
            <p className="text-gray-600 mb-6">Review your booking and upload payment proof</p>

            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mata Kuliah:</span>
                  <span className="text-gray-900 font-medium">
                    {subjects.find((s) => s.id === selectedSubject)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tutor:</span>
                  <span className="text-gray-900 font-medium">{selectedTutorData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal & Waktu:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedDate} at {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durasi:</span>
                  <span className="text-gray-900 font-medium">{pricingRules.sessionDuration} jam</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peserta:</span>
                  <span className="text-gray-900 font-medium">{participants} orang</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Biaya Dasar:</span>
                  <span className="text-gray-900 font-medium">{formatRupiah(pricingRules.baseFee)}</span>
                </div>
                {participants > pricingRules.maxTuteesIncluded && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Tambahan:</span>
                    <span className="text-gray-900 font-medium">
                      {formatRupiah((participants - pricingRules.maxTuteesIncluded) * pricingRules.additionalTuteeFee)}
                      <span className="text-xs ml-1">
                        ({participants - pricingRules.maxTuteesIncluded} × {formatRupiah(pricingRules.additionalTuteeFee)})
                      </span>
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 mt-2 border-t border-gray-300">
                  <span className="text-gray-900 font-bold">Total Biaya:</span>
                  <span className="text-primary font-bold text-lg">{formatRupiah(totalFee)}</span>
                </div>
              </div>
            </div>

            {/* Upload Payment Proof */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Unggah Bukti Pembayaran</h3>
              <p className="text-sm text-gray-600 mb-4">
                Silakan transfer ke rekening berikut, lalu unggah bukti pembayaran:
                <br />
                <strong>Bank BCA - 1234567890 a.n. Economic Space</strong>
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <input
                  type="file"
                  onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                  className="hidden"
                  id="payment-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="payment-upload"
                  className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer"
                >
                  Upload Receipt
                </label>
                {paymentProof && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-accent">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">{paymentProof.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !selectedSubject) ||
                (step === 2 && !selectedTutor) ||
                (step === 3 && (!selectedDate || !selectedTime))
              }
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!paymentProof}
              className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Kirim Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
