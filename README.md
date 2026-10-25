# SYNEX

Official website for **SYNEX**, an interdisciplinary university artificial intelligence collective advancing student research sprints, open-source architectures, and high-velocity systems engineering.

---

## ⚡ Quick Start (Run Locally)

The website is purely client-side and requires **no build step, dependencies, or backend**. You can serve it using any standard static file server:

### Option A: Python 3 (Recommended)
```bash
# Run inside the project directory:
python3 -m http.server 8000
```
Open your browser and navigate to: [http://localhost:8000](http://localhost:8000)

### Option B: Node.js (via `npx serve`)
```bash
# Zero-install static server:
npx serve .
```
Open the localhost address displayed in the terminal (typically [http://localhost:3000](http://localhost:3000)).

---

## 🎨 Visual Direction: Premium University Editorial

The website uses a warm, authentic editorial technology-club aesthetic with confident, natural colors:

- **Warm Off-White Canvas:** `#F7F5F0`
- **Deep Navy (Text & Structure):** `#17243A`
- **Burnt Orange Accent:** `#C75B39`
- **Muted Grey (Subtext & Meta):** `#666B73`
- **Pure White Content Surfaces:** `#FFFFFF`
- **Hairline Borders:** `#E2DDD5`
- **Typography:** Space Grotesk (Headings) & Inter (Body)

Excessive neon glows, heavy gradients, glassmorphism, floating particle animations, unconfirmed prize banners, and placeholder timelines have been eliminated in favor of clean editorial typography, real student photography, and structured academic pillars.

---

## 📁 Project Structure

```
synex-hackathon/
├── index.html        # Semantic HTML5 markup, accessible landmarks, 2-column hero & modal
├── style.css         # Custom stylesheet: editorial palette, 3D architectural frame, responsive grids
├── script.js         # Central config, Three.js 3D kinetic emblem engine, FAQ accordion, modal dialog
├── images/
│   ├── logo.png             # Transparent emblem for SYNEX (Deep Navy & Burnt Orange)
│   ├── member-advisor.jpg   # Symlink to WhatsApp Image (Faculty Advisor / Club Head)
│   ├── member-secretary.png # Symlink to file_00000000da448211... (Secretary / Core Lead)
│   ├── member-techlead.jpg  # Symlink to IMG-20260802-WA0047.jpg (Technical Lead)
│   └── member-events.jpg    # Symlink to IMG-20260731-WA0004.jpg (Events & Community Lead)
└── README.md         # Documentation, configuration guide, and update checklist
```

---

## 🛠️ Configuration & Editing Guide

All links, team details, and settings are organized to be easily editable without touching CSS or JavaScript logic.

### 1. Central Configuration (`script.js`)
Open [`script.js`](script.js#L26-L40) and locate the `SYNEX_CONFIG` object:

```javascript
const SYNEX_CONFIG = {
  // Official membership/intake or event portal URL:
  // Leave empty ("") when no application cycle is active.
  membershipUrl: "", // e.g. "https://forms.gle/YOUR_INTAKE_FORM"

  // Official Social Media & Community Channels:
  // Update these strings with your official club URLs when published:
  socials: {
    instagram: "", // e.g. "https://instagram.com/synex_ai"
    linkedin: "",  // e.g. "https://linkedin.com/company/synex"
    github: "",    // e.g. "https://github.com/synex-ai"
    discord: "",   // e.g. "https://discord.gg/your_invite_code"
    email: ""      // e.g. "contact@synex.edu"
  }
};
```

- **Safe Link Handling:** When a social URL is empty `""` or set to a placeholder, the website displays a neutral "Coming Soon" badge. Clicking it shows an accessible feedback toast rather than triggering a dead `#` link.
- **Membership Intake:** When `membershipUrl` is empty `""`, clicking any "Membership Intake" button opens the accessible modal dialog. When set to a valid URL, all intake buttons immediately redirect applicants to the official form in a new tab.

---

### 2. Updating Team Member Names & Roles (`index.html`)
Open [`index.html`](index.html#L180-L280) and locate the **Our Team** section (`<!-- OUR TEAM SECTION -->`).

Each team card contains clearly labeled comments:
```html
<!-- TEAM MEMBER 1 (Club Head / Faculty Advisor) -->
<!-- EDIT MEMBER 1: Replace placeholder name, designation, and bio when confirmed -->
<article class="team-card">
  <div class="team-photo-frame team-portrait-frame">
    <img 
      src="images/WhatsApp%20Image%202026-10-24%20at%2022.28.17.jpeg" 
      alt="Photo of SYNEX Faculty Advisor / Club Head" 
      class="team-portrait-img"
      loading="lazy">
  </div>
  <div class="team-info">
    <span class="team-role-pill">Faculty Advisor / Club Head</span>
    <!-- EDIT NAME HERE -->
    <h3 class="team-name">[Faculty Advisor / Club Head Name]</h3>
    <p class="team-dept">Faculty Advisory & Research Strategy</p>
    <p class="team-bio">...</p>
  </div>
</article>
```

#### Team Photo Mapping:
| Photo Filename | Suggested Designation | Current Placeholder |
| :--- | :--- | :--- |
| `WhatsApp Image 2026-10-24 at 22.28.17.jpeg` | Faculty Advisor / Club Head | `[Faculty Advisor / Club Head Name]` |
| `file_00000000da448211bd5f1f21c14eb3dc.png` | Secretary / Core Lead | `[Secretary / Core Lead Name]` |
| `IMG-20260802-WA0047.jpg` | Technical Lead | `[Technical Lead Name]` |
| `IMG-20260731-WA0004.jpg` | Events & Community Lead | `[Events & Community Lead Name]` |

> [!NOTE]
> All portraits are framed with `aspect-ratio: 4 / 5` and `object-fit: cover` to preserve facial proportions without distortion across all viewports.

---

### 3. Replacing Member Photos
To update or swap any member photo:
1. Place the new image file into the `images/` directory.
2. Update the `src` attribute in the corresponding `<img>` tag in `index.html`.
3. If the filename contains spaces, URL-encode them as `%20` (e.g. `images/First%20Last.jpg`).

---

## 🏛️ Website Sections

1. **Header & Navigation:** Sticky header with logo, navigation links (`About`, `Team`, `Focus Areas`, `Activities`, `FAQ`, `Contact`), social channels, and Membership Intake CTA.
2. **Hero:** Institutional academic badge, headline, lead paragraph, action buttons, and 4-column credibility spec grid.
3. **About SYNEX:** 2-column layout with founding manifesto on the left and 4 core pillars on the right.
4. **Our Team:** 4-column editorial grid showcasing the real member photos from `images/` with role tags and bios.
5. **Focus Areas:** 3 research clusters (Generative Systems & Autonomous Agents, Computer Vision & Spatial Intelligence, Applied AI & Algorithmic Ethics).
6. **Activities & Initiatives:** 3 key club activities (Weekly Paper Reading Groups, Engineering Clinics, Open Source Build Sprints).
7. **FAQ:** 3 accessible accordions covering eligibility, prerequisites, and zero-fee access.
8. **Contact & Social Hub:** Clean cards for Discord, LinkedIn, GitHub, Instagram, and Email wired to `SYNEX_CONFIG`.
9. **Footer:** Deep navy footer with directory links, social links, and back-to-top button.
10. **Membership Modal:** Informative intake dialog with instructions for organizers.

---

## ✅ Completed Requirements Checklist

- [x] **Full-Page 3D Spatial Particle Background:** Continuous WebGL particle field drifting across the entire site from header to footer, built with Three.js. Real 3D depth with `PerspectiveCamera`, circular antialiased particle sprites, palette-matched colors (Deep Navy, Slate, Burnt Orange, Warm White), mouse repulsion deflection, scroll coupling, clean dynamic line connections, and tab-visibility/reduced-motion performance optimization.
- [x] **Interactive 3D Hero Visual:** Original kinetic geometric installation inspired by the SYNEX emblem, built with Three.js (via CDN). Nested hexagonal armature, dual orbital gimbal rings, central core, studio warm lighting, damped pointer parallax, touch rotation, `IntersectionObserver` pause when off-screen, and graceful vector fallback.
- [x] **Brand Consistency:** Exactly **SYNEX** across browser title, navbar, hero, cards, footer, modal, and README.
- [x] **Unconfirmed Content Removed:** Removed prize pool section, ₹XX,XXX banners, and schedule timeline as requested.
- [x] **Real Photos Integrated:** All 4 existing member photos rendered in the "Our Team" section with reliable paths and 4:5 aspect ratio.
- [x] **Editorial University Aesthetic:** Warm off-white (`#F7F5F0`), deep navy (`#17243A`), and burnt orange (`#C75B39`) palette.
- [x] **No Dead Links:** All social links and CTAs safely handle unconfigured states with status badges or toasts.
- [x] **Accessibility & Standards:** ARIA attributes, semantic landmarks, keyboard navigation, minimum 44px touch targets, and `prefers-reduced-motion` support.
- [x] **Responsive Mobile-First Design:** Fluid layout adapting smoothly across desktop (2-column hero), tablet, and mobile viewports.

---

## 📋 Organizer Launch Checklist

When ready to publish official details:
- [ ] Update member names, departments, and bios in `index.html` (`#team`).
- [ ] Set `membershipUrl` in `script.js` when student intake opens.
- [ ] Add live URLs for Discord, LinkedIn, GitHub, Instagram, and Email in `script.js`.
