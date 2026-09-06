# Task 3: CSS Challenge Master Showcase

An enterprise-grade showcase of modern, clean, semantic HTML5 and vanilla CSS3. Built with zero external CSS frameworks (no Tailwind, Bootstrap, or component UI libraries). Demonstrates deep mastery of **Flexbox**, **CSS Grid**, and **GPU-accelerated Keyframe Animations**, wrapped in a sleek dark-mode luxury aesthetic with **Lenis smooth inertial scroll physics** and hyper-polished visual effects.

---

## 🚀 What's New: Lenis Physics & Crazy Animations

1. **Lenis Smooth Scroll Engine (`lenis.min.js`)**:
   - Bundled locally for 100% offline reliability.
   - Configured with deliberate luxury delay (`duration: 1.8s`) and exponential ease-out physics for a butter-smooth, heavy gliding feel.
   - Seamlessly hooked to top navigation tabs with cinematic scroll-to tracking (`duration: 2.0s`).

2. **Ambient Cursor Follower Torch**:
   - Real-time interpolated radial light orb that tracks cursor movement across the viewport with smooth dampening.

3. **Dynamic Roving Card Spotlights (`.spotlight-card`)**:
   - Every Flexbox, Grid, and Animation card tracks cursor position via CSS custom properties (`--mouse-x`, `--mouse-y`), casting an interactive specular glow across the dark glass surface.

4. **Traveling Neon Border Beams (`.border-beam-card`)**:
   - Continuous rotating conic-gradient beam running along card perimeters (`@property --beam-angle`).

5. **Component 1: Magnetic Glow Button + Shockwave Burst**:
   - Magnetic attraction towards cursor on hover (`translate(deltaX, deltaY)`).
   - High-energy shockwave ring explosion expanding outward on click!

6. **Component 2: Holographic Radar Scanner**:
   - Dynamic target blips that flash and ping as the 360&deg; conic sweep line passes over them.
   - Concentric reticle rings, crosshairs, expanding sonar waves, and counter-rotating dual orbital rings.

7. **Component 3: 3D Holographic Parallax Card**:
   - Iridescent foil shimmer layer (`mix-blend-mode: color-dodge`).
   - Deep multi-level 3D spatial elevation (`translateZ(35px)` to `translateZ(70px)`).
   - Real-time gyroscope / mousemove tilt physics.

8. **Digital Counter Tickers & Scroll Reveals**:
   - Telemetry values animate up smoothly from 0 with cubic easing when entering the viewport.

---

## 📸 Assignment Screenshot Guide

Every challenge section includes dedicated badges and headers to make capturing the four required screenshots effortless:

| Target File | Recommended Viewport | Target Element / Section | What to Capture |
| :--- | :--- | :--- | :--- |
| **`flex-desktop.png`** | Desktop (`1200px`+) | `#challenge-flexbox` | Section header + 3 feature cards in a horizontal row (`display: flex`) |
| **`flex-mobile.png`** | Mobile (`< 768px` or `375px`) | `#challenge-flexbox` | Section header + feature cards stacked vertically into 1 column |
| **`grid-layout.png`** | Desktop / Tablet | `#challenge-grid` | Section header + 6 telemetry cards arranged in a 3-column / 2-column grid |
| **`animation-demo.png`** | Any Viewport | `#challenge-animations` | All 3 interactive motion components (Glow button, Radar pulse, 3D Tilt card) |

> 💡 **Quick Viewport Simulator:** Use the built-in simulator buttons (**Full**, **Desktop**, **Tablet**, **Mobile**) in the top-right header to preview and screenshot responsive states instantly without opening browser DevTools!

---

## 🛠️ Challenge Breakdown & Technical Logic

### 1. Flexbox Layout Task (`#challenge-flexbox`)
* **Desktop Row Layout**: Exactly 3 feature cards arranged horizontally using `display: flex;`.
* **Equal Card Widths**: Uses `flex: 1 1 0; min-width: 0;` so all cards occupy equal width regardless of dynamic content.
* **Vertical Alignment**: Container uses `align-items: stretch;` so cards have identical height. Internal cards use `display: flex; flex-direction: column;` with `margin-top: auto;` on the footer row to ensure action buttons are perfectly aligned.
* **Mobile Responsiveness**: At `@media (max-width: 768px)`, smoothly transitions `flex-direction: column;` and `width: 100%;` without breaking margins or padding.

### 2. Grid Layout Task (`#challenge-grid`)
* **Two-Dimensional Dashboard**: 6 distinct analytics cards (Active Edge Nodes, P99 Edge Latency, Ingress Throughput, Threat Mitigation, Compute Load, Enterprise SLA).
* **Grid Track Sizing**:
  * **Desktop (`> 992px`)**: `grid-template-columns: repeat(3, 1fr);` (3 equal columns)
  * **Tablet (`768px - 992px`)**: `grid-template-columns: repeat(2, 1fr);` (2 equal columns)
  * **Mobile (`< 640px`)**: `grid-template-columns: 1fr;` (Single column stack)
* **Consistent Gap**: Fixed `gap: 1.5rem;` across rows and columns maintaining visual equilibrium.

### 3. Animation Task (`#challenge-animations`)
* **GPU Acceleration**: Strictly relies on `transform` and `opacity` to avoid costly browser reflows and repaints, achieving 60fps rendering.
* **Magnetic Button**: Gradient flow, magnetic pull, and shockwave burst.
* **Holographic Radar**: Concentric sonar ripples, conic rotating sweep, active target blips, and counter-rotating quantum orbital particles.
* **3D Iridescent Card**: 3D spatial matrix, foil reflection, and multi-axis tilt.

---

## 🚀 How to Run Locally

```bash
# Using Python
python -m http.server 3000

# Using Node / npx
npx -y serve .
```

Open `http://localhost:3000` in your web browser.
