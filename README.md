# 🧠 Genius Web - AI Smart Portfolio

![Project Status](https://img.shields.io/badge/Status-Active-success)

> **Portofolio interaktif generasi berikutnya yang ditenagai oleh Multi-Provider AI Cascade System.**

## 🚀 Tentang Proyek

Ini bukan sekadar website portofolio statis. Genius Web adalah eksperimen antarmuka percakapan cerdas yang menggabungkan desain UI modern (**React + Framer Motion**) dengan backend **Smart Router** yang tangguh (code di repository terpisah).

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
_Simpel penggunaan; ketik shortcut diawal lalu lanjutkan perintah yang ingin disampaikan. Berikut shortcut yang telah ditentukan berdasarkan model ai._

**Shortcuts**
_Enam provider dengan 30 lebih model ai yang ditanamkan untuk mekanisme cascade pada masing-masing task dan petugas peringkas sebagai otak kecil penyambung konteks lintas model ai._

**1. Gemini**

`@gemini-pro`: 'gemini-2.5-pro'
`@gemini-f`: 'gemini-2.5-flash'
`@gemini-2`.0-f: 'gemini-2.0-flash'

**2. Groq**

`@groq-llama`: 'llama-3.1-8b-instant'
`@groq-compound`: 'groq/compound'
`@groq-qwen`: 'qwen/qwen3-32b',
`@groq-gpt`: 'openai/gpt-oss-120b'

**3. Cerebras**

`@Cerebras-llama3`: 'llama3.1-8b'
`@cerebras-gpt`: 'gpt-oss-120b'
`@cerebras-llama`: 'llama-3.3-70b'
`@cerebras-qwen`: 'qwen-3-235b-a22b-instruct-2507'

**4. OpenRouter**

`@router-mic`: 'microsoft/mai-ds-r1:free'
`@router-gem`: 'google/gemini-2.0-flash-exp:free'
`@router-r1t`: 'tngtech/deepseek-r1t2-chimera:free'
`@router-chim`: 'tngtech/deepseek-r1t-chimera:free'
`@router-sher`:'openrouter/sherlock-think-alpha'
`@router-deepchat`: 'deepseek/deepseek-chat-v3-0324:free'
`@router-hermes`: 'nousresearch/hermes-3-llama-3.1-405b:free'
`@router-3llama`: 'meta-llama/llama-3.2-3b-instruct:free'
`@router-gemini`: 'google/gemini-2.0-flash-exp:free'
`@router-sherlock`:'openrouter/sherlock-dash-alpha'
`@router-mistral`:'mistralai/mistral-7b-instruct:free'
`@router-deepseek`: 'deepseek/deepseek-r1-distill-llama-70b:free'
`@router-llama`: 'meta-llama/llama-3.3-70b-instruct:free'
`@router-coder`: 'qwen/qwen3-coder:free'

**5. Sambanova**

`@nova-r1`: 'DeepSeek-R1'
`@nova-deepseek`: 'DeepSeek-R1-Distill-Llama-70B'
`@nova-llama`: 'Meta-Llama-3.3-70B-Instruct'

**6. Cloudflare**

`@cf-gemma`: '@cf/google/gemma-3-12b-it'
`@cf-gpt`: '@cf/openai/gpt-oss-120b'
`@cf-llama`: '@cf/meta/llama-3.3-70b-instruct-fp8-fast'
`@cf-mistral`: '@cf/mistralai/mistral-small-3.1-24b-instruct'

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
