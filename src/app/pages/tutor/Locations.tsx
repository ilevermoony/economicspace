import React, { useState } from 'react';
import { MapPin, Plus, X, Calendar, Clock, Building, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

export function TutorLocations() {
  const { showToast } = useNotification();
  const { bookings, updateBooking } = useData();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [locationName, setLocationName] = useState('');
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [notes, setNotes] = useState('');

  // Filter sessions for tutor (confirmed bookings)
  const tutorSessions = bookings.filter((b) => b.tutorId === '1' && b.status === 'confirmed');
  const sessionsWithLocation = tutorSessions.filter(s => s.location);
  const sessionsWithoutLocation = tutorSessions.filter(s => !s.location);

  const openLocationModal = (session: any) => {
    setSelectedSession(session);
    setLocationName(session.location || '');
    // Parse existing location if available
    if (session.location) {
      const parts = session.location.split(', ');
      if (parts.length >= 2) {
        setRoom(parts[0].replace('Ruang ', ''));
        setBuilding(parts[1]);
      }
    }
    setShowLocationModal(true);
  };

  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSession) return;

    // Build location string
    const fullLocation = `Ruang ${room}, ${building}`;
    
    // Update booking with location
    updateBooking(selectedSession.id, {
      location: fullLocation,
    });

    showToast('success', 'Lokasi Berhasil Disimpan', 'Lokasi tutoring telah ditambahkan ke sesi.');
    
    // Reset form
    setShowLocationModal(false);
    setSelectedSession(null);
    setLocationName('');
    setBuilding('');
    setRoom('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lokasi Tutoring</h1>
          <p className="text-gray-600 mt-1">Atur lokasi untuk setiap sesi tutoring Anda</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
        <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Cara Mengatur Lokasi
        </h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>1. Pilih sesi tutoring dari daftar di bawah</p>
          <p>2. Klik "Atur Lokasi" untuk menambahkan atau mengubah lokasi</p>
          <p>3. Masukkan detail lokasi (gedung, ruangan, catatan)</p>
          <p>4. Mahasiswa akan melihat lokasi di detail sesi mereka</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{tutorSessions.length}</h3>
          <p className="text-gray-600 text-sm">Total Sesi</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-accent" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{sessionsWithLocation.length}</h3>
          <p className="text-gray-600 text-sm">Sudah Ada Lokasi</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-secondary" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{sessionsWithoutLocation.length}</h3>
          <p className="text-gray-600 text-sm">Perlu Lokasi</p>
        </div>
      </div>

      {/* Sessions Without Location */}
      {sessionsWithoutLocation.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              Sesi Perlu Lokasi ({sessionsWithoutLocation.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Sesi yang belum memiliki lokasi tutoring
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {sessionsWithoutLocation.map((session) => (
              <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{session.subject}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Mahasiswa: {session.tuteeName} • {session.participants} peserta
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.time}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openLocationModal(session)}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 text-sm font-medium"
                  >
                    <MapPin className="w-4 h-4" />
                    Atur Lokasi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sessions With Location */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            Sesi dengan Lokasi ({sessionsWithLocation.length})
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Sesi yang sudah memiliki lokasi tutoring
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          {sessionsWithLocation.length === 0 ? (
            <div className="p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-900 mb-2">Belum Ada Lokasi</h3>
              <p className="text-gray-600">Atur lokasi untuk sesi di atas untuk memulai.</p>
            </div>
          ) : (
            sessionsWithLocation.map((session) => (
              <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{session.subject}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Mahasiswa: {session.tuteeName} • {session.participants} peserta
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(session.date).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {session.time}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 bg-accent/10 border border-accent/20 rounded-lg p-3">
                      <MapPin className="w-4 h-4 text-accent mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-accent">Lokasi Tutoring</p>
                        <p className="text-sm text-gray-700">{session.location}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => openLocationModal(session)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm font-medium ml-4"
                  >
                    <MapPin className="w-4 h-4" />
                    Ubah Lokasi
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-gray-900">
                {selectedSession.location ? 'Ubah Lokasi Tutoring' : 'Atur Lokasi Tutoring'}
              </h3>
              <button
                onClick={() => {
                  setShowLocationModal(false);
                  setSelectedSession(null);
                  setLocationName('');
                  setBuilding('');
                  setRoom('');
                  setNotes('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-1">{selectedSession.subject}</h4>
              <p className="text-sm text-gray-600">{selectedSession.tuteeName}</p>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                <span>
                  {new Date(selectedSession.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
                <span>•</span>
                <span>{selectedSession.time}</span>
                <span>•</span>
                <span>{selectedSession.participants} peserta</span>
              </div>
            </div>

            <form onSubmit={handleSaveLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Gedung <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Contoh: Gedung Ekonomi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Ruangan <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Contoh: 205 atau 3A"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Contoh: Lantai 2, dekat tangga utama"
                />
              </div>

              {/* Preview */}
              {building && room && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-accent mt-0.5" />
                    <span>
                      <strong>Pratinjau:</strong> Ruang {room}, {building}
                      {notes && <><br /><span className="text-xs text-gray-600">{notes}</span></>}
                    </span>
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowLocationModal(false);
                    setSelectedSession(null);
                    setLocationName('');
                    setBuilding('');
                    setRoom('');
                    setNotes('');
                  }}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Simpan Lokasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
