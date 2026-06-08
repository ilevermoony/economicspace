# Economic Space - Local Persistence System

## Overview
Economic Space menggunakan sistem penyimpanan data lokal (localStorage) untuk menjaga persistensi data saat pengguna berpindah halaman atau merefresh browser.

## Arsitektur

### 1. **LocalStorage Utility** (`/src/app/utils/localStorage.ts`)
Menyediakan fungsi-fungsi helper untuk:
- `get<T>(key)` - Mengambil data dari localStorage
- `set<T>(key, value)` - Menyimpan data ke localStorage
- `remove(key)` - Menghapus data dari localStorage
- `clearAll()` - Menghapus semua data aplikasi
- `has(key)` - Mengecek keberadaan data

### 2. **DataContext** (`/src/app/context/DataContext.tsx`)
Context Provider yang mengelola semua data aplikasi:

#### Data yang Dikelola:
- ✅ **Tutors** - Data tutor dan informasi kontak
- ✅ **Students** - Data mahasiswa dan riwayat akademik
- ✅ **Bookings** - Booking tutoring dan status pembayaran
- ✅ **Sessions** - Sesi tutoring yang telah selesai
- ✅ **Materials** - Materi pembelajaran
- ✅ **Payroll** - Data penggajian tutor
- ✅ **Availability** - Jadwal ketersediaan tutor
- ✅ **Locations** - Lokasi tutoring (online/offline)
- ✅ **Session Completions** - Bukti penyelesaian sesi
- ✅ **Notifications** - Notifikasi sistem

#### Metode CRUD:
Setiap jenis data memiliki metode:
- `add[Type]()` - Menambah data baru
- `update[Type]()` - Memperbarui data existing
- `delete[Type]()` - Menghapus data

## Cara Penggunaan

### 1. Import useData Hook
```tsx
import { useData } from '../../context/DataContext';
```

### 2. Destructure Data & Methods
```tsx
const { bookings, updateBooking, addNotification } = useData();
```

### 3. Update Data
```tsx
// Update booking status
updateBooking(payment.id, { status: 'confirmed' });

// Add notification
addNotification({
  id: `N${Date.now()}`,
  userId: payment.tuteeId,
  userRole: 'tutee',
  type: 'payment',
  title: 'Pembayaran Berhasil',
  message: 'Pembayaran telah diverifikasi',
  timestamp: new Date().toISOString(),
  isRead: false,
});
```

## Fitur Otomatis

### ✅ Auto-Save
Data otomatis disimpan ke localStorage setiap kali ada perubahan menggunakan `useEffect`.

### ✅ Auto-Load
Data otomatis dimuat dari localStorage saat aplikasi pertama kali dibuka.

### ✅ Fallback ke Mock Data
Jika localStorage kosong (first visit), sistem akan menggunakan mock data sebagai default.

## Contoh Implementasi

### Admin Payments - Approve Payment
```tsx
const handleApprove = (payment) => {
  // Update booking status
  updateBooking(payment.id, { status: 'confirmed' });
  
  // Add notification for tutee
  addNotification({...});
  
  // Show toast
  showToast('success', 'Pembayaran Disetujui');
};
```

### Tutee Feedback - Submit Feedback
```tsx
const handleSubmit = () => {
  // Update session with feedback
  updateSession(selectedSession, {
    feedbackSubmitted: true,
    materialsUnlocked: true
  });
  
  showToast('success', 'Feedback Berhasil Dikirim');
};
```

### Admin Payroll - Process Payment
```tsx
const handlePayment = (payrollItem) => {
  updatePayroll(payrollItem.id, {
    status: 'paid',
    paidDate: new Date().toISOString()
  });
  
  showToast('success', 'Gaji Berhasil Diproses');
};
```

## Keuntungan

1. **Persistent Data** - Data tidak hilang saat refresh atau pindah halaman
2. **Offline-Ready** - Data tersedia tanpa koneksi server
3. **Fast Response** - Tidak ada network latency
4. **Easy Testing** - Mudah untuk testing fitur-fitur baru
5. **No Backend Required** - Cocok untuk prototype dan development

## Reset Data

Untuk reset semua data ke default mock data:
```tsx
const { resetData } = useData();
resetData(); // Reset all data
```

Atau clear manual via browser console:
```javascript
localStorage.clear();
```

## Browser Support

Sistem ini menggunakan localStorage yang didukung oleh semua browser modern:
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

## Storage Limit

localStorage memiliki limit ~5-10MB tergantung browser. Untuk Economic Space dengan current data structure, penggunaan storage adalah:
- Estimated: ~500KB - 1MB
- Well within safe limits ✅
