import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { CheckCircle, XCircle, Eye, Shield, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from 'sonner';
import { UploadedFile } from '../../components/FileUpload';

export function EvidenceVerification() {
  const { user } = useAuth();
  const { sessions, sessionEvidences, updateSessionEvidence } = useData();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationAction, setVerificationAction] = useState<'approve' | 'reject' | null>(null);

  // Filter evidences
  const filteredEvidences = useMemo(() => {
    let filtered = [...sessionEvidences];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ev => ev.status === statusFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return filtered;
  }, [sessionEvidences, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: sessionEvidences.length,
      pending: sessionEvidences.filter(e => e.status === 'pending').length,
      approved: sessionEvidences.filter(e => e.status === 'approved').length,
      rejected: sessionEvidences.filter(e => e.status === 'rejected').length,
    };
  }, [sessionEvidences]);

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

  const handleViewEvidence = (evidence: any) => {
    setSelectedEvidence(evidence);
    setViewDialogOpen(true);
  };

  const handleOpenVerifyDialog = (evidence: any, action: 'approve' | 'reject') => {
    setSelectedEvidence(evidence);
    setVerificationAction(action);
    setVerificationNotes('');
    setVerifyDialogOpen(true);
  };

  const handleSubmitVerification = () => {
    if (!selectedEvidence || !verificationAction) return;

    const updatedEvidence = {
      status: verificationAction === 'approve' ? 'approved' : 'rejected',
      verifiedBy: user?.email || '',
      verifiedAt: new Date().toISOString(),
      verificationNotes: verificationNotes.trim() || undefined,
    };

    updateSessionEvidence(selectedEvidence.id, updatedEvidence);

    toast.success(
      verificationAction === 'approve'
        ? 'Bukti pelaksanaan disetujui'
        : 'Bukti pelaksanaan ditolak'
    );

    setVerifyDialogOpen(false);
    setSelectedEvidence(null);
    setVerificationAction(null);
    setVerificationNotes('');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3D3B46]">Verifikasi Bukti Pelaksanaan</h1>
          <p className="text-gray-600">Review dan verifikasi bukti pelaksanaan tutoring dari tutor</p>
        </div>
        <Shield className="w-10 h-10 text-[#915D16]" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bukti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3D3B46]">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Menunggu Verifikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Disetujui</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ditolak</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter Status:</label>
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu Verifikasi</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Evidence List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Bukti Pelaksanaan ({filteredEvidences.length})</CardTitle>
          <CardDescription>Review bukti pelaksanaan dari tutor</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvidences.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Tidak ada bukti pelaksanaan dengan filter ini</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvidences.map((evidence) => {
                const session = getSessionInfo(evidence.sessionId);
                return (
                  <div
                    key={evidence.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-[#3D3B46]">
                            {session?.subject || 'Unknown Session'}
                          </h3>
                          {getStatusBadge(evidence.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Tutor: {session?.tutor || 'Unknown'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Sesi: {session ? format(new Date(session.date), 'dd MMM yyyy', { locale: localeId }) : '-'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Upload: {format(new Date(evidence.uploadedAt), 'dd MMM yyyy HH:mm', { locale: localeId })}
                          </div>
                          <div>{evidence.files.length} file</div>
                        </div>

                        {evidence.description && (
                          <p className="text-sm text-gray-600 mb-2">{evidence.description}</p>
                        )}

                        {evidence.status !== 'pending' && evidence.verifiedBy && (
                          <p className={`text-xs mt-2 ${evidence.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                            {evidence.status === 'approved' ? 'Disetujui' : 'Ditolak'} oleh {evidence.verifiedBy} pada{' '}
                            {format(new Date(evidence.verifiedAt), 'dd MMM yyyy HH:mm', { locale: localeId })}
                            {evidence.verificationNotes && ` - ${evidence.verificationNotes}`}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEvidence(evidence)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Lihat
                        </Button>

                        {evidence.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleOpenVerifyDialog(evidence, 'approve')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Setujui
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleOpenVerifyDialog(evidence, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Tolak
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

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

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p>Tutor: {getSessionInfo(selectedEvidence.sessionId)?.tutor}</p>
                  <p>
                    Tanggal Sesi:{' '}
                    {getSessionInfo(selectedEvidence.sessionId)
                      ? format(new Date(getSessionInfo(selectedEvidence.sessionId)!.date), 'dd MMMM yyyy', { locale: localeId })
                      : '-'}
                  </p>
                  <p>
                    Upload:{' '}
                    {format(new Date(selectedEvidence.uploadedAt), 'dd MMMM yyyy HH:mm', {
                      locale: localeId,
                    })}
                  </p>
                  <p>Jumlah File: {selectedEvidence.files.length}</p>
                </div>

                {selectedEvidence.description && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Deskripsi:</p>
                    <p className="text-sm text-gray-600 mt-1">{selectedEvidence.description}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-3">
                  File Bukti Pelaksanaan ({selectedEvidence.files.length})
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedEvidence.files.map((file: UploadedFile) => (
                    <div key={file.id} className="border rounded-lg p-2">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.dataUrl}
                          alt={file.name}
                          className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-90"
                          onClick={() => window.open(file.dataUrl, '_blank')}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded flex items-center justify-center">
                          <p className="text-gray-500 text-sm">PDF File</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-600 mt-2 truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedEvidence?.status === 'pending' && (
              <>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleOpenVerifyDialog(selectedEvidence, 'approve');
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Setujui
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleOpenVerifyDialog(selectedEvidence, 'reject');
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verification Dialog */}
      <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verificationAction === 'approve' ? 'Setujui Bukti Pelaksanaan' : 'Tolak Bukti Pelaksanaan'}
            </DialogTitle>
            <DialogDescription>
              {verificationAction === 'approve'
                ? 'Konfirmasi bahwa bukti pelaksanaan valid dan sesi tutoring telah dilaksanakan'
                : 'Berikan alasan penolakan bukti pelaksanaan'}
            </DialogDescription>
          </DialogHeader>

          {selectedEvidence && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium">
                  {getSessionInfo(selectedEvidence.sessionId)?.subject}
                </p>
                <p className="text-xs text-gray-500">
                  Tutor: {getSessionInfo(selectedEvidence.sessionId)?.tutor}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan {verificationAction === 'reject' && '(Wajib)'}
                </label>
                <Textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder={
                    verificationAction === 'approve'
                      ? 'Tambahkan catatan (opsional)...'
                      : 'Jelaskan alasan penolakan...'
                  }
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setVerifyDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleSubmitVerification}
              className={
                verificationAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
              disabled={verificationAction === 'reject' && !verificationNotes.trim()}
            >
              {verificationAction === 'approve' ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Setujui
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
