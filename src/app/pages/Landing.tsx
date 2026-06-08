import React from 'react';
import { useNavigate } from 'react-router';
import { Users, Calendar, BarChart3, Shield, Clock, BookOpen, Star, CheckCircle, ArrowRight } from 'lucide-react';
import logo from '../../imports/Logo_Baru_-_White__1_.png';

const testimonials = [
  {
    name: 'Rania Putri',
    semester: 'Semester 4 · Akuntansi',
    quote: 'Nilai Akuntansi Menengah I saya naik dari C ke A- setelah rutin ikut sesi di sini. Tutornya sabar dan penjelasannya mudah dimengerti.',
    rating: 5,
  },
  {
    name: 'Dimas Arya',
    semester: 'Semester 6 · IESP',
    quote: 'Saya patungan sama tiga teman untuk kelas Ekonomika Pengantar II. Biayanya ringan tapi hasilnya luar biasa — kami semua lulus dengan nilai bagus.',
    rating: 5,
  },
  {
    name: 'Sella Maharani',
    semester: 'Semester 5 · Akuntansi',
    quote: 'Sebelum UAS Pengauditan, saya panik karena materinya banyak. Setelah dua sesi intensif, saya bisa masuk ujian dengan jauh lebih tenang.',
    rating: 5,
  },
];

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F3ED] via-white to-[#F0F9F7]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Economic Space Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="font-bold text-xl text-gray-900">Economic Space</h1>
              <p className="text-xs text-gray-500">Layanan Belajar Mahasiswa FEB</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Masuk
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm mb-6">
            <CheckCircle className="w-4 h-4" />
            Khusus Mahasiswa Fakultas Ekonomika dan Bisnis
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Kuasai Mata Kuliah FEB<br />Bersama Tutor yang Tepat
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Belajar satu sesi sudah bisa bikin beda. Tutor kami — mahasiswa FEB berprestasi —
            siap membantu kamu memahami materi, latihan soal, dan percaya diri saat ujian.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              Pesan Sesi Belajar
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#matkul"
              className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"
            >
              Lihat Mata Kuliah
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-400">Mulai dari Rp120.000 · Tersedia sesi individu & kelompok</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-primary mb-1">200+</p>
              <p className="text-gray-500 text-sm">Mahasiswa sudah belajar bersama kami</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary mb-1">5 Matkul</p>
              <p className="text-gray-500 text-sm">Tersedia setiap semester aktif</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent mb-1">96%</p>
              <p className="text-gray-500 text-sm">Peserta puas dengan sesi belajarnya</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#C88A3E] mb-1">Maks. 6</p>
              <p className="text-gray-500 text-sm">Peserta per sesi — belajar lebih fokus</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Kenapa Mahasiswa FEB Memilih Economic Space?
          </h3>
          <p className="text-gray-500 max-w-xl mx-auto">
            Kami dirancang dari awal untuk kebutuhan nyata mahasiswa ekonomi — bukan sekadar tempat les biasa.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-900">Jadwal yang Benar-Benar Fleksibel</h4>
            <p className="text-gray-600">
              Pilih hari dan jam yang paling cocok dengan jadwal kuliahmu. Tidak perlu menyesuaikan
              diri dengan jadwal orang lain — tutornya yang menyesuaikan denganmu.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-900">Tutor yang Sungguh Paham Materinya</h4>
            <p className="text-gray-600">
              Setiap tutor adalah kakak tingkat FEB yang sudah terbukti berprestasi di mata kuliah
              yang sama — bukan tutor generalis yang belajar dari buku.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-900">Privat atau Kelompok, Sama Efektifnya</h4>
            <p className="text-gray-600">
              Ingin fokus sendiri? Ambil sesi privat. Mau hemat bareng teman? Buat kelompok kecil
              — tetap efektif karena peserta dibatasi agar diskusi tetap berkualitas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-900">Persiapan UTS & UAS Lebih Terarah</h4>
            <p className="text-gray-600">
              Tutor kami tahu pola soal yang sering muncul. Kamu tidak hanya belajar teori —
              kamu berlatih mengerjakan soal dengan bimbingan langsung, sesuai gaya dosen.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-900">Catatan & Rangkuman Setelah Sesi</h4>
            <p className="text-gray-600">
              Setiap sesi ditutup dengan ringkasan materi dan soal latihan dari tutor.
              Kamu punya bahan belajar yang bisa dibuka kapan saja sebelum ujian.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <h4 className="font-bold text-xl mb-2 text-gray-900">Pesan dalam Hitungan Menit</h4>
            <p className="text-gray-600">
              Tidak perlu repot cari kontak tutor, tanya jadwal satu per satu, atau tunggu balasan.
              Pilih tutor, pilih jadwal, konfirmasi — selesai.
            </p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="matkul" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Mata Kuliah yang Kami Ampu</h3>
          <p className="text-gray-500 max-w-xl mx-auto">
            Setiap mata kuliah diampu oleh tutor spesialis yang memang ahli di bidang tersebut — bukan tutor serba bisa.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-primary text-white p-6 rounded-xl hover:scale-105 transition-transform cursor-default">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">Akuntansi Menengah I</h4>
            <p className="text-white/75 text-sm">Siklus akuntansi, penyusunan laporan keuangan, dan penerapan standar pelaporan terkini.</p>
          </div>

          <div className="bg-accent text-white p-6 rounded-xl hover:scale-105 transition-transform cursor-default">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">Akuntansi Biaya & Manajemen</h4>
            <p className="text-white/75 text-sm">Penghitungan harga pokok, penyusunan anggaran, dan analisis pengambilan keputusan bisnis.</p>
          </div>

          <div className="bg-secondary text-white p-6 rounded-xl hover:scale-105 transition-transform cursor-default">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">Ekonomika Pengantar II</h4>
            <p className="text-white/75 text-sm">Makroekonomi, kebijakan fiskal dan moneter, serta dinamika perekonomian terbuka.</p>
          </div>

          <div className="bg-[#C88A3E] text-white p-6 rounded-xl hover:scale-105 transition-transform cursor-default">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">Pengauditan</h4>
            <p className="text-white/75 text-sm">Prosedur audit, standar profesional akuntan, dan penilaian risiko yang relevan di dunia kerja.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white border-y border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Yang Mereka Rasakan</h3>
            <p className="text-gray-500">Cerita nyata dari mahasiswa yang sudah belajar bersama kami.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#F9F3ED] rounded-xl p-6 border border-[#E8D5B7]">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-gray-700 mb-5 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.semester}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Cara Kerjanya Sederhana</h3>
          <p className="text-gray-500">Tiga langkah dan kamu sudah siap belajar.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {[
            { step: '01', title: 'Pilih Mata Kuliah', desc: 'Tentukan mata kuliah yang ingin kamu pelajari, lalu pilih tanggal dan waktu yang cocok.' },
            { step: '02', title: 'Konfirmasi & Bayar', desc: 'Lakukan pembayaran mudah, dan kamu akan langsung mendapat konfirmasi jadwal belajar.' },
            { step: '03', title: 'Mulai Belajar', desc: 'Datang ke sesi, belajar bersama tutor, dan pulang dengan pemahaman yang lebih baik.' },
          ].map((item, i) => (
            <div key={i} className="text-center relative">
              <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                {item.step}
              </div>
              <h4 className="font-bold text-xl mb-2 text-gray-900">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Jangan Tunggu Nilai Jelek Dulu</h3>
          <p className="text-xl mb-2 text-white/85">
            Mahasiswa yang belajar lebih awal punya lebih banyak waktu untuk berlatih dan memahami materi.
          </p>
          <p className="text-white/65 mb-8 text-sm">Tempat terbatas — sesi kelompok maksimal 6 peserta.</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            Cari Tutor Sekarang
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Economic Space" className="w-7 h-7 object-contain" />
            <span className="font-semibold text-gray-700">Economic Space</span>
            <span>— Layanan Belajar Mahasiswa FEB</span>
          </div>
          <p>&copy; 2026 Economic Space. Hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
