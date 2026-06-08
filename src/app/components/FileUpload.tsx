import { useState, useRef } from 'react';
import { Upload, X, FileImage, File as FileIcon, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
  existingFiles?: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  uploadedAt: Date;
}

export function FileUpload({
  onUpload,
  maxFiles = 5,
  maxSizeMB = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  existingFiles = []
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type ${file.type} tidak didukung. Gunakan: ${acceptedTypes.join(', ')}`;
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB`;
    }

    // Check total files
    if (files.length >= maxFiles) {
      return `Maksimal ${maxFiles} file`;
    }

    return null;
  };

  const processFiles = async (fileList: FileList) => {
    setError('');
    const newFiles: UploadedFile[] = [];

    console.log(`[FileUpload] Processing ${fileList.length} files...`);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      console.log(`[FileUpload] Processing file: ${file.name} (${file.type}, ${file.size} bytes)`);

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        console.error(`[FileUpload] Validation error: ${validationError}`);
        setError(validationError);
        continue;
      }

      // Convert to data URL
      try {
        const dataUrl = await fileToDataUrl(file);
        console.log(`[FileUpload] Successfully converted ${file.name} to data URL (length: ${dataUrl.length})`);

        const uploadedFile: UploadedFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl,
          uploadedAt: new Date()
        };

        newFiles.push(uploadedFile);
      } catch (error) {
        console.error(`[FileUpload] Error converting file ${file.name}:`, error);
        setError(`Gagal memproses file ${file.name}`);
      }
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
      console.log(`[FileUpload] Total files after upload: ${updatedFiles.length}`);
      setFiles(updatedFiles);
      onUpload(updatedFiles);
      console.log('[FileUpload] ✅ Files uploaded successfully and callback triggered');
    } else {
      console.log('[FileUpload] ⚠️ No new files were added');
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <FileImage className="w-8 h-8 text-blue-600" />;
    }
    return <FileIcon className="w-8 h-8 text-gray-600" />;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-[#915D16] bg-[#915D16]/5'
            : 'border-gray-300 hover:border-[#915D16]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drag & drop file atau klik untuk upload
        </p>
        <p className="text-sm text-gray-500 mb-4">
          JPG, PNG, atau PDF (max {maxSizeMB}MB per file, max {maxFiles} files)
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="hidden"
        />

        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-[#915D16] hover:bg-[#7A4D12]"
        >
          Pilih File
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">
            File Terupload ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center gap-3">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.dataUrl}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Success Icon */}
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
