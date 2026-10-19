# 🌷 Good Pastel — Music Diary 🎧✨

> *A little corner of my world, filled with songs, soft colors, and happy little moments.* 🩵

Selamat datang di **Music Diary**, sudut kecil dari Good Pastel yang dibuat untuk merayakan hal-hal sederhana yang membuat hari terasa lebih berwarna: musik favorit, kenangan, dan artis yang punya tempat spesial di hati. 🌈☁️

Di sini, warna pastel bertemu dengan playlist yang menemani hari-hari — terutama lagu-lagu dari **INFINITE** dan **GOT7**. Semoga halaman ini terasa seperti membuka jendela kecil ke dunia musikku. 💿💗

---

## 🫧 Tentang Music Diary

Music Diary adalah halaman personal yang melengkapi Good Pastel. Jika bagian portfolio menampilkan karya dan perjalanan belajar, halaman ini memberi ruang untuk sisi yang lebih santai: musik yang didengarkan berulang kali, grup favorit, dan sedikit cerita di baliknya.

Yang ada di halaman ini:

- 🎶 **Yol's Playlist** — playlist YouTube untuk menemani hari.
- 💙 **INFINITE** — grup yang menjadi salah satu bagian istimewa dari selera musikku.
- 💚 **GOT7** — lagu-lagu yang ikut mengisi playlist sehari-hari.
- 💌 **A Special Little Corner** — ruang apresiasi untuk L · Kim Myung-soo.

## 💿 Yol's Playlist

Bagian playlist menggunakan foto grup INFINITE sebagai **cover khusus** dengan judul **Yol's Playlist**.

Cara kerjanya:

1. Pengunjung melihat cover foto INFINITE.
2. Saat cover atau tombol play ditekan, pemutar YouTube playlist dimuat.
3. Pengunjung juga dapat memilih tautan **Open playlist on YouTube** untuk membuka playlist secara langsung.

Playlist YouTube yang digunakan:

[🎧 Buka Yol&#39;s Playlist di YouTube](https://youtube.com/playlist?list=PLY2KXk4Vugn9qO6OErDhCBJsnYZ7Muyss)

> Catatan: video tetap diputar melalui YouTube. Ketersediaan pemutaran di dalam halaman bergantung pada pengaturan video dan layanan YouTube.

---

### Cara daftar video dimuat ⚠️

Browser meminta daftar video ke backend di Cloudflare Worker. Worker menyimpan API key sebagai secret, lalu meminta data ke endpoint YouTube Data API v3 `playlistItems.list`. Setiap permintaan mengambil maksimal 50 item; jika YouTube mengembalikan `nextPageToken`, browser meminta batch berikutnya melalui Worker. Hasil dari batch-batch tersebut dikumpulkan di browser, lalu ditampilkan 9 video per halaman.

`pageToken` digunakan untuk mengambil batch berikutnya dari API. Tombol Sebelumnya/Berikutnya hanya mengganti 9 video yang terlihat dari hasil yang sudah dimuat. Worker menyimpan cache halaman API selama lima menit untuk mengurangi pemakaian kuota.

### Menyiapkan backend ⚠️

Backend playlist memakai Cloudflare Workers. Untuk menjalankannya:

1. Buat API key di **[Google Cloud Console](https://console.cloud.google.com/apis/credentials)** dan aktifkan YouTube Data API v3. Batasi key tersebut hanya untuk YouTube Data API v3.
2. Pada direktori repo, pasang Wrangler jika belum tersedia: `npm install --save-dev wrangler`.
3. Simpan key sebagai secret Worker: `npx wrangler secret put YOUTUBE_API_KEY`.
4. Deploy Worker: `npx wrangler deploy`. Wrangler akan menampilkan URL Worker, misalnya `https://music-diary-playlist-api.<akun>.workers.dev`.
5. Pada `index.html`, ganti nilai `PLAYLIST_API_URL` dengan URL tersebut ditambah `/playlist`.
6. Deploy ulang situs GitHub Pages.

Worker hanya mengizinkan origin `https://good-pastel.github.io` untuk pemanggilan dari browser. Daftar origin pengembangan lokal terdapat di `worker/index.js` dan dapat dihapus setelah tidak diperlukan. Pembatasan origin membantu browser menolak situs lain, tetapi bukan autentikasi—pemanggil non-browser dapat memalsukan header origin. Karena itu gunakan key baru yang dibatasi hanya untuk YouTube Data API v3, pantau kuota, dan jangan pernah memasukkan key tersebut ke `index.html`.

### 🩵 Catatan Kecil

Music Diary bukan sekadar daftar lagu. Ini adalah ruang kecil untuk menyimpan hal-hal yang membuat hari terasa lebih menyenangkan — satu lagu, satu kenangan, dan satu warna pastel pada satu waktu. ☁️🎧

<p align="center">
  Made with 💗, pastel colors, and a little bit of music.
  <br>
  <strong>Good Pastel · Devi Yolanda</strong>
</p>
