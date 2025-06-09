# Project monitoringDevices

---

## Gambaran Umum

`monitoringDevices` adalah sebuah aplikasi berbasis web yang dirancang untuk **memantau penggunaan sumber daya (CPU dan RAM)** dari beberapa perangkat komputer lain secara **real-time**. Aplikasi ini terdiri dari komponen server pusat yang menyajikan antarmuka web, dan komponen client yang berjalan di setiap perangkat yang ingin dipantau.

---

## Fitur Utama

- **Pemantauan Multi-Perangkat:** Pantau CPU dan RAM usage dari lebih dari satu perangkat client.
- **Antarmuka Web Interaktif:** Akses data pemantauan melalui browser web yang user-friendly.
- **Pemantauan Real-time:** Dapatkan update informasi penggunaan sumber daya secara instan.

---

## Teknologi yang Digunakan

Proyek ini dibangun dengan kombinasi teknologi backend dan frontend:

### Backend (Server)

- **Python:** Bahasa pemrograman utama.
- **Flask:** Framework web mikro untuk membangun server aplikasi.

### Frontend (Web Interface)

- **HTML:** Struktur dasar halaman web.
- **Tailwind CSS:** Framework CSS utility-first untuk styling dan desain responsif.
- **jQuery:** Pustaka JavaScript untuk manipulasi DOM dan interaksi yang disederhanakan.
- **JavaScript:** Untuk logika klien dan update data dinamis (`auto_update.js`, `interface.js`).

---

## Struktur Proyek

Berikut adalah struktur direktori proyek `monitoringDevices`:
monitoringDevices/
├── README.md
├── requirements.txt
├── client/
│ └── monitor.py
└── server/
├── static/
│ ├── img/
│ │ └── man-playing-computer-game.jpg
│ └── js/
│ ├── auto_update.js
│ ├── interface.js
│ └── jquery-3.7.1.js
├── templates/
│ └── dashboard.html
├── app.py
└── dataStore.py

---

## Persyaratan Sistem

- **Python 3.x**
- **pip** (Pengelola Paket Python)

---

## Instalasi dan Penggunaan

Ikuti langkah-langkah di bawah ini untuk mengatur dan menjalankan proyek `monitoringDevices`.

### 1. Kloning Repositori (Jika berlaku)

Jika Anda mendapatkan proyek ini dari repositori, kloning terlebih dahulu:

```bash
git clone <URL_REPOSITORI_ANDA>
cd monitoringDevices
```

### 2. Instalasi Depedensi

Navigasi ke direktori utama proyek dan instal semua dependensi Python yang diperlukan:

### 3. Menjalanan Server

Server Flask harus dijalankan terlebih dahulu. Navigasi ke direktori `server/` dan jalankan `app.py`:

```bash
cd server/
python app.py
```

Setelah server berjalan, Anda akan melihat pesan di konsol yang menunjukkan alamat di mana server berjalan (biasanya `http://127.0.0.1:5000/`).

### 4. Membuka Web

Buka browser web Anda dan navigasikan ke alamat yang ditampilkan oleh server (misalnya, `http://127.0.0.1:5000/`). Anda akan melihat dashboard pemantauan, meskipun belum ada perangkat client yang terhubung.

### 5. Menjalankan Client pada Perangkat yang Dipantau

Untuk setiap perangkat yang ingin Anda pantau, navigasikan ke direktori `client/` di perangkat tersebut dan jalankan `monitor.py`:

```bash
cd client/
python monitor.py
```

Setelah `monitor.py` dijalankan di perangkat client, perangkat tersebut akan terdaftar di server, dan Anda akan melihat penggunaan CPU dan RAM-nya muncul di antarmuka web pada dashboard.
