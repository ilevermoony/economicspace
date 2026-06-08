# 📸 Fitur Upload Bukti Pelaksanaan Tutoring

## Gambaran Umum

Fitur ini memungkinkan **tutor** untuk mengupload bukti pelaksanaan sesi tutoring (foto/dokumen), dan **admin** untuk memverifikasi bukti tersebut.

---

## 🎯 Untuk Tutor

### Cara Upload Bukti Pelaksanaan:

1. **Login sebagai Tutor**
   ```
   Email: tutor@economicspace.com
   Password: Tutor@123
   ```

2. **Buka Menu "Bukti Pelaksanaan"**
   - Klik menu di sidebar kiri
   - Icon: Upload 📤

3. **Lihat Dashboard**
   Anda akan melihat 3 statistik:
   - **Perlu Upload**: Jumlah sesi yang sudah selesai tapi belum ada bukti
   - **Sudah Diupload**: Total bukti yang sudah Anda upload
   - **Disetujui**: Bukti yang sudah diverifikasi admin

4. **Upload Bukti untuk Sesi**

   **a. Pilih Sesi**
   - Scroll ke section "Sesi yang Perlu Upload Bukti"
   - Klik button **"Upload Bukti"** pada sesi yang ingin Anda upload

   **b. Upload File**
   - Dialog akan terbuka
   - **Cara 1**: Drag & drop file ke area upload
   - **Cara 2**: Klik "Pilih File" untuk browse
   
   **File yang Didukung:**
   - 📷 Gambar: JPG, PNG
   - 📄 Dokumen: PDF
   - 📏 Maksimal: 10MB per file
   - 🔢 Maksimal: 5 file per upload

   **c. Tambah Deskripsi (Opsional)**
   - Isi field deskripsi dengan keterangan
   - Contoh: "Foto dokumentasi sesi dengan 4 mahasiswa"

   **d. Preview File**
   - File yang sudah diupload akan muncul dengan preview
   - Klik ❌ untuk menghapus file sebelum submit

   **e. Submit**
   - Klik button **"Upload Bukti"**
   - Notifikasi sukses akan muncul
   - Status: **"Menunggu Verifikasi"** (badge kuning)

5. **Lihat Riwayat Upload**
   - Scroll ke section "Riwayat Upload Bukti"
   - Semua bukti yang sudah Anda upload akan ditampilkan
   - Status badge:
     - 🟡 **Menunggu Verifikasi**: Belum direview admin
     - 🟢 **Disetujui**: Sudah diverifikasi admin
     - 🔴 **Ditolak**: Ditolak dengan alasan

6. **Lihat Detail Bukti**
   - Klik button **"Lihat"** pada bukti
   - Dialog akan menampilkan:
     - Info sesi (subject, tanggal)
     - Deskripsi
     - Semua file yang diupload
     - Status verifikasi
     - Catatan dari admin (jika ada)
   - Klik gambar untuk full screen

### ✅ Tips Upload:

- ✨ **Foto yang Jelas**: Upload foto yang jelas dan terang
- 📝 **Tambah Deskripsi**: Jelaskan konteks foto (jumlah peserta, topik, dll)
- 📸 **Multiple Angles**: Upload dari berbagai sudut untuk bukti yang kuat
- ⚡ **Upload Segera**: Upload segera setelah sesi selesai agar tidak lupa
- 🔄 **Check Status**: Pantau status verifikasi di riwayat

---

## 👨‍💼 Untuk Admin

### Cara Verifikasi Bukti:

1. **Login sebagai Admin**
   ```
   Email: admin@economicspace.com
   Password: Admin@123
   ```

2. **Buka Menu "Verifikasi Bukti"**
   - Klik menu di sidebar kiri
   - Icon: Upload 📤

3. **Lihat Dashboard**
   Statistik yang ditampilkan:
   - **Total Bukti**: Semua bukti yang pernah diupload
   - **Menunggu Verifikasi**: Bukti pending yang perlu direview
   - **Disetujui**: Bukti yang sudah disetujui
   - **Ditolak**: Bukti yang ditolak

4. **Filter Bukti**
   - Gunakan dropdown "Filter Status"
   - Pilih: Semua / Pending / Disetujui / Ditolak

5. **Review Bukti**

   **a. Lihat List**
   - Scroll ke "Daftar Bukti Pelaksanaan"
   - Info yang ditampilkan:
     - Subject sesi
     - Nama tutor
     - Tanggal sesi & upload
     - Jumlah file
     - Deskripsi
     - Status badge

   **b. View Detail**
   - Klik button **"Lihat"**
   - Dialog akan menampilkan:
     - Info lengkap sesi
     - Grid preview semua file
     - File info (nama, size)
   - Klik gambar untuk full screen

6. **Approve/Reject Bukti**

   **a. Approve (Setujui)**
   - Klik button **"Setujui"** (hijau)
   - Dialog konfirmasi muncul
   - Tambah catatan (opsional)
   - Klik "Setujui"
   - Status berubah ke ✅ **"Disetujui"**

   **b. Reject (Tolak)**
   - Klik button **"Tolak"** (merah)
   - Dialog konfirmasi muncul
   - **Wajib** isi alasan penolakan
   - Klik "Tolak"
   - Status berubah ke ❌ **"Ditolak"**

7. **Info Verifikasi**
   - Setelah verify, info akan ditampilkan:
     - Diverifikasi oleh: email admin
     - Waktu verifikasi: tanggal & jam
     - Catatan verifikasi (jika ada)
   - Tutor bisa melihat info ini

### ✅ Panduan Verifikasi:

**Approve jika:**
- ✅ Foto jelas dan tidak blur
- ✅ Terlihat aktivitas tutoring
- ✅ Sesuai dengan info sesi (subject, lokasi)
- ✅ Jumlah peserta sesuai booking

**Reject jika:**
- ❌ Foto blur atau gelap
- ❌ Tidak ada aktivitas tutoring
- ❌ Foto tidak relevan
- ❌ Suspek fraud atau fake
- ❌ File corrupt atau tidak bisa dibuka

**Tips:**
- 📋 **Beri Catatan**: Selalu beri catatan saat reject untuk feedback
- ⚡ **Review Cepat**: Verifikasi segera agar tutor bisa dapat feedback
- 🔍 **Detail**: Zoom/click gambar untuk lihat detail
- 📊 **Konsisten**: Gunakan standar yang sama untuk semua verifikasi

---

## 🧪 Testing Upload (Tanpa Login)

Untuk test fungsi upload saja tanpa harus login:

1. **Buka Test Page**
   - URL: `/test-upload`
   - No login required

2. **Upload File**
   - Drag & drop atau browse file
   - File akan diconvert ke Base64

3. **Verifikasi**
   - Preview image ditampilkan
   - Data URL generated
   - File info lengkap
   - Console logs (F12)

4. **Simpan**
   - Klik "Simpan File"
   - File pindah ke "File yang Tersimpan"
   - Bisa dihapus atau view full screen

---

## 📱 Fitur Upload

### ✨ Capabilities

**Upload Methods:**
- 🖱️ **Drag & Drop**: Seret file ke area upload
- 📁 **File Browser**: Klik "Pilih File" untuk browse
- 📋 **Multiple Upload**: Upload banyak file sekaligus

**Validation:**
- 📏 **Size Check**: Max 10MB per file
- 📄 **Type Check**: JPG, PNG, PDF only
- 🔢 **Count Check**: Max 5 files total
- ⚠️ **Error Display**: Clear error messages

**Preview:**
- 🖼️ **Image Preview**: Thumbnail untuk gambar
- 📄 **PDF Indicator**: Icon untuk PDF
- 📊 **File Info**: Name, size, type
- ✅ **Success Badge**: Checkmark saat berhasil

**Management:**
- ❌ **Remove**: Hapus file sebelum submit
- 👁️ **View**: Preview gambar
- 💾 **Save**: Auto-save to localStorage
- 🔄 **Persist**: Data tidak hilang saat refresh

### 🔧 Technical Specs

**File Processing:**
```
1. User selects file
2. Validation (type, size, count)
3. Convert to Base64 data URL
4. Store in state
5. Callback to parent component
6. Save to DataContext
7. Persist to localStorage
```

**Storage Format:**
```javascript
{
  id: "file_timestamp_random",
  name: "filename.jpg",
  size: 245678, // bytes
  type: "image/jpeg",
  dataUrl: "data:image/jpeg;base64,...",
  uploadedAt: Date
}
```

**Performance:**
- ⚡ Base64 encoding: ~33% size increase
- 💾 localStorage: 5-10MB limit per domain
- 📦 Recommended: Compress images before upload
- 🚀 Async processing: Non-blocking UI

---

## 🔐 Security & Privacy

### Data Storage

**Client-Side Only (Current):**
- ✅ Files stored as Base64 in localStorage
- ✅ Data encrypted in secure storage wrapper
- ✅ No server upload required
- ⚠️ Limited to browser storage

**Production Recommendations:**
- 🔒 Upload to secure cloud storage (S3, Google Cloud)
- 🔐 Encrypt files at rest
- 🛡️ Scan for malware
- 🔑 Access control & permissions
- 📊 Audit logging

### Privacy

- 🔒 Only tutor yang upload bisa lihat file mereka
- 👨‍💼 Admin bisa lihat semua file untuk verifikasi
- 🚫 Mahasiswa/Principal tidak bisa akses
- 📝 Verification notes visible to tutor

---

## ❓ FAQ

**Q: Berapa maksimal file yang bisa diupload?**
A: Maksimal 5 file per sesi, masing-masing max 10MB.

**Q: Format file apa yang didukung?**
A: JPG, PNG untuk gambar dan PDF untuk dokumen.

**Q: Apakah data hilang saat refresh browser?**
A: Tidak, data tersimpan di localStorage dan persist.

**Q: Bagaimana jika file terlalu besar?**
A: Compress gambar dulu sebelum upload. Gunakan tool online seperti TinyPNG.

**Q: Bisakah edit bukti setelah diupload?**
A: Saat ini belum bisa edit. Jika salah, hubungi admin.

**Q: Berapa lama admin verifikasi?**
A: Tergantung admin, biasanya 1-2 hari kerja.

**Q: Apa yang terjadi jika ditolak?**
A: Anda bisa lihat alasan penolakan di detail bukti dan upload ulang.

**Q: Apakah wajib upload bukti?**
A: Ya, untuk validasi sesi tutoring dan pencairan gaji.

---

## 🆘 Troubleshooting

**Problem: File tidak bisa diupload**
- ✅ Check format file (JPG/PNG/PDF)
- ✅ Check ukuran file (max 10MB)
- ✅ Check sudah 5 file atau belum
- ✅ Try different browser
- ✅ Clear browser cache

**Problem: Preview tidak muncul**
- ✅ Pastikan file gambar tidak corrupt
- ✅ Try upload ulang
- ✅ Check console (F12) untuk error

**Problem: Data hilang setelah refresh**
- ✅ Check localStorage di DevTools
- ✅ Pastikan browser tidak private mode
- ✅ Check storage quota

**Problem: Upload button disabled**
- ✅ Pastikan minimal 1 file sudah diupload
- ✅ Check tidak ada error validation
- ✅ Reload page

---

## 📞 Support

Jika ada masalah atau pertanyaan:
- 📧 Email: support@economicspace.com
- 💬 Contact admin melalui sistem
- 📖 Baca dokumentasi teknis: `UPLOAD_TESTING.md`

---

**Last Updated**: June 7, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready (Frontend)
