# KolaboraCampus

Implementasi antarmuka web front-end **KolaboraCampus**, platform kolaborasi mahasiswa dan dosen Universitas Brawijaya untuk mencari kompetisi, membentuk tim, menyusun jadwal diskusi, serta mengajukan dosen pembimbing.

Proyek ini dibangun untuk memenuhi tugas mata kuliah **Interaksi Manusia dan Komputer (IMK)** menggunakan **HTML5 semantik**, **External CSS3**, dan **Simple JavaScript (Vanilla JS)** tanpa framework eksternal, dengan mengacu pada prinsip ergonomi antarmuka serta standar aksesibilitas **W3C WCAG 2.2 Level AA**.

---

## Fitur & Daftar Halaman

Aplikasi terdiri dari 6 halaman HTML yang saling terhubung menggunakan navigasi jalur relatif:

| Halaman | File | Fitur & Interaksi UI |
| :--- | :--- | :--- |
| **Beranda** | `index.html` | Banner pencarian real-time, carousel informasi terbaru (auto-play + pause on hover), filter kategori lomba (*Semua, Teknologi, Bisnis, Desain*), dialog **Detail Lomba**, dan dialog **Buat Tim Baru**. |
| **Jelajah Tim** | `jelajah-tim.html` | Pencarian & filter dropdown (posisi & kompetisi), tab pemindah mode ke Cari Anggota, dialog **Detail Tim** beserta aksi *Ajukan bergabung*, serta penambahan kartu tim baru secara dinamis dari dialog *Buat Tim*. |
| **Cari Anggota & Dosen** | `cari-anggota.html` | Pencarian & filter keahlian/kompetisi untuk kandidat dosen pembimbing maupun mahasiswa, tampilan persentase kecocokan (*match*), serta aksi *Ajukan pembimbing* dan *Kirim Undangan*. |
| **Tim Saya (Workspace)** | `tim-saya.html` | Identitas tim (**Tim Aurora**), navigasi tab workspace (*Ringkasan, Jadwal diskusi, Dokumen, Diskusi*), daftar anggota disetujui, fitur **Lock Team** dengan dialog konfirmasi & notifikasi status (*Team Locked*), pintasan workspace, dan profil dosen pembimbing. |
| **Jadwal Diskusi** | `jadwal-diskusi.html` | Simulasi sinkronisasi **Portal Akademik UB**, formulir ketersediaan tambahan dengan tanggal dinamis (4 hari ke depan), tabel matriks **Shared Free-Time** yang otomatis menghitung slot terbaik, serta konfirmasi pilihan waktu diskusi. |
| **Dosen Pembimbing** | `dosen.html` | Pencarian real-time rekomendasi dosen, pemilihan kartu dosen interaktif yang otomatis menyinkronkan tujuan formulir, formulir pengajuan pembimbing (penghitung karakter & unggah/ganti file proposal), rekap anggota tim, dan timeline **Status Pengajuan** dinamis. |

---

## Struktur Direktori

```text
projek_IMK2/
├── index.html             # Halaman Beranda
├── jelajah-tim.html       # Halaman Jelajah Tim Terbuka
├── cari-anggota.html      # Halaman Cari Anggota & Dosen
├── tim-saya.html          # Halaman Workspace Tim Saya
├── jadwal-diskusi.html    # Halaman Jadwal Diskusi & Shared Free-Time
├── dosen.html             # Halaman Pengajuan Dosen Pembimbing
├── style.css              # External Stylesheet bersama (Design Tokens, Grid, Flexbox, Responsif)
├── script.js              # Simple Vanilla JS (Navigasi mobile, filter, modal, state UI, toast)
├── README.md              # Dokumentasi proyek
└── assets/
    └── image/
        ├── Logo.png
        ├── NotProf.png
        ├── Figure.png
        └── Figure2.png

```

---

## Anggota Kelompok & Pembagian Tugas

| No | Nama Anggota | NIM | Peran |
| :---: | :--- | :--- | :--- |
| 1 | **Allyndra Dyalista Dardurani** | `255150201111033` | Frontend Developer |
| 2 | **Reinmarsha Cathleya Khalbi** | `255150200111025` | UI/UX Designer |
| 3 | **Lutfiatul Rofiah** | `255150200111026` | UI/UX Designer | 
