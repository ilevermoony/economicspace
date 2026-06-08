import React, { useState } from 'react';
import { Calendar, Clock, MapPin, FileText, Star } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function TuteeSessions() {
  const { bookings } = useData();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'upcoming') return ['confirmed', 'pending_payment', 'verification'].includes(booking.status);
    if (filter === 'completed') return booking.status === 'completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-accent/20 text-accent';
      case 'verification':
        return 'bg-secondary/10 text-secondary';
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-primary/15 text-primary';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
        <p className="text-gray-600 mt-1">View and manage your tutoring sessions</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 inline-flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          All Sessions
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'upcoming' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'completed' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Selesai
        </button>
      </div>

      {/* Sessions List */}
      <div className="grid gap-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{booking.subject}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">with {booking.tutorName}</p>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>
                      {booking.time} ({booking.duration} jam)
                    </span>
                  </div>
                  {booking.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{booking.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">Rp{booking.fee.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-6">
                {booking.status === 'confirmed' && (
                  <>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm whitespace-nowrap">
                      Lihat Detail
                    </button>
                    <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm whitespace-nowrap">
                      Contact Tutor
                    </button>
                  </>
                )}
                {booking.status === 'pending_payment' && (
                  <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 text-sm whitespace-nowrap">
                    Upload Payment
                  </button>
                )}
                {booking.status === 'verification' && (
                  <span className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm text-center">
                    Awaiting Verification
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600">You don't have any sessions matching this filter.</p>
        </div>
      )}
    </div>
  );
}