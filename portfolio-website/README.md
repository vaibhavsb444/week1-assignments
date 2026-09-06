# 🌐 Vaibhav Bhajantri - AI/ML Engineer & Full Stack Developer Portfolio

> **Personal Engineering Portfolio & Showcase**  
> A high-performance, responsive personal developer portfolio showcasing intelligent AI solutions, edge IoT systems, and scalable web platforms. Built with semantic **HTML5**, modern **CSS3**, vanilla **JavaScript (ES6+)**, and integrated with **Lenis** smooth scrolling inertia.

---

## 📌 Profile & About Me

- **Name**: Vaibhav Bhajantri
- **Role**: AI/ML Engineer & Full Stack Developer
- **Education**: B.E. in Computer Science & Engineering (AI & ML) — BLDEA's V.P. Dr. P.G. Halakatti College of Engineering and Technology, Vijayapura (2022 – 2026)
- **Academic Merit**: **8.7 CGPA**
- **Location**: Pune, Maharashtra, India (Open to Remote / Relocation)
- **Email**: [vaibhavbajantri1@gmail.com](mailto:vaibhavbajantri1@gmail.com)
- **Phone**: [+91-8762579444](tel:+918762579444)
- **GitHub**: [github.com/vaibhavsb444](https://github.com/vaibhavsb444)
- **LinkedIn**: [linkedin.com/in/vaibhav-bhajantri](https://linkedin.com/in/vaibhav-bhajantri)

---

## 🏆 Honors & Technical Awards

1. 🏆 **1st Prize** — INVICTUS 2K25 Unity Battle Competition
2. 🥇 **1st Prize** — Model Making Competition (World Environment Day 2026)
3. 🥇 **1st Prize** — 1st Semester Mini Project Exhibition
4. 🥈 **2nd Prize** — 3rd Semester Mini Project Exhibition

---

## 🌟 Key Highlights of the Website

- **Spring-Loaded 120 FPS Smooth Scrolling**: Powered by Lenis with tuned harmonic spring oscillator easing ($x(t) = 1 - e^{-5.5t}\cos(3.8t)$).
- **Cyberpunk Purple & High-Tech Neon Aesthetics**: Custom design tokens reflecting an AI/ML engineering identity.
- **Hardware-Accelerated Compositing**: GPU layer promotion (`translate3d`), `backface-visibility: hidden`, and offscreen containment (`content-visibility: auto`).
- **Dark & Light Theme Switcher**: Native theme engine with system preference detection (`prefers-color-scheme`) and persistent `localStorage` cache.
- **Full Responsiveness**: Seamless across mobile devices (320px+), tablets, and high-DPI desktop displays.
- **Interactive Project Filtering**: Instant categorization (`All`, `AI & Hardware`, `Full Stack & Web Apps`, `Automation & IoT`).
- **Validated Contact Form**: Complete client-side validation with real-time feedback and animated feedback toasts.
- **Printable ATS-Friendly Resume**: Built-in resume viewer and print-to-PDF functionality (`assets/resume.html`).

---

## 🚀 Featured Projects

| Project | Category | Tech Stack | Description |
| :--- | :--- | :--- | :--- |
| **AIVA** | AI & Edge Hardware | Python, Ollama, Qwen, Raspberry Pi 4, NLP | Offline voice-interactive AI campus assistant running local LLMs with zero cloud dependency. |
| **Clodhi.com** | Full Stack E-Commerce | React, Vite, Firebase, Vercel | Streetwear e-commerce startup platform founded and developed end-to-end. |
| **Exam Block Allotment** | Web Automation | PHP, Firebase, Twilio SMS API | Automated seating allocation system with instant Twilio SMS dispatch for collegiate exams. |
| **VisionPulse** | Computer Vision & AI | Python, PyTorch, OpenCV, ESP32-CAM | Real-time neural vision and hand gesture tracker streaming 60 FPS live video telemetry. |

---

## 🗂️ Project File Structure

```text
portpolio/
├── index.html                  # Homepage: Hero, metrics strip, about teaser, skills, featured projects, CTA
├── about.html                  # About page: Biography, engineering philosophy, education & honors timeline
├── projects.html               # Projects catalog: Interactive category filtering (AI, Web Apps, Automation)
├── contact.html                # Contact page: Interactive form, direct details, socials, and FAQ
├── css/
│   ├── style.css               # Design system: Variables (Cyberpunk purple / dark / light), reset, Lenis rules
│   └── components.css          # Components: Hero cards, project grid, filter buttons, badges, forms, toasts
├── js/
│   ├── lenis.min.js            # Bundled standalone Lenis smooth scrolling engine (14KB)
│   └── script.js               # Core app script: Lenis init, theme toggle, mobile drawer, project filter, validation
├── assets/
│   ├── resume.html             # Printable & downloadable curriculum vitae
│   └── images/                 # Custom vector mockups & profile graphics
│       ├── avatar.svg          # Vaibhav Bhajantri developer profile illustration
│       ├── project-aiva.svg    # AIVA AI Assistant & Raspberry Pi mockup
│       ├── project-clodhi.svg  # Clodhi.com Streetwear storefront mockup
│       ├── project-allotment.svg # Exam Block Allotment & Twilio SMS mockup
│       └── project-vision.svg  # VisionPulse OpenCV & PyTorch neural tracker mockup
├── screenshots/                # Showcase preview screenshots
└── README.md                   # Project documentation
```

---

## 💻 Local Setup & Development

No compilation or external dependencies are required. The project is authored in clean, native frontend code.

### 1. Run Locally
You can open `index.html` directly in any web browser, or serve using Python:
```bash
# Python 3
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

---

## 🚢 Deployment Guide

### Deploying to GitHub Pages
1. Push this repository to your GitHub account (`https://github.com/vaibhavsb444/portfolio`):
   ```bash
   git add .
   git commit -m "feat: complete personalized AI/ML & Full Stack portfolio for Vaibhav Bhajantri"
   git push origin main
   ```
2. In your repository, go to **Settings** > **Pages**.
3. Under **Branch**, select `main` and `/ (root)`.
4. Click **Save**. Your site will be live within 1–2 minutes!

### Deploying to Vercel / Netlify
- **Vercel**: Import your GitHub repository, choose framework preset **Other**, root directory `./`, and click **Deploy**.
- **Netlify**: Drag and drop the portfolio folder into the Netlify dashboard.

---

&copy; 2026 Vaibhav Bhajantri. All rights reserved.
