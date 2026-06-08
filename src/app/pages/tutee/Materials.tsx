import React, { useState } from 'react';
import { Download, FileText, Lock, CheckCircle, Search } from 'lucide-react';
import { materials, sessions } from '../../data/mockData';

export function TuteeMaterials() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasCompletedFeedback = (subject: string) => {
    return sessions.some(
      (s) => s.subject === subject && s.feedbackSubmitted
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Materials</h1>
        <p className="text-gray-600 mt-1">
          Access study materials after submitting session feedback
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari materi..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-primary mb-1">How to unlock materials</h3>
          <p className="text-sm text-primary">
            Materials are unlocked after you complete a session and submit feedback. Kirim
            feedback for your completed sessions to access more learning resources.
          </p>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const isUnlocked = hasCompletedFeedback(material.subject);
          return (
            <div
              key={material.id}
              className={`bg-white rounded-xl border border-gray-200 p-6 ${
                isUnlocked ? 'hover:shadow-md' : 'opacity-75'
              } transition-shadow`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isUnlocked ? 'bg-primary/15' : 'bg-gray-100'
                  }`}
                >
                  {isUnlocked ? (
                    <FileText className="w-6 h-6 text-primary" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {material.type}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 mb-2">{material.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{material.subject}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{material.size}</span>
                <span>{material.downloads} downloads</span>
              </div>

              {isUnlocked ? (
                <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Locked
                </button>
              )}

              <p className="text-xs text-gray-500 mt-2 text-center">
                {isUnlocked
                  ? `Uploaded by ${material.uploadedBy}`
                  : 'Kirim feedback to unlock'}
              </p>
            </div>
          );
        })}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">No materials found</h3>
          <p className="text-gray-600">Try searching with different keywords.</p>
        </div>
      )}
    </div>
  );
}
