# 👑 Luxury Black & Gold Birthday Web Experience

A custom, interactive birthday web application built for my sister. The project consists of two seamlessly connected parts:
1. **The Main Birthday Site** (`index.html`): A full-screen interactive experience for her to explore, featuring a dynamic cake, custom word puzzle game, Polaroid image carousel, and a real-time message feed from her friends.
2. **The Friends' Wish Form** (`/form`): A secret form shared with friends and family to collect birthday messages, profile pictures, and throwback memories.

---

## 🔗 Live Links

* **Sister's Birthday Site (Main):** [Insert Sister's Live Link Here](https://your-app-name.vercel.app)
* **Secret Friends' Wish Form:** [Insert Friends' Form Link Here](https://your-app-name.vercel.app/form)

---

## ✨ Features & Architecture

* **🎨 Luxury Black & Gold Design:** Styled with a custom dark aesthetic featuring glassmorphism, gold gradients, interactive ambient depth graphics, and a custom canvas confetti engine.
* **🕯️ Interactive Candle Cake:** Clickable multi-tier cake with digital candles that blow out upon user interaction, complete with animated flames and localized confetti bursts.
* **🧩 Custom Word Puzzle Gate:** An interactive letter grid containing custom hidden words. Successfully solving the puzzle unlocks a hidden childhood throwback section.
* **💌 Real-Time Wish Feed:** Pulls birthday messages directly from Firebase Firestore and displays them as social cards.
* **🖼️ Multi-Image Throwbacks:** Supports up to 3 throwback memory photos per friend submission, hosted via ImgBB API.
* **🔍 Lightbox Expanded View:** Click on any photo across the entire site to inspect it in a full-screen blurred modal window.

---

## 🛠️ Tech Stack & Services

* **Frontend:** Vanilla HTML5, CSS3 (Modern Glassmorphism & Flex/Grid), and Modern JavaScript (ES Modules).
* **Database:** [Firebase Firestore](https://firebase.google.com/) (Real-time document database).
* **Image Hosting:** [ImgBB REST API](https://api.imgbb.com/) (For hosted profile & throwback image uploads).
* **Deployment:** Hosted on [Vercel](https://vercel.com/).

---

## 📁 Project Directory Structure

```text
├── index.html          # Main Birthday Site (Sister's View)
├── style.css           # Main Stylesheet (Black & Gold Palette)
├── script.js           # Sister's Site Logic & Firebase Real-time Observers
├── images/             # Local static images (Carousel & Baby Reveal)
│   ├── carousel1.jpg
│   ├── carousel2.jpg
│   ├── carousel3.jpg
│   ├── carousel4.jpg
│   └── baby_reveal.jpg
└── form/
    └── index.html      # Secret Friends' Submission Form (`/form` path on Vercel)
├── form-style.css      # Wish Form Stylesheet
└── form-script.js      # ImgBB API Upload Engine & Firestore Push Logic
