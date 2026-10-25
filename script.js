/**
 * =========================================================================
 * SYNEX 2026 — 12-HOUR HACKATHON CORE SCRIPTS
 * Organizer: SIMATS Engineering AI Club (Saveetha School of Engineering)
 * Visuals: Luminous Cyber Ambient 3D Rig (ByteBlaze-grade additive glow)
 * =========================================================================
 */

// =========================================================================
// 1. CENTRAL CONFIGURATION
// =========================================================================
const SYNEX_CONFIG = {
  // Hackathon Target Date (YYYY-MM-DDTHH:MM:SS)
  eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),

  // Optional Webhook URL (Google Sheet / Webhook endpoint)
  registrationWebhookUrl: "",

  // Social and College Club Channels:
  socials: {
    instagram: "https://www.instagram.com/simats_ai_club",
    github: "https://github.com/Subash071/simats-ai-club",
    website: "https://simats-ai-club.netlify.app/"
  }
};

// =========================================================================
// 2. LIFECYCLE INITIALIZATION
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCountdownTimer();
  initFAQAccordion();
  initScrollSpy();
  initAmbientBackground();
  initRegistrationForm();
});

// =========================================================================
// 3. TOAST NOTIFICATION SYSTEM
// =========================================================================
function showToast(message, duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// =========================================================================
// 4. NAVIGATION & HEADER SCROLL
// =========================================================================
function initNavigation() {
  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link, .btn-nav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }, { passive: true });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("is-open")) {
          navMenu.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
}

// =========================================================================
// 5. LIVE COUNTDOWN TIMER
// =========================================================================
function initCountdownTimer() {
  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMins = document.getElementById("cd-minutes");
  const elSecs = document.getElementById("cd-seconds");

  if (!elDays || !elHours || !elMins || !elSecs) return;

  const target = new Date(SYNEX_CONFIG.eventDate).getTime();

  function update() {
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    elDays.textContent = String(days).padStart(2, "0");
    elHours.textContent = String(hours).padStart(2, "0");
    elMins.textContent = String(mins).padStart(2, "0");
    elSecs.textContent = String(secs).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// =========================================================================
// 6. SCROLL-SPY ACTIVE LINK HIGHLIGHTING
// =========================================================================
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
}

// =========================================================================
// 7. ACCESSIBLE FAQ ACCORDION
// =========================================================================
function initFAQAccordion() {
  const accordion = document.getElementById("faq-accordion");
  if (!accordion) return;

  const triggers = accordion.querySelectorAll(".faq-trigger");

  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));

      triggers.forEach(other => {
        if (other !== trigger) {
          other.setAttribute("aria-expanded", "false");
          const otherPanel = document.getElementById(other.getAttribute("aria-controls"));
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      trigger.setAttribute("aria-expanded", isExpanded ? "false" : "true");
      if (panel) {
        panel.hidden = isExpanded;
      }
    });
  });
}

// =========================================================================
// 8. BRIGHT & LUMINOUS 3D KINETIC BACKGROUND (BYTEBLAZE-STYLE ADDITIVE GLOW)
// =========================================================================
function initAmbientBackground() {
  const canvas = document.getElementById("synex-bg-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  let width = window.innerWidth;
  let height = window.innerHeight;

  const scene = new THREE.Scene();
  // Slightly lighter fog so background elements remain luminous
  scene.fog = new THREE.FogExp2(0x080C16, 0.035);

  const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 100);
  camera.position.set(0, 0, 11);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  } catch (e) {
    console.warn("WebGL initialization failed:", e);
    return;
  }

  // Create soft circular glow texture for glowing particles
  const circleTexture = (function() {
    const c = document.createElement("canvas");
    c.width = 32;
    c.height = 32;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.3, "rgba(255, 255, 255, 0.85)");
    grad.addColorStop(0.7, "rgba(255, 255, 255, 0.2)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(c);
  })();

  // 1. Constellation Particle Cloud (600 glowing particles)
  const particlesCount = 600;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const speeds = [];

  const colBlue = new THREE.Color("#00F0FF");
  const colOrange = new THREE.Color("#FF5E00");
  const colPurple = new THREE.Color("#A855F7");

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const rand = Math.random();
    const chosen = rand < 0.5 ? colBlue : rand < 0.8 ? colOrange : colPurple;
    colors[i * 3] = chosen.r;
    colors[i * 3 + 1] = chosen.g;
    colors[i * 3 + 2] = chosen.b;

    speeds.push({
      x: (Math.random() - 0.5) * 0.003,
      y: (Math.random() - 0.5) * 0.003,
      z: (Math.random() - 0.5) * 0.003
    });
  }

  const particleGeom = new THREE.BufferGeometry();
  particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    map: circleTexture,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeom, particleMat);
  scene.add(particleSystem);

  // 2. Central Kinetic Geometric Rig (Dodecahedron + Concentric Rings)
  const coreGroup = new THREE.Group();
  scene.add(coreGroup);

  // Dodecahedron Outer Core
  const dodecaGeom = new THREE.DodecahedronGeometry(3.6, 0);
  const dodecaMat = new THREE.MeshBasicMaterial({
    color: 0x00F0FF,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const dodecaMesh = new THREE.Mesh(dodecaGeom, dodecaMat);
  coreGroup.add(dodecaMesh);

  // Inner Kinetic Octahedron
  const octaGeom = new THREE.OctahedronGeometry(1.8, 0);
  const octaMat = new THREE.MeshBasicMaterial({
    color: 0xFF5E00,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });
  const octaMesh = new THREE.Mesh(octaGeom, octaMat);
  coreGroup.add(octaMesh);

  // Orbital Gimbal Rings
  const ring1Geom = new THREE.TorusGeometry(5.2, 0.035, 16, 90);
  const ring1Mat = new THREE.MeshBasicMaterial({
    color: 0x6366F1,
    transparent: true,
    opacity: 0.5
  });
  const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
  ring1.rotation.x = Math.PI * 0.35;
  coreGroup.add(ring1);

  const ring2Geom = new THREE.TorusGeometry(4.2, 0.03, 16, 80);
  const ring2Mat = new THREE.MeshBasicMaterial({
    color: 0xFF5E00,
    transparent: true,
    opacity: 0.55
  });
  const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
  ring2.rotation.y = Math.PI * 0.45;
  coreGroup.add(ring2);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  // Scroll Momentum
  let scrollSpeed = 0;
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    scrollSpeed = (currentY - lastScrollY) * 0.001;
    lastScrollY = currentY;
  }, { passive: true });

  // Resize Listener
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }, { passive: true });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Lerp mouse follow
    targetX += (mouseX * 0.9 - targetX) * 0.05;
    targetY += (mouseY * 0.7 - targetY) * 0.05;

    coreGroup.position.x = targetX * 1.6;
    coreGroup.position.y = targetY * 1.3;

    // Rotations
    coreGroup.rotation.y += 0.15 * delta + scrollSpeed * 0.25;
    coreGroup.rotation.x += 0.08 * delta;

    dodecaMesh.rotation.y -= 0.1 * delta;
    octaMesh.rotation.x += 0.25 * delta;
    ring1.rotation.z += 0.2 * delta;
    ring2.rotation.x -= 0.22 * delta;

    // Float particles
    const posArr = particleGeom.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
      posArr[i * 3 + 1] += speeds[i].y;
      posArr[i * 3] += speeds[i].x;

      if (posArr[i * 3 + 1] > 13) posArr[i * 3 + 1] = -13;
      if (posArr[i * 3 + 1] < -13) posArr[i * 3 + 1] = 13;
      if (posArr[i * 3] > 13) posArr[i * 3] = -13;
      if (posArr[i * 3] < -13) posArr[i * 3] = 13;
    }
    particleGeom.attributes.position.needsUpdate = true;

    particleSystem.rotation.y += 0.02 * delta;
    particleSystem.rotation.x += 0.01 * delta;

    scrollSpeed *= 0.92;

    renderer.render(scene, camera);
  }

  animate();
}

// =========================================================================
// 9. TEAM REGISTRATION FORM LOGIC
// =========================================================================
function initRegistrationForm() {
  const form = document.getElementById("synex-registration-form");
  const teamSizeSelect = document.getElementById("teamSizeSelect");
  const cardM2 = document.getElementById("member-card-2");
  const cardM3 = document.getElementById("member-card-3");
  const cardM4 = document.getElementById("member-card-4");

  const successCard = document.getElementById("registration-success-card");
  const receiptDetails = document.getElementById("receipt-details");
  const btnPrint = document.getElementById("btn-print-receipt");
  const btnRegisterAnother = document.getElementById("btn-register-another");
  const btnSubmit = document.getElementById("btn-submit-registration");

  if (!form || !teamSizeSelect) return;

  function adjustMemberInputs() {
    const size = parseInt(teamSizeSelect.value, 10);

    cardM2.style.display = "block";
    setCardRequired(cardM2, true);

    if (size >= 3) {
      cardM3.style.display = "block";
      setCardRequired(cardM3, true);
    } else {
      cardM3.style.display = "none";
      setCardRequired(cardM3, false);
    }

    if (size >= 4) {
      cardM4.style.display = "block";
      setCardRequired(cardM4, true);
    } else {
      cardM4.style.display = "none";
      setCardRequired(cardM4, false);
    }
  }

  function setCardRequired(cardEl, isRequired) {
    if (!cardEl) return;
    const inputs = cardEl.querySelectorAll("input");
    inputs.forEach(input => {
      if (isRequired) {
        input.setAttribute("required", "");
      } else {
        input.removeAttribute("required");
        input.closest(".input-field")?.classList.remove("has-error");
      }
    });
  }

  teamSizeSelect.addEventListener("change", adjustMemberInputs);
  adjustMemberInputs();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const teamName = document.getElementById("teamName");
    if (!teamName.value.trim()) { showFieldError("teamName", true); isValid = false; } else showFieldError("teamName", false);

    const trackSelect = document.getElementById("trackSelect");
    if (!trackSelect.value) { showFieldError("trackSelect", true); isValid = false; } else showFieldError("trackSelect", false);

    const leadName = document.getElementById("leadName");
    if (!leadName.value.trim()) { showFieldError("leadName", true); isValid = false; } else showFieldError("leadName", false);

    const leadEmail = document.getElementById("leadEmail");
    if (!emailRegex.test(leadEmail.value.trim())) { showFieldError("leadEmail", true); isValid = false; } else showFieldError("leadEmail", false);

    const leadPhone = document.getElementById("leadPhone");
    const digitsOnly = leadPhone.value.replace(/\D/g, "");
    if (digitsOnly.length < 10) { showFieldError("leadPhone", true); isValid = false; } else showFieldError("leadPhone", false);

    const leadDeptYear = document.getElementById("leadDeptYear");
    if (!leadDeptYear.value.trim()) { showFieldError("leadDeptYear", true); isValid = false; } else showFieldError("leadDeptYear", false);

    const size = parseInt(teamSizeSelect.value, 10);

    const m2Name = document.getElementById("m2Name");
    const m2Email = document.getElementById("m2Email");
    const m2DeptYear = document.getElementById("m2DeptYear");
    if (!m2Name.value.trim()) { showFieldError("m2Name", true); isValid = false; } else showFieldError("m2Name", false);
    if (!emailRegex.test(m2Email.value.trim())) { showFieldError("m2Email", true); isValid = false; } else showFieldError("m2Email", false);
    if (!m2DeptYear.value.trim()) { showFieldError("m2DeptYear", true); isValid = false; } else showFieldError("m2DeptYear", false);

    if (size >= 3) {
      const m3Name = document.getElementById("m3Name");
      const m3Email = document.getElementById("m3Email");
      const m3DeptYear = document.getElementById("m3DeptYear");
      if (!m3Name.value.trim()) { showFieldError("m3Name", true); isValid = false; } else showFieldError("m3Name", false);
      if (!emailRegex.test(m3Email.value.trim())) { showFieldError("m3Email", true); isValid = false; } else showFieldError("m3Email", false);
      if (!m3DeptYear.value.trim()) { showFieldError("m3DeptYear", true); isValid = false; } else showFieldError("m3DeptYear", false);
    }

    if (size >= 4) {
      const m4Name = document.getElementById("m4Name");
      const m4Email = document.getElementById("m4Email");
      const m4DeptYear = document.getElementById("m4DeptYear");
      if (!m4Name.value.trim()) { showFieldError("m4Name", true); isValid = false; } else showFieldError("m4Name", false);
      if (!emailRegex.test(m4Email.value.trim())) { showFieldError("m4Email", true); isValid = false; } else showFieldError("m4Email", false);
      if (!m4DeptYear.value.trim()) { showFieldError("m4DeptYear", true); isValid = false; } else showFieldError("m4DeptYear", false);
    }

    const rulesAgreed = document.getElementById("rulesAgreed");
    const errorRules = document.getElementById("error-rulesAgreed");
    if (!rulesAgreed.checked) {
      errorRules.style.display = "block";
      isValid = false;
    } else {
      errorRules.style.display = "none";
    }

    if (!isValid) {
      showToast("Please fill all required squad credentials.");
      return;
    }

    btnSubmit.classList.add("loading");

    const voucherId = "SYNEX-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const submissionData = {
      voucherId: voucherId,
      timestamp: new Date().toLocaleString(),
      teamName: teamName.value.trim(),
      track: trackSelect.value,
      teamSize: size,
      lead: {
        name: leadName.value.trim(),
        email: leadEmail.value.trim(),
        phone: leadPhone.value.trim(),
        college: document.getElementById("leadCollege").value.trim(),
        deptYear: leadDeptYear.value.trim(),
        github: document.getElementById("leadGithub").value.trim()
      },
      members: [
        { name: m2Name.value.trim(), email: m2Email.value.trim(), deptYear: m2DeptYear.value.trim() }
      ],
      projectPitch: document.getElementById("projectPitch").value.trim()
    };

    if (size >= 3) {
      submissionData.members.push({
        name: document.getElementById("m3Name").value.trim(),
        email: document.getElementById("m3Email").value.trim(),
        deptYear: document.getElementById("m3DeptYear").value.trim()
      });
    }

    if (size >= 4) {
      submissionData.members.push({
        name: document.getElementById("m4Name").value.trim(),
        email: document.getElementById("m4Email").value.trim(),
        deptYear: document.getElementById("m4DeptYear").value.trim()
      });
    }

    try {
      const existing = JSON.parse(localStorage.getItem("synex_hackathon_registrations") || "[]");
      existing.push(submissionData);
      localStorage.setItem("synex_hackathon_registrations", JSON.stringify(existing));
    } catch (err) {
      console.warn("LocalStorage save error:", err);
    }

    if (SYNEX_CONFIG.registrationWebhookUrl) {
      fetch(SYNEX_CONFIG.registrationWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData)
      }).catch(err => console.warn("Webhook dispatch error:", err));
    }

    setTimeout(() => {
      btnSubmit.classList.remove("loading");
      form.hidden = true;
      successCard.hidden = false;

      receiptDetails.innerHTML = `
        <div class="receipt-row">
          <span class="receipt-label">VOUCHER ID:</span>
          <span class="receipt-value">${voucherId}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">SQUAD NAME:</span>
          <span class="receipt-value">${escapeHTML(submissionData.teamName)}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">ARENA TRACK:</span>
          <span class="receipt-value">${escapeHTML(submissionData.track)}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">SQUAD SIZE:</span>
          <span class="receipt-value">${submissionData.teamSize} Builders</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">LEAD CONTACT:</span>
          <span class="receipt-value">${escapeHTML(submissionData.lead.name)} (${escapeHTML(submissionData.lead.phone)})</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">VENUE:</span>
          <span class="receipt-value">Saveetha School of Engineering, Chennai</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">STATUS:</span>
          <span class="receipt-value" style="color: #10B981;">CONFIRMED / SEED REGISTERED</span>
        </div>
      `;

      showToast("🎉 Squad Registration Confirmed!");
      successCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 900);
  });

  function showFieldError(id, hasError) {
    const el = document.getElementById(id);
    if (!el) return;
    const parent = el.closest(".input-field");
    if (parent) {
      if (hasError) {
        parent.classList.add("has-error");
      } else {
        parent.classList.remove("has-error");
      }
    }
  }

  if (btnPrint) {
    btnPrint.addEventListener("click", () => {
      window.print();
    });
  }

  if (btnRegisterAnother) {
    btnRegisterAnother.addEventListener("click", () => {
      form.reset();
      adjustMemberInputs();
      form.hidden = false;
      successCard.hidden = true;
      form.scrollIntoView({ behavior: "smooth" });
    });
  }
}

function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
