# 🧠 Genius Web - AI Smart Portfolio

![Project Status](https://img.shields.io/badge/Status-Active-success)

> **Portofolio interaktif generasi berikutnya yang ditenagai oleh Multi-Provider AI Cascade System.**

## 🚀 Tentang Proyek

Ini bukan sekadar website portofolio statis. Genius Web adalah eksperimen antarmuka percakapan cerdas yang menggabungkan desain UI modern (**React + Framer Motion**) dengan backend **Smart Router** yang tangguh.

Sistem ini memungkinkan pengunjung untuk "mengobrol" dengan virtual asisten cerdas saya, menanyakan pengalaman kerja, keahlian, bahkan meminta bantuan koding secara _real-time_.

**Fitur Utama:**

- **🤖 Smart AI Router:** Backend cerdas yang secara otomatis memilih model AI terbaik (Gemini, Groq, Cerebras, dll) berdasarkan jenis pertanyaan.
- **🌊 Cascade Failover System:** Arsitektur "anti-gagal". Jika satu provider AI sibuk/down, sistem otomatis beralih ke provider cadangan dalam hitungan milidetik.
- **⚡ Ultra-Fast Response:** Memanfaatkan LPU (Language Processing Unit) dari Groq dan Cerebras untuk kecepatan instan.
- **🎨 UI Interaktif:** Komponen _DateBubble_ yang hidup dan _SpeechBubble_ yang dinamis mengikuti interaksi pengguna.

## 🧠 Arsitektur "Smart Router"

Backend proyek ini menggunakan sistem **Multi-Provider Cascade** untuk menjamin ketersediaan 99.9%:

| Task               | Prioritas Utama | Cadangan 1 | Cadangan 2   | Cadangan 3    | Jaring Pengaman |
| :----------------- | :-------------- | :--------- | :----------- | :------------ | :-------------- |
| **Chat Umum**      | ⚡ Gemini       | 🚀 Groq    | 🌪️ Cerebras  | 🛡️ OpenRouter | CloudFlare      |
| **Asisten Koding** | 🧠 Gemini       | 💻 Groq    | 🔧 SambaNova | 🌐 OpenRouter | CloudFlare      |

_Sistem juga mendukung **Shortcuts** (misal: `@groq`, `@pro`) untuk mem-bypass logika cascade otomatis dan menentukan model ai mana yang dipilih untuk merespon pengguna._

## 🛠️ Teknologi yang Digunakan

**Frontend:**

- ⚛️ **React** (Vite)
- im **Framer Motion** (Animasi UI canggih)
- 🎨 **SCSS** (Styling modular)
- 📱 **React Icons** & **Lottie**

**Backend (Serverless):**

- ▲ **Vercel Serverless Functions** (Node.js)
- 🌐 **OpenAI SDK** (Standardisasi API)
- 🧠 **Google Generative AI SDK** & **Groq SDK**
- 🛡️ **CORS** (Keamanan akses)

## 📸 Galeri

|            Mode Chat Aktif            |             Tampilan Mobile              |
| :-----------------------------------: | :--------------------------------------: |
| ![Chat UI](./screenshots/chat-ui.png) | ![Mobile View](./screenshots/mobile.png) |
