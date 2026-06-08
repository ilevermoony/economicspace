# Testing Upload Bukti Pelaksanaan Tutoring

## 🧪 Cara Testing Upload Functionality

### Method 1: Test Upload Page (Standalone Testing)

1. **Akses Test Page**
   - URL: `/test-upload`
   - Page ini khusus untuk testing upload tanpa login

2. **Upload File**
   - Drag & drop file gambar (JPG/PNG) atau PDF
   - Atau klik "Pilih File" untuk browse
   - Maksimal 5 file, masing-masing max 10MB

3. **Verifikasi Upload Berhasil**
   - File akan muncul di section "File Terupload"
   - Preview gambar akan ditampilkan
   - Info file (nama, size, type) akan muncul
   - Checkmark hijau menandakan upload berhasil

4. **Simpan File**
   - Klik button "Simpan X File"
   - File akan dipindah ke section "File yang Tersimpan"

5. **Verifikasi Data**
   - ✅ Preview image bisa diklik untuk full screen
   - ✅ Data URL generated (lihat "Data URL Generated" badge)
   - ✅ File info lengkap ditampilkan
   - ✅ Bisa dihapus dengan button "Hapus"

6. **Check Console Logs**
   - Buka Developer Tools (F12)
   - Tab Console
   - Lihat log detail proses upload:
     ```
     [FileUpload] Processing X files...
     [FileUpload] Processing file: filename.jpg
     [FileUpload] Successfully converted filename.jpg to data URL
     [FileUpload] ✅ Files uploaded successfully
     [TestUpload] Files received from FileUpload component
     ```

---

### Method 2: Real Flow Testing (Tutor Evidence)

1. **Login sebagai Tutor**
   - Email: `tutor@economicspace.com`
   - Password: `Tutor@123`

2. **Akses Halaman Bukti Pelaksanaan**
   - Menu sidebar: "Bukti Pelaksanaan"
   - URL: `/tutor/evidence`

3. **Upload Bukti untuk Sesi**
   - Pilih sesi yang perlu upload bukti
   - Klik "Upload Bukti"
   - Dialog akan terbuka

4. **Upload File**
   - Drag & drop atau pilih file
   - Tambah deskripsi (optional)
   - File akan muncul di preview

5. **Submit Evidence**
   - Klik "Upload Bukti"
   - Toast notification: "Bukti pelaksanaan berhasil diupload (X file)"

6. **Verifikasi di Riwayat**
   - Evidence muncul di "Riwayat Upload Bukti"
   - Status: "Menunggu Verifikasi"
   - Badge kuning
   - Klik "Lihat" untuk view detail

7. **View Detail Evidence**
   - Dialog menampilkan semua file
   - Grid preview dengan thumbnail
   - Klik image untuk open full screen
   - File info lengkap

8. **Check Console Logs**
   ```
   [FileUpload] Processing 2 files...
   [FileUpload] Successfully converted foto1.jpg to data URL (length: 125430)
   [FileUpload] ✅ Files uploaded successfully
   [TutorEvidence] Creating new evidence with files: [...]
   [TutorEvidence] ✅ Evidence saved to DataContext
   ```

9. **Refresh Browser**
   - Data TIDAK hilang (tersimpan di localStorage)
   - Evidence masih ada di riwayat
   - File preview masih bisa dibuka

---

### Method 3: Admin Verification Testing

1. **Login sebagai Admin**
   - Email: `admin@economicspace.com`
   - Password: `Admin@123`

2. **Akses Verifikasi Bukti**
   - Menu: "Verifikasi Bukti"
   - URL: `/admin/evidence`

3. **Lihat Evidence Pending**
   - Filter: "Menunggu Verifikasi"
   - Evidence yang diupload tutor akan muncul

4. **View Detail**
   - Klik "Lihat"
   - Semua file preview ditampilkan
   - Klik image untuk full screen

5. **Approve/Reject**
   - Klik "Setujui" atau "Tolak"
   - Tambah catatan
   - Submit

6. **Verifikasi Status Update**
   - Status berubah ke "Disetujui" atau "Ditolak"
   - Badge warna berubah
   - Info verifikasi ditampilkan

7. **Check di Tutor Side**
   - Login kembali sebagai tutor
   - Bukti yang di-approve akan tampil dengan status baru
   - Catatan dari admin visible

---

## ✅ Checklist Functionality

### File Upload Component
- [x] Drag & drop file
- [x] Click to browse file
- [x] Multiple file support (max 5)
- [x] File type validation (JPG, PNG, PDF)
- [x] File size validation (max 10MB)
- [x] Convert file to Base64 data URL
- [x] Preview image files
- [x] Display PDF placeholder
- [x] Remove file before submit
- [x] Error handling & display
- [x] Success indicators

### Data Persistence
- [x] Files saved to state (React)
- [x] Files saved to DataContext
- [x] Files persisted to localStorage
- [x] Data survives page refresh
- [x] Data survives browser close/reopen

### Tutor Evidence Page
- [x] List sessions needing evidence
- [x] Upload dialog with FileUpload component
- [x] Description field
- [x] Submit evidence to DataContext
- [x] Display upload history
- [x] View evidence detail
- [x] Status badges (pending/approved/rejected)
- [x] File preview in view dialog

### Admin Verification Page
- [x] List all evidences
- [x] Filter by status
- [x] View evidence detail with file preview
- [x] Approve evidence
- [x] Reject evidence with notes
- [x] Update evidence status
- [x] Display verification info

### Integration
- [x] Upload → Save → Display → Verify flow
- [x] Cross-role data visibility
- [x] Real-time updates
- [x] Console logging for debugging
- [x] Toast notifications

---

## 🔍 Technical Details

### File Storage Format

**Base64 Data URL Example:**
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...
```

**UploadedFile Object:**
```typescript
{
  id: "file_1234567890_abc123",
  name: "foto_tutoring.jpg",
  size: 245678,
  type: "image/jpeg",
  dataUrl: "data:image/jpeg;base64,...",
  uploadedAt: Date
}
```

**SessionEvidence Object:**
```typescript
{
  id: "EV1234567890",
  sessionId: "S001",
  bookingId: "B001",
  tutorId: "1",
  uploadedAt: "2026-06-07T10:30:00.000Z",
  files: [UploadedFile, UploadedFile, ...],
  description: "Foto dokumentasi sesi",
  status: "pending" | "approved" | "rejected",
  verifiedBy: "admin@economicspace.com",
  verifiedAt: "2026-06-07T11:00:00.000Z",
  verificationNotes: "Approved"
}
```

### Storage Location

**localStorage Keys:**
```
economic_space_session_evidences
```

**Data Structure:**
Array of SessionEvidence objects with embedded file data URLs

### Performance Notes

- **File Size Impact**: Base64 encoding increases size by ~33%
- **localStorage Limit**: ~5-10MB per domain
- **Recommended**: Max 5 files × 10MB = ~67MB base64 (within limits)
- **Best Practice**: Compress images before upload for production

---

## 🐛 Debugging

### Enable Console Logging

All upload operations log to console:

1. Open Developer Tools (F12)
2. Go to Console tab
3. Look for prefixed logs:
   - `[FileUpload]` - Component operations
   - `[TutorEvidence]` - Evidence page operations
   - `[TestUpload]` - Test page operations

### Common Issues & Solutions

**Issue: Files not uploading**
- Check console for errors
- Verify file type (JPG/PNG/PDF only)
- Verify file size (max 10MB)
- Check browser console for FileReader errors

**Issue: Files disappear after refresh**
- Check localStorage in DevTools > Application > Local Storage
- Verify `economic_space_session_evidences` key exists
- Check for localStorage quota errors in console

**Issue: Preview not showing**
- Verify data URL is generated (check console)
- Check image file is not corrupted
- Try different image format

**Issue: Upload button disabled**
- Verify at least 1 file is uploaded
- Check for validation errors
- Look for error message in UI

---

## 📝 Production Recommendations

For production deployment:

1. **Backend Integration**
   - Upload files to cloud storage (S3, Google Cloud Storage)
   - Store URLs instead of base64 in database
   - Implement proper file compression

2. **Security**
   - Scan uploaded files for malware
   - Validate MIME types on server
   - Implement rate limiting

3. **Performance**
   - Image compression before upload
   - Lazy load images in gallery
   - CDN for file delivery

4. **User Experience**
   - Upload progress indicators
   - Thumbnail generation
   - Image optimization

---

## ✨ Demo Workflow

**Complete Test Scenario:**

1. Open `/test-upload` untuk test upload standalone
2. Upload 2-3 gambar, verify preview
3. Click "Simpan File", verify tersimpan
4. Refresh page, verify data persist
5. Login sebagai tutor
6. Go to Bukti Pelaksanaan
7. Upload bukti untuk sesi
8. Verify muncul di riwayat
9. Refresh, verify data masih ada
10. Login sebagai admin
11. Go to Verifikasi Bukti
12. View detail evidence
13. Approve/Reject
14. Login kembali sebagai tutor
15. Verify status update terlihat

**Expected Result:** Semua steps berhasil, data persistent, no errors

---

Last Updated: June 7, 2026
Version: 1.0.0
