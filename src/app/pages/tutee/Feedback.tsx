import React, { useState } from 'react';
import { Star, Send, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';

export function TuteeFeedback() {
  const { showToast } = useNotification();
  const { sessions, updateSession } = useData();
  const [selectedSession, setSelectedSession] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [topicCovered, setTopicCovered] = useState('');
  const [wouldRebook, setWouldRebook] = useState('');

  const pendingSessions = sessions.filter((s) => !s.feedbackSubmitted);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update session with feedback
    updateSession(selectedSession, {
      feedbackSubmitted: true,
      materialsUnlocked: true
    });

    setSubmitted(true);
    showToast('success', 'Feedback Berhasil Dikirim', 'Terima kasih atas evaluasi Anda. Materi pembelajaran sekarang dapat diakses.');
    setTimeout(() => {
      setSubmitted(false);
      setSelectedSession('');
      setRating(0);
      setFeedback('');
      setTopicCovered('');
      setWouldRebook('');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kirim Feedback</h1>
        <p className="text-gray-600 mt-1">
          Share your experience and unlock learning materials
        </p>
      </div>

      {submitted && (
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-accent" />
          <div>
            <h3 className="font-semibold text-accent">Feedback submitted!</h3>
            <p className="text-sm text-accent">
              Thank you for your feedback. Materials are now unlocked.
            </p>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Session */}
          <div>
            <label className="block font-medium text-gray-900 mb-3">
              Select Selesai Session
            </label>
            <div className="space-y-3">
              {pendingSessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => setSelectedSession(session.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedSession === session.id
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900">{session.subject}</h3>
                  <p className="text-sm text-gray-600">
                    with {session.tutor} •{' '}
                    {new Date(session.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {selectedSession && (
            <>
              {/* Rating */}
              <div>
                <label className="block font-medium text-gray-900 mb-3">
                  Rate Your Experience
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-2 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          value <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {rating === 5 && 'Excellent!'}
                    {rating === 4 && 'Very Good!'}
                    {rating === 3 && 'Good'}
                    {rating === 2 && 'Fair'}
                    {rating === 1 && 'Needs Improvement'}
                  </p>
                )}
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block font-medium text-gray-900 mb-3">
                  Your Feedback (Optional)
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  placeholder="Share your thoughts about the session, what you learned, and suggestions for improvement..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {feedback.length} characters
                </p>
              </div>

              {/* Additional Questions */}
              <div className="space-y-5">
                <h3 className="font-medium text-gray-900">Pertanyaan Tambahan</h3>

                <div>
                  <label className="block text-sm text-gray-700 mb-3">
                    Apakah tutor membahas topik yang Anda butuhkan?
                  </label>
                  <div className="flex gap-3">
                    {(['Ya', 'Sebagian', 'Tidak'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTopicCovered(option)}
                        className={`flex-1 px-4 py-2 border-2 rounded-lg transition-colors font-medium text-sm ${
                          topicCovered === option
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-3">
                    Apakah Anda akan menggunakan tutor ini kembali?
                  </label>
                  <div className="flex gap-3">
                    {(['Tentu', 'Mungkin', 'Tidak'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setWouldRebook(option)}
                        className={`flex-1 px-4 py-2 border-2 rounded-lg transition-colors font-medium text-sm ${
                          wouldRebook === option
                            ? 'border-primary bg-primary text-white'
                            : 'border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kirim Button */}
              <button
                type="submit"
                disabled={rating === 0}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
              >
                <Send className="w-5 h-5" />
                Kirim Feedback
              </button>
            </>
          )}
        </form>
      </div>

      {pendingSessions.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">You've submitted feedback for all completed sessions.</p>
        </div>
      )}
    </div>
  );
}