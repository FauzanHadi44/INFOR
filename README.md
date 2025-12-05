# Informatika Forum (ChatApp)

<div align="center">
  <img src="assets/Logo.png" alt="Logo Informatika Forum" width="150"/>
  <br/>
  <b>Aplikasi Chat Real-time untuk Komunitas Informatika</b>
  <b>Tugas PBP - FAUZAN HADI</b>
</div>

<br/>

Sebuah aplikasi chat real-time yang dibangun menggunakan **React Native** dan **Firebase**, dirancang khusus untuk komunitas "Informatika Forum".

## 🚀 Fitur Utama

- **Autentikasi Pengguna**: Login dan registrasi yang aman menggunakan Firebase Authentication.
- **Pesan Real-time**: Kirim dan terima pesan secara instan didukung oleh Cloud Firestore.
- **Mode Offline**: Riwayat chat disimpan secara lokal menggunakan AsyncStorage, memungkinkan pengguna melihat pesan tanpa koneksi internet.
- **Splash Screen**: Layar pembuka kustom dengan animasi logo.
- **Berbagi Gambar**: (Beta) Fitur untuk mengirim gambar dalam chat.

## 📂 Struktur File

Berikut adalah struktur folder utama dalam proyek ini:

```
ChatApp
├── assets/
│   └── Logo.png              # Aset gambar logo aplikasi
├── ios/                      # Kode native iOS dan konfigurasi Xcode
├── android/                  # Kode native Android dan konfigurasi Gradle
├── screens/                  # Komponen halaman (Screen)
│   ├── ChatScreen.tsx        # Halaman utama chat & logika upload gambar
│   ├── LoginScreen.tsx       # Halaman login pengguna
│   ├── RegisterScreen.tsx    # Halaman pendaftaran akun baru
│   └── SplashScreen.tsx      # Layar awal saat aplikasi dibuka
├── storage/
│   └── mmkv.ts               # Utilitas penyimpanan lokal (AsyncStorage)
├── App.tsx                   # Entry point aplikasi & konfigurasi Navigasi
├── firebase.ts               # Inisialisasi & konfigurasi layanan Firebase
├── package.json              # Daftar dependensi proyek
└── README.md                 # Dokumentasi proyek
```

## 🛠 Teknologi yang Digunakan

- **Frontend**: React Native (CLI), TypeScript
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Penyimpanan Lokal**: AsyncStorage
- **Navigasi**: React Navigation (Native Stack)
- **Ikon**: React Native Vector Icons (Ionicons)

## ⚠️ Masalah yang Diketahui (PENTING)

### 📷 Error Upload Gambar
Saat ini, fitur upload gambar sedang mengalami kendala teknis. Pengguna mungkin menemui pesan error berikut saat mencoba mengirim gambar:

> **Error**: `Firebase Storage: An unknown error occurred (storage/unknown)`

**Status**: Dalam Perbaikan 🚧
- Masalah ini kemungkinan terkait dengan penanganan `Blob` atau konfigurasi Firebase Storage pada simulator/perangkat iOS.
- Logging error detail telah ditambahkan untuk membantu proses debugging.
- Silakan periksa log konsol untuk `Upload Error (full payload)` guna melihat detail kesalahan.

## 📥 Instalasi & Pengaturan

1. **Clone repositori**
   ```bash
   git clone <url-repositori-anda>
   cd ChatApp
   ```

2. **Install dependensi**
   ```bash
   npm install
   ```

3. **Install dependensi iOS (Khusus macOS)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Jalankan aplikasi**
   - Untuk iOS:
     ```bash
     npx react-native run-ios
     ```
   - Untuk Android:
     ```bash
     npx react-native run-android
     ```

## 📝 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

# INFOR
INFOR (Informatika Forum) sebuah aplikasi chating
