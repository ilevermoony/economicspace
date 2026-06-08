import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { FileUpload, UploadedFile } from '../../components/FileUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Upload, CheckCircle, Clock, X, Eye, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from 'sonner';

export function TutorEvidence() {
  const { user } = useAuth();
  const { sessions, sessionEvidences, addSessionEvidence, updateSessionEvidence } = useData();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [description, setDescription] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);

  // Filter sesi yang perlu bukti upload
  const sessionsNeedingEvidence = useMemo(() => {
    const currentDate = new Date();

    return sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      const hasEvidence = sessionEvidences.some(ev => ev.sessionId === session.id);

      // Hanya tampilkan sesi yang sudah selesai atau hari ini
      return sessionDate <= currentDate && !hasEvidence && session.tutor === user?.name;
    });
  }, [sessions, sessionEvidences, user]);

  // Evidence yang sudah diupload
  const uploadedEvidences = useMemo(() => {
    return sessionEvidences.filter(ev => {
      const session = sessions.find(s => s.id === ev.sessionId);
      return session?.tutor === user?.name;
    });
  }, [sessionEvidences, sessions, user]);

  const handleOpenUploadDialog = (sessionId: string) => {
    setSelectedSession(sessionId);
    setUploadedFiles([]);
    setDescription('');
    setUploadDialogOpen(true);
  };

  const handleSubmitEvidence = () => {
    if (!selectedSession) {
      console.error('[TutorEvidence] No session selected');
      return;
    }

    if (uploadedFiles.length === 0) {
      console.warn('[TutorEvidence] No files uploaded');
      toast.error('Mohon upload minimal 1 file bukti');
      return;
    }

    const session = sessions.find(s => s.id === selectedSession);
    if (!session) {
      console.error('[TutorEvidence] Session not found:', selectedSession);
      return;
    }

    console.log('[TutorEvidence] Creating new evidence with files:', uploadedFiles);

    const newEvidence = {
      id: `EV${Date.now()}`,
      sessionId: selectedSession,
      bookingId: session.bookingId || '',
      tutorId: user?.id || '',
      uploadedAt: new Date().toISOString(),
      files: uploadedFiles,
      description: description.trim() || 'Bukti pelaksanaan tutoring',
      status: 'pending' as const,
      verifiedBy: null,
      verifiedAt: null,
    };

    console.log('[TutorEvidence] Evidence object to save:', {
      id: newEvidence.id,
      sessionId: newEvidence.sessionId,
      filesCount: newEvidence.files.length,
      totalDataSize: newEvidence.files.reduce((sum, f) => sum + f.dataUrl.length, 0),
    });

    addSessionEvidence(newEvidence);
    console.log('[TutorEvidence] ✅ Evidence saved to DataContext');

    toast.success(`Bukti pelaksanaan berhasil diupload (${uploadedFiles.length} file)`);
    setUploadDialogOpen(false);
    setSelectedSession(null);
    setUploadedFiles([]);
    setDescription('');
  };

  const handleViewEvidence = (evidence: any) => {
    setSelectedEvidence(evidence);
    setViewDialogOpen(true);
  };

  const getSessionInfo = (sessionId: string) => {
    return sessions.find(s => s.id === sessionId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Menunggu Verifikasi</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3D3B46]">Bukti Pelaksanaan Tutoring</h1>
          <p className="text-gray-600">Upload bukti pelaksanaan sesi tutoring</p>
        </div>
        <Upload className="w-10 h-10 text-[#915D16]" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Perlu Upload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {sessionsNeedingEvidence.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sudah Diupload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {uploadedEvidences.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Disetujui</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {uploadedEvidences.filter(e => e.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sesi yang Perlu Upload */}
      {sessionsNeedingEvidence.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sesi yang Perlu Upload Bukti ({sessionsNeedingEvidence.length})</CardTitle>
            <CardDescription>Upload bukti pelaksanaan untuk sesi berikut</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessionsNeedingEvidence.map((session) => (
                <div
                  key={session.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#3D3B46]">{session.subject}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(session.date), 'dd MMM yyyy', { locale: localeId })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.duration} jam
                        </div>
                      </div>
                      {session.tutee && (
                        <p className="text-sm text-gray-500 mt-1">Mahasiswa: {session.tutee}</p>
                      )}
                    </div>

                    <Button
                      onClick={() => handleOpenUploadDialog(session.id)}
                      className="bg-[#915D16] hover:bg-[#7A4D12]"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Bukti
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evidence yang Sudah Diupload */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Upload Bukti ({uploadedEvidences.length})</CardTitle>
          <CardDescription>Bukti pelaksanaan yang sudah diupload</CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedEvidences.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Upload className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Belum ada bukti pelaksanaan yang diupload</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploadedEvidences.map((evidence) => {
                const session = getSessionInfo(evidence.sessionId);
                return (
                  <div
                    key={evidence.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-[#3D3B46]">
                            {session?.subject || 'Unknown Session'}
                          </h3>
                          {getStatusBadge(evidence.status)}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(evidence.uploadedAt), 'dd MMM yyyy HH:mm', {
                              locale: localeId,
                            })}
                          </div>
                          <div>{evidence.files.length} file</div>
                        </div>

                        {evidence.description && (
                          <p className="text-sm text-gray-600 mt-2">{evidence.description}</p>
                        )}

                        {evidence.status === 'approved' && evidence.verifiedBy && (
                          <p className="text-xs text-green-600 mt-2">
                            Diverifikasi oleh {evidence.verifiedBy} pada{' '}
                            {format(new Date(evidence.verifiedAt), 'dd MMM yyyy HH:mm', {
                              locale: localeId,
                            })}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewEvidence(evidence)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Bukti Pelaksanaan</DialogTitle>
            <DialogDescription>
              Upload foto atau dokumen sebagai bukti pelaksanaan sesi tutoring
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedSession && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  {sessions.find(s => s.id === selectedSession)?.subject}
                </p>
                <p className="text-xs text-gray-500">
                  {format(
                    new Date(sessions.find(s => s.id === selectedSession)?.date || new Date()),
                    'dd MMMM yyyy',
                    { locale: localeId }
                  )}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi (Opsional)
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tambahkan catatan atau keterangan..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>
              <FileUpload
                onUpload={setUploadedFiles}
                maxFiles={5}
                maxSizeMB={10}
                existingFiles={uploadedFiles}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSubmitEvidence}
              className="bg-[#915D16] hover:bg-[#7A4D12]"
              disabled={uploadedFiles.length === 0}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Upload Bukti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Evidence Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Bukti Pelaksanaan</DialogTitle>
          </DialogHeader>

          {selectedEvidence && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {getSessionInfo(selectedEvidence.sessionId)?.subject}
                  </h3>
                  {getStatusBadge(selectedEvidence.status)}
                </div>

                <p className="text-sm text-gray-600">
                  Diupload pada:{' '}
                  {format(new Date(selectedEvidence.uploadedAt), 'dd MMMM yyyy HH:mm', {
                    locale: localeId,
                  })}
                </p>

                {selectedEvidence.description && (
                  <p className="text-sm text-gray-700 mt-2">{selectedEvidence.description}</p>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-3">File Terupload ({selectedEvidence.files.length})</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedEvidence.files.map((file: UploadedFile) => (
                    <div key={file.id} className="border rounded-lg p-2">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.dataUrl}
                          alt={file.name}
                          className="w-full h-48 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center">
                          <p className="text-gray-500 text-sm">PDF File</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-600 mt-2 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
