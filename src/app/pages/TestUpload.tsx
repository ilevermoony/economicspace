import { useState } from 'react';
import { FileUpload, UploadedFile } from '../components/FileUpload';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function TestUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [savedFiles, setSavedFiles] = useState<UploadedFile[]>([]);

  const handleUpload = (files: UploadedFile[]) => {
    console.log('[TestUpload] Files received from FileUpload component:', files);
    setUploadedFiles(files);
  };

  const handleSave = () => {
    if (uploadedFiles.length === 0) {
      toast.error('Tidak ada file untuk disimpan');
      return;
    }

    console.log('[TestUpload] Saving files to state...', uploadedFiles);
    setSavedFiles([...savedFiles, ...uploadedFiles]);
    setUploadedFiles([]);
    toast.success(`${uploadedFiles.length} file berhasil disimpan!`);
  };

  const handleDelete = (fileId: string) => {
    setSavedFiles(savedFiles.filter(f => f.id !== fileId));
    toast.success('File dihapus');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#3D3B46] mb-2">
          Test Upload File
        </h1>
        <p className="text-gray-600">
          Halaman test untuk memverifikasi fungsi upload bekerja dengan baik
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Coba upload gambar (JPG, PNG) atau PDF untuk test
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload
            onUpload={handleUpload}
            maxFiles={5}
            maxSizeMB={10}
            existingFiles={uploadedFiles}
          />

          {uploadedFiles.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                className="bg-[#915D16] hover:bg-[#7A4D12]"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Simpan {uploadedFiles.length} File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Files Preview */}
      <Card>
        <CardHeader>
          <CardTitle>File yang Tersimpan ({savedFiles.length})</CardTitle>
          <CardDescription>
            Preview file yang sudah disimpan (data tersimpan di state)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {savedFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Belum ada file yang tersimpan</p>
              <p className="text-sm mt-2">Upload file di atas dan klik "Simpan File"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    {/* Preview */}
                    <div className="mb-3">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.dataUrl}
                          alt={file.name}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90"
                          onClick={() => {
                            // Open in new tab
                            const win = window.open();
                            if (win) {
                              win.document.write(`
                                <html>
                                  <head><title>${file.name}</title></head>
                                  <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#000;">
                                    <img src="${file.dataUrl}" style="max-width:100%;max-height:100vh;"/>
                                  </body>
                                </html>
                              `);
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-gray-600">PDF Document</p>
                          <a
                            href={file.dataUrl}
                            download={file.name}
                            className="text-xs text-blue-600 hover:underline mt-2"
                          >
                            Download
                          </a>
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="space-y-2">
                      <p className="font-medium text-sm truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        <span>{file.type}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Upload: {file.uploadedAt.toLocaleString('id-ID')}
                      </div>

                      {/* Data URL Info */}
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <p className="font-medium text-green-800">✅ Data URL Generated</p>
                        <p className="text-green-600 truncate">
                          Length: {file.dataUrl.length.toLocaleString()} characters
                        </p>
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Info */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm font-mono">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-gray-600">Files in upload state:</p>
                <p className="font-bold text-lg">{uploadedFiles.length}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-gray-600">Files saved:</p>
                <p className="font-bold text-lg">{savedFiles.length}</p>
              </div>
            </div>

            {savedFiles.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="font-medium text-blue-800 mb-2">Console Output:</p>
                <p className="text-xs text-blue-600">
                  Buka Developer Console (F12) untuk melihat log detail dari proses upload
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
