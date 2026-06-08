import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, X, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

export function TutorSchedule() {
  const { showToast } = useNotification();
  const { bookings, availability, addAvailability, updateAvailability, deleteAvailability } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showAvailabilityManager, setShowAvailabilityManager] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any>(null);

  // Form state for adding/editing slots
  const [formDay, setFormDay] = useState('Senin');
  const [formStartTime, setFormStartTime] = useState('09:00');
  const [formEndTime, setFormEndTime] = useState('10:30');

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const tutorBookings = bookings.filter((b) => b.tutorId === '1' && b.status === 'confirmed');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSlot = {
      id: `AV${Date.now()}`,
      tutorId: '1',
      dayOfWeek: formDay,
      startTime: formStartTime,
      endTime: formEndTime,
      isAvailable: true,
    };

    addAvailability(newSlot);
    showToast('success', 'Slot Ditambahkan', `Ketersediaan ${formDay} ${formStartTime}-${formEndTime} telah ditambahkan.`);
    
    setShowAddSlot(false);
    setFormDay('Senin');
    setFormStartTime('09:00');
    setFormEndTime('10:30');
  };

  const handleEditSlot = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSlot) return;

    updateAvailability(editingSlot.id, {
      dayOfWeek: formDay,
      startTime: formStartTime,
      endTime: formEndTime,
    });

    showToast('success', 'Slot Diperbarui', 'Ketersediaan telah diperbarui.');
    setEditingSlot(null);
    setFormDay('Senin');
    setFormStartTime('09:00');
    setFormEndTime('10:30');
  };

  const handleDeleteSlot = (slotId: string) => {
    deleteAvailability(slotId);
    showToast('success', 'Slot Dihapus', 'Slot ketersediaan telah dihapus.');
  };

  const openEditModal = (slot: any) => {
    setEditingSlot(slot);
    setFormDay(slot.dayOfWeek);
    setFormStartTime(slot.startTime);
    setFormEndTime(slot.endTime);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jadwal & Ketersediaan</h1>
          <p className="text-gray-600 mt-1">Kelola ketersediaan dan sesi mendatang Anda</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAvailabilityManager(true)}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 flex items-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Atur Ketersediaan
          </button>
          <button
            onClick={() => setShowAddSlot(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Slot
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{tutorBookings.length}</h3>
          <p className="text-gray-600 text-sm">Sesi Mendatang</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{availability.length}</h3>
          <p className="text-gray-600 text-sm">Slot Tersedia</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {availability.length * 1.5}
          </h3>
          <p className="text-gray-600 text-sm">Jam/Minggu</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {new Set(availability.map(a => a.dayOfWeek)).size}
          </h3>
          <p className="text-gray-600 text-sm">Hari Aktif</p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900">Sesi Mendatang</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {tutorBookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.subject}</h3>
                    <p className="text-sm text-gray-600">{booking.tuteeName}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>
                        {new Date(booking.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </span>
                      <span>{booking.participants} mahasiswa</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Manager Modal */}
      {showAvailabilityManager && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900">Kelola Ketersediaan Mingguan</h3>
              <button
                onClick={() => setShowAvailabilityManager(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {daysOfWeek.map((day) => {
                const dayAvailability = availability.filter((av) => av.dayOfWeek === day);
                return (
                  <div key={day} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">{day}</span>
                      <button
                        onClick={() => {
                          setFormDay(day);
                          setShowAddSlot(true);
                          setShowAvailabilityManager(false);
                        }}
                        className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Slot
                      </button>
                    </div>

                    {dayAvailability.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">Tidak ada slot tersedia</p>
                    ) : (
                      <div className="space-y-2">
                        {dayAvailability.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {slot.startTime} - {slot.endTime}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                slot.isAvailable 
                                  ? 'bg-accent/20 text-accent' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {slot.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  openEditModal(slot);
                                  setShowAvailabilityManager(false);
                                }}
                                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                              >
                                <Edit2 className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSlot(slot.id)}
                                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setShowAvailabilityManager(false)}
                className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Single Slot Modal */}
      {(showAddSlot || editingSlot) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900">
                {editingSlot ? 'Edit Slot Ketersediaan' : 'Tambah Slot Ketersediaan'}
              </h3>
              <button
                onClick={() => {
                  setShowAddSlot(false);
                  setEditingSlot(null);
                  setFormDay('Senin');
                  setFormStartTime('09:00');
                  setFormEndTime('10:30');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingSlot ? handleEditSlot : handleAddSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hari</label>
                <select
                  value={formDay}
                  onChange={(e) => setFormDay(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {daysOfWeek.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Mulai
                </label>
                <input
                  type="time"
                  value={formStartTime}
                  onChange={(e) => setFormStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waktu Selesai
                </label>
                <input
                  type="time"
                  value={formEndTime}
                  onChange={(e) => setFormEndTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <strong>Pratinjau:</strong> {formDay}, {formStartTime} - {formEndTime}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSlot(false);
                    setEditingSlot(null);
                    setFormDay('Senin');
                    setFormStartTime('09:00');
                    setFormEndTime('10:30');
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  {editingSlot ? 'Simpan Perubahan' : 'Tambah Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
