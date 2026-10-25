# SYNEX // 2026 — 12-Hour Flagship AI Hackathon

Official web platform for **SYNEX 2026**, a 12-hour high-velocity AI hackathon organized by the **SIMATS Engineering AI Club** at Saveetha School of Engineering (SSE), SIMATS Deemed University, Chennai.

---

## ⚡ Quick Start (Run Locally)

The website is client-side and requires **no build step, dependencies, or backend**. You can preview it instantly:

### Option A: Python 3 (Installed on your system)
```bash
# Run inside the project directory:
python -m http.server 8000
```
Open your browser and navigate to: **[http://localhost:8000](http://localhost:8000)**

### Option B: Direct Browser
Double-click `index.html` or run:
```powershell
start index.html
```

---

## 🎨 Visual Identity & Aesthetic Direction

- **Theme:** Obsidian Dark Void (`#030712`) with Ambient Space Vignette
- **Color Accents:**
  - Electric Cyan (`#06B6D4` / `#00F2FE`)
  - Neon Indigo (`#6366F1`)
  - Cyber Orange (`#F97316`)
- **Background:** Dynamic Three.js kinetic icosahedron and orbital gimbal engine with a 380-node reactive neural constellation particle field.
- **Typography:** Space Grotesk (Headings & Data metrics), Inter (Body copy), and JetBrains Mono (Terminal badges & Code).

---

## 📁 Project Architecture

```
SYNEX/
├── index.html        # Semantic HTML5 event landing page & bottom registration form
├── style.css         # Dark obsidian palette, glassmorphism, responsive grid & timeline
├── script.js         # Three.js 3D background rig, live countdown, FAQ & form validation
├── images/
│   ├── logo.png             # SYNEX official club & hackathon logo
│   └── member-*.jpg         # Core leadership and team assets
└── README.md         # Event overview, setup guide, and configuration
```

---

## 🚀 Key Sections

1. **Sticky Header:** Quick navigation to sections and direct *"Register Team"* scroll CTA.
2. **Hero Arena:** Event title, 12-hour metrics strip, and real-time sprint countdown clock.
3. **About Section:** Mission statement, 12-hour sprint velocity, and SIMATS AI Club mentorship.
4. **Challenge Tracks:** 5 specialized domains (Generative AI/Agents, Computer Vision, Social Good, AI Safety, Open Innovation).
5. **12-Hour Schedule:** Chronological timeline from 08:00 AM check-in, 09:00 AM kick-off, to 08:00 PM code freeze and 09:30 PM awards.
6. **Prizes & Perks:** Champion and Runner-up trophies, cash pool, fellowships, compute credits, and free meals.
7. **Rules & Eligibility:** 2–4 members, fresh commits, public GitHub repo, and campus hardware requirements.
8. **FAQ Accordion:** Interactive answers to common student participant inquiries.
9. **Team Registration Section:**
   - Positioned at the very end as requested.
   - Dynamic member input fields adjusting based on squad size (2, 3, or 4 members).
   - Instant client validation, celebratory confirmation voucher card, and local storage ledger.
