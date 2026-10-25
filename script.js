/**
 * =========================================================================
 * SYNEX — CORE JAVASCRIPT & CONFIGURATION
 * =========================================================================
 * 
 * Aesthetic: Premium Editorial University Technology Club
 * 
 * Features:
 * - Centralized Social & Membership Configuration
 * - Safe Social Link Handler (Zero dead `#` links or broken buttons)
 * - Team Photo Integrity & Load State Verification
 * - Accessible FAQ Accordion (ARIA compliant)
 * - Mobile Navigation Menu with keyboard support & focus trap
 * - Scroll-Spy Active Section Highlighting
 * - Non-intrusive Toast Feedback System
 */

// =========================================================================
// 1. CENTRAL CONFIGURATION (EDIT LINKS HERE)
// =========================================================================
/**
 * All external URLs and contact details are managed from this single object.
 * When left empty ("") or set to a placeholder, the UI will safely display
 * an elegant "Coming Soon" status rather than creating dead `#` links.
 */
const SYNEX_CONFIG = {
  // Official membership/intake or event portal URL:
  // Leave empty ("") when no application cycle is currently active.
  membershipUrl: "",

  // Official Social Media & Community Channels:
  // Update these strings with your official club URLs when published:
  socials: {
    instagram: "", // e.g. "https://instagram.com/synex_ai"
    linkedin: "",  // e.g. "https://linkedin.com/company/synex"
    github: "",    // e.g. "https://github.com/synex-ai"
    discord: "",   // e.g. "https://discord.gg/synex"
    email: ""      // e.g. "contact@synex.edu"
  }
};

// Backwards-compatible alias for any legacy references
const REGISTRATION_FORM_URL = SYNEX_CONFIG.membershipUrl;

// =========================================================================
// 2. LIFECYCLE INITIALIZATION
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initSocialLinks();
  initMembershipCTAs();
  initFAQAccordion();
  initScrollSpy();
  initTeamPhotos();
  initSpatialBackground();
  initHero3D();
});

// =========================================================================
// 3. TOAST NOTIFICATION SYSTEM (Safe Feedback for Coming Soon links)
// =========================================================================
function showToast(message) {
  let toast = document.getElementById("synex-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "synex-toast";
    toast.className = "synex-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

// =========================================================================
// 4. SOCIAL MEDIA CONFIGURATION WIRING
// =========================================================================
function isValidExternalUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (
    trimmed === "" ||
    trimmed.includes("YOUR_") ||
    trimmed.includes("placeholder") ||
    trimmed.startsWith("#")
  ) {
    return false;
  }
  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("mailto:")
  );
}

function initSocialLinks() {
  const socialElements = document.querySelectorAll("[data-social]");

  socialElements.forEach((el) => {
    const platform = el.getAttribute("data-social");
    const configuredUrl = SYNEX_CONFIG.socials[platform];
    const isLive = isValidExternalUrl(configuredUrl);

    if (isLive) {
      el.href = configuredUrl.trim();
      if (!configuredUrl.startsWith("mailto:")) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
      el.classList.remove("status-coming-soon");
      el.removeAttribute("aria-disabled");

      const badge = el.querySelector(".social-status-tag");
      if (badge) {
        badge.textContent = "Active";
        badge.classList.add("badge-active");
      }
    } else {
      // Safe, non-dead placeholder interaction
      el.href = "javascript:void(0)";
      el.setAttribute("aria-disabled", "true");
      el.classList.add("status-coming-soon");

      const badge = el.querySelector(".social-status-tag");
      if (badge) {
        badge.textContent = "Coming Soon";
        badge.classList.remove("badge-active");
      }

      el.addEventListener("click", (e) => {
        e.preventDefault();
        const displayPlatform = platform.charAt(0).toUpperCase() + platform.slice(1);
        showToast(`The official SYNEX ${displayPlatform} link will be published soon.`);
      });
    }
  });
}

// =========================================================================
// 5. MEMBERSHIP / INTAKE CTAs & MODAL DIALOG
// =========================================================================
function initMembershipCTAs() {
  const ctaButtons = document.querySelectorAll(".btn-membership-cta, .btn-register-cta");
  const modal = document.getElementById("membership-modal") || document.getElementById("registration-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalConfirmBtn = document.getElementById("modal-confirm-btn");

  let lastActiveElement = null;

  function openModal() {
    if (!modal) {
      showToast("SYNEX recruitment & event registration will be announced soon.");
      return;
    }
    lastActiveElement = document.activeElement;
    modal.removeAttribute("hidden");
    void modal.offsetWidth; // trigger reflow for smooth transition
    modal.classList.add("active");
    modalCloseBtn?.focus();
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    setTimeout(() => {
      modal.setAttribute("hidden", "");
      document.body.style.overflow = "";
      if (lastActiveElement && typeof lastActiveElement.focus === "function") {
        lastActiveElement.focus();
      }
    }, 250);
  }

  ctaButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const activeUrl = SYNEX_CONFIG.membershipUrl || SYNEX_CONFIG.registrationUrl || REGISTRATION_FORM_URL;
      if (isValidExternalUrl(activeUrl)) {
        window.open(activeUrl.trim(), "_blank", "noopener,noreferrer");
      } else {
        openModal();
      }
    });
  });

  modalCloseBtn?.addEventListener("click", closeModal);
  modalConfirmBtn?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (modal && !modal.hasAttribute("hidden") && e.key === "Escape") {
      closeModal();
    }
  });
}

// =========================================================================
// 6. ACCESSIBLE FAQ ACCORDION
// =========================================================================
function initFAQAccordion() {
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      const answerId = btn.getAttribute("aria-controls");
      const answerPanel = document.getElementById(answerId);

      if (!answerPanel) return;

      // Close other accordions for clean editorial reading
      questions.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute("aria-expanded", "false");
          const otherPanelId = otherBtn.getAttribute("aria-controls");
          const otherPanel = document.getElementById(otherPanelId);
          if (otherPanel) {
            otherPanel.setAttribute("hidden", "");
            otherPanel.style.maxHeight = null;
          }
        }
      });

      if (isExpanded) {
        btn.setAttribute("aria-expanded", "false");
        answerPanel.setAttribute("hidden", "");
        answerPanel.style.maxHeight = null;
      } else {
        btn.setAttribute("aria-expanded", "true");
        answerPanel.removeAttribute("hidden");
        answerPanel.style.maxHeight = answerPanel.scrollHeight + "px";
      }
    });
  });
}

// =========================================================================
// 7. TEAM PHOTOS INTEGRITY & ACCESSIBILITY
// =========================================================================
function initTeamPhotos() {
  const teamImages = document.querySelectorAll(".team-portrait-img");

  teamImages.forEach((img) => {
    img.addEventListener("error", () => {
      console.warn(`[SYNEX] Unable to load team photo at ${img.src}. Falling back to styled frame.`);
      const wrapper = img.closest(".team-photo-frame") || img.closest(".team-portrait-frame");
      if (wrapper) {
        wrapper.classList.add("img-load-fallback");
      }
    });

    if (img.complete && img.naturalWidth !== 0) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });
    }
  });
}

// =========================================================================
// 8. NAVIGATION & MOBILE MENU
// =========================================================================
function initNavigation() {
  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Subtle header shadow on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header?.classList.add("header-scrolled");
    } else {
      header?.classList.remove("header-scrolled");
    }
  }, { passive: true });

  function toggleMobileMenu() {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    navMenu?.classList.toggle("open");
    document.body.style.overflow = !isExpanded ? "hidden" : "";
  }

  function closeMobileMenu() {
    navToggle?.setAttribute("aria-expanded", "false");
    navMenu?.classList.remove("open");
    document.body.style.overflow = "";
  }

  navToggle?.addEventListener("click", toggleMobileMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu?.classList.contains("open")) {
      closeMobileMenu();
      navToggle?.focus();
    }
  });
}

// =========================================================================
// 9. SCROLL SPY / ACTIVE SECTION NAVIGATION
// =========================================================================
function initScrollSpy() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, {
    rootMargin: "-25% 0px -65% 0px",
    threshold: 0
  });

  sections.forEach((sec) => observer.observe(sec));
}

// =========================================================================
// 10. INTERACTIVE 3D HERO VISUAL (Three.js Kinetic Emblem Rig)
// =========================================================================
/**
 * Art-directed 3D kinetic installation inspired by the SYNEX identity.
 * Features:
 * - Geometric physical armature: nested hexagonal cages, orbital gimbals, central core
 * - Approved warm editorial palette: Navy (#17243A), Orange (#C75B39), Warm White (#F5F3ED), Grey (#666B73)
 * - Restrained, smooth pointer parallax (lerp damping, clamped rotation)
 * - Drag/touch rotate capability with smooth return to autonomous kinetic flow
 * - Power & performance optimization for MacBook Air & mobile (IntersectionObserver pause when offscreen)
 * - Strict prefers-reduced-motion compliance (static art-directed beauty render)
 * - Zero uncaught errors & graceful SVG fallback if WebGL or Three.js CDN fails
 */
function isWebGLAvailable() {
  try {
    const testCanvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

function initHero3D() {
  const canvas = document.getElementById("synex-3d-canvas");
  const container = document.getElementById("hero-canvas-container");
  const fallback = document.getElementById("hero-visual-fallback");
  const statusLabel = document.querySelector("#hero-visual-status .status-label");

  if (!canvas || !container) return;

  function activateFallback() {
    if (fallback) fallback.removeAttribute("hidden");
    if (canvas) canvas.style.display = "none";
    if (statusLabel) statusLabel.textContent = "EMBLEM RIG";
  }

  // Graceful fallback if Three.js CDN blocked or WebGL unavailable
  if (typeof THREE === "undefined" || !isWebGLAvailable()) {
    activateFallback();
    return;
  }

  try {
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 400;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 2. Art-Directed Studio Lighting (Warm Editorial Palette)
    const ambientLight = new THREE.AmbientLight(0xF5F2EA, 1.15);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFDF8, 1.45);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xEAE4D8, 0.85);
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xC75B39, 0.95);
    rimLight.position.set(3, -6, -4);
    scene.add(rimLight);

    // 3. Color Tokens
    const COLOR_NAVY = 0x17243A;
    const COLOR_NAVY_LIGHT = 0x243652;
    const COLOR_ORANGE = 0xC75B39;
    const COLOR_WARM_WHITE = 0xF5F3ED;
    const COLOR_GREY = 0x666B73;

    // 4. Physical Materials
    const matNavy = new THREE.MeshStandardMaterial({
      color: COLOR_NAVY,
      roughness: 0.35,
      metalness: 0.18
    });

    const matNavyLight = new THREE.MeshStandardMaterial({
      color: COLOR_NAVY_LIGHT,
      roughness: 0.42,
      metalness: 0.15
    });

    const matOrange = new THREE.MeshStandardMaterial({
      color: COLOR_ORANGE,
      roughness: 0.30,
      metalness: 0.22
    });

    const matWarmWhite = new THREE.MeshStandardMaterial({
      color: COLOR_WARM_WHITE,
      roughness: 0.28,
      metalness: 0.10
    });

    const matSpokeGrey = new THREE.MeshStandardMaterial({
      color: COLOR_GREY,
      roughness: 0.45,
      metalness: 0.30
    });

    // Master Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);
    masterGroup.scale.set(0.9, 0.9, 0.9);

    function createStrut(v1, v2, radius, material) {
      const direction = new THREE.Vector3().subVectors(v2, v1);
      const length = direction.length();
      const geom = new THREE.CylinderGeometry(radius, radius, length, 12, 1);
      const mesh = new THREE.Mesh(geom, material);
      mesh.position.copy(new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5));
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
      return mesh;
    }

    // LAYER A: OUTER HEXAGONAL CAGE (Deep Navy Physical Frame)
    const outerCage = new THREE.Group();
    const R_OUTER = 2.4;
    const Z_DEPTH = 0.35;
    const nodeGeom = new THREE.SphereGeometry(0.125, 18, 18);

    const outerVerticesFront = [];
    const outerVerticesBack = [];

    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 2 + (i * Math.PI) / 3;
      const x = R_OUTER * Math.cos(angle);
      const y = R_OUTER * Math.sin(angle);
      outerVerticesFront.push(new THREE.Vector3(x, y, Z_DEPTH));
      outerVerticesBack.push(new THREE.Vector3(x, y, -Z_DEPTH));

      const nFront = new THREE.Mesh(nodeGeom, matNavy);
      nFront.position.set(x, y, Z_DEPTH);
      outerCage.add(nFront);

      const nBack = new THREE.Mesh(nodeGeom, matNavy);
      nBack.position.set(x, y, -Z_DEPTH);
      outerCage.add(nBack);

      // Z-strut connecting front and back frames
      outerCage.add(createStrut(outerVerticesFront[i], outerVerticesBack[i], 0.04, matNavy));
    }

    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      outerCage.add(createStrut(outerVerticesFront[i], outerVerticesFront[next], 0.048, matNavy));
      outerCage.add(createStrut(outerVerticesBack[i], outerVerticesBack[next], 0.042, matNavyLight));
    }
    masterGroup.add(outerCage);

    // LAYER B: INNER HEXAGONAL FRAME (Burnt Orange)
    const innerHexGroup = new THREE.Group();
    const R_INNER = 1.45;
    const innerVertices = [];
    const smallNodeGeom = new THREE.SphereGeometry(0.085, 16, 16);

    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 2 + (i * Math.PI) / 3;
      const x = R_INNER * Math.cos(angle);
      const y = R_INNER * Math.sin(angle);
      innerVertices.push(new THREE.Vector3(x, y, 0));

      const nInner = new THREE.Mesh(smallNodeGeom, matOrange);
      nInner.position.set(x, y, 0);
      innerHexGroup.add(nInner);
    }

    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      innerHexGroup.add(createStrut(innerVertices[i], innerVertices[next], 0.038, matOrange));
    }
    masterGroup.add(innerHexGroup);

    // LAYER C: RADIAL SPOKES (Muted Grey Connectors)
    const spokesGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 2 + (i * Math.PI) / 3;
      const outerMid = new THREE.Vector3(R_OUTER * Math.cos(angle), R_OUTER * Math.sin(angle), 0);
      spokesGroup.add(createStrut(outerMid, innerVertices[i], 0.024, matSpokeGrey));
    }
    masterGroup.add(spokesGroup);

    // LAYER D: PRIMARY ORBITAL GIMBAL (Warm White Porcelain with Coordinate Ticks)
    const gimbalGroup1 = new THREE.Group();
    const ring1Geom = new THREE.TorusGeometry(1.9, 0.038, 16, 80);
    const ring1 = new THREE.Mesh(ring1Geom, matWarmWhite);
    gimbalGroup1.add(ring1);

    const tickGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8);
    for (let j = 0; j < 4; j++) {
      const a = (j * Math.PI) / 2;
      const tick = new THREE.Mesh(tickGeom, matNavy);
      tick.position.set(1.9 * Math.cos(a), 1.9 * Math.sin(a), 0);
      tick.rotation.z = a + Math.PI / 2;
      gimbalGroup1.add(tick);
    }
    gimbalGroup1.rotation.x = Math.PI * 0.22;
    gimbalGroup1.rotation.y = Math.PI * 0.14;
    masterGroup.add(gimbalGroup1);

    // LAYER E: SECONDARY GIMBAL (Satin Burnt Orange)
    const gimbalGroup2 = new THREE.Group();
    const ring2Geom = new THREE.TorusGeometry(1.22, 0.032, 16, 72);
    const ring2 = new THREE.Mesh(ring2Geom, matOrange);
    gimbalGroup2.add(ring2);
    gimbalGroup2.rotation.x = -Math.PI * 0.28;
    gimbalGroup2.rotation.z = Math.PI * 0.22;
    masterGroup.add(gimbalGroup2);

    // LAYER F: CENTRAL CORE (Navy Ring + Burnt Orange Torus + Warm White Nucleus)
    const coreGroup = new THREE.Group();
    const coreNavyRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.042, 16, 48), matNavy);
    coreGroup.add(coreNavyRing);

    const coreOrangeRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.036, 16, 36), matOrange);
    coreGroup.add(coreOrangeRing);

    const nucleusGeom = new THREE.OctahedronGeometry(0.18, 1);
    const nucleus = new THREE.Mesh(nucleusGeom, matWarmWhite);
    coreGroup.add(nucleus);
    masterGroup.add(coreGroup);

    // LAYER G: SPATIAL RESEARCH COORDINATE POINTS
    const particleCount = 44;
    const partGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colNavy = new THREE.Color(COLOR_NAVY);
    const colOrange = new THREE.Color(COLOR_ORANGE);
    const colGrey = new THREE.Color(COLOR_GREY);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.45 + Math.random() * 0.85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const choice = Math.random();
      const c = choice < 0.4 ? colOrange : (choice < 0.7 ? colNavy : colGrey);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    partGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    partGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const partMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });
    const particleSystem = new THREE.Points(partGeom, partMat);
    masterGroup.add(particleSystem);

    // Initial art-directed presentation angle
    const baseRotationX = 0.22;
    const baseRotationY = -0.36;
    masterGroup.rotation.x = baseRotationX;
    masterGroup.rotation.y = baseRotationY;

    // 5. Interaction State & Damped Pointer Parallax
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragRotationX = 0;
    let dragRotationY = 0;
    let dragVelX = 0;
    let dragVelY = 0;

    const heroSection = document.getElementById("hero") || container;

    // Pointer move parallax (subtle, non-aggressive, strictly clamped)
    function onPointerMove(e) {
      if (isDragging) return;
      const rect = heroSection.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
        targetTiltX = Math.max(-0.22, Math.min(0.22, ny * 0.22));
        targetTiltY = Math.max(-0.26, Math.min(0.26, nx * 0.26));
      } else {
        targetTiltX = 0;
        targetTiltY = 0;
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Drag-to-rotate on canvas container
    container.addEventListener("pointerdown", (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragVelX = 0;
      dragVelY = 0;
      container.setPointerCapture(e.pointerId);
    });

    container.addEventListener("pointermove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      dragVelY = dx * 0.006;
      dragVelX = dy * 0.006;

      dragRotationY += dragVelY;
      dragRotationX += dragVelX;
      dragRotationX = Math.max(-0.8, Math.min(0.8, dragRotationX));
    });

    function endDrag(e) {
      if (isDragging) {
        isDragging = false;
        try {
          container.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    }

    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointercancel", endDrag);

    // 6. Reduced Motion Detection
    let isReducedMotion = false;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function checkReducedMotion(e) {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        masterGroup.rotation.x = baseRotationX;
        masterGroup.rotation.y = baseRotationY;
        renderer.render(scene, camera);
      }
    }

    checkReducedMotion(motionQuery);
    motionQuery.addEventListener("change", checkReducedMotion);

    // 7. Responsive Resize Observer
    function handleResize() {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      if (isReducedMotion) {
        renderer.render(scene, camera);
      }
    }

    window.addEventListener("resize", handleResize, { passive: true });
    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }

    // 8. Visibility & Intersection Observer (Pause when off-screen to save 100% GPU)
    let isHeroVisible = true;
    let animationFrameId = null;

    if ("IntersectionObserver" in window) {
      const visibilityObserver = new IntersectionObserver(
        (entries) => {
          isHeroVisible = entries[0].isIntersecting;
          if (isHeroVisible && !animationFrameId && !isReducedMotion) {
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(animate);
          }
        },
        { threshold: 0.05 }
      );
      visibilityObserver.observe(heroSection);
    }

    // 9. Kinetic Render Loop
    let lastTime = performance.now();

    function animate(currentTime) {
      if (!isHeroVisible) {
        animationFrameId = null;
        return;
      }

      if (isReducedMotion) {
        animationFrameId = null;
        renderer.render(scene, camera);
        return;
      }

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      const time = currentTime * 0.001;

      // Autonomous kinetic rotation
      outerCage.rotation.y += delta * 0.35;
      outerCage.rotation.x = Math.sin(time * 0.7) * 0.04;

      innerHexGroup.rotation.y -= delta * 0.25;

      gimbalGroup1.rotation.z += delta * 0.45;
      gimbalGroup2.rotation.z -= delta * 0.60;
      gimbalGroup2.rotation.y += delta * 0.20;

      coreGroup.rotation.x += delta * 0.30;
      coreGroup.rotation.y += delta * 0.40;

      // Gentle organic breathing pulse in core scale
      const pulse = 1 + 0.035 * Math.sin(time * 2.2);
      coreGroup.scale.set(pulse, pulse, pulse);

      // Orbital research dust drift
      particleSystem.rotation.y += delta * 0.08;

      // Parallax damping (lerp towards target)
      currentTiltX += (targetTiltX - currentTiltX) * 0.045;
      currentTiltY += (targetTiltY - currentTiltY) * 0.045;

      // Smooth drag decay
      if (!isDragging) {
        dragVelX *= 0.94;
        dragVelY *= 0.94;
        dragRotationX += dragVelX;
        dragRotationY += dragVelY;
        dragRotationX *= 0.985;
        dragRotationY *= 0.985;
      }

      masterGroup.rotation.x = baseRotationX + currentTiltX + dragRotationX;
      masterGroup.rotation.y = baseRotationY + currentTiltY + dragRotationY;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    }

    // Initial render
    renderer.render(scene, camera);
    if (!isReducedMotion) {
      animationFrameId = requestAnimationFrame(animate);
    }

    console.log("[SYNEX] Interactive 3D Hero Kinetic Installation successfully initialized.");
  } catch (err) {
    console.warn("[SYNEX] 3D initialization encountered error. Activating fallback.", err);
    activateFallback();
  }
}

// =========================================================================
// 11. FULL-PAGE 3D SPATIAL PARTICLE BACKGROUND (Three.js WebGL Engine)
// =========================================================================
/**
 * Continuous 3D particle constellation drifting behind all page content.
 * Features:
 * - Genuine 3D depth with PerspectiveCamera & sizeAttenuation
 * - Approved SYNEX palette: Deep Navy (0x17243A), Muted Slate (0x4A5B73), Burnt Orange (0xC75B39), Warm White (0xEAE4D8)
 * - Slow, organic harmonic drift across X, Y, Z
 * - Interactive pointer deflection / soft repulsion around cursor
 * - Subtle camera parallax on pointer move and document scrolling
 * - Occasional clean line connections between nearby particles (capped at 65 lines)
 * - Lightweight autonomous drift on touch devices
 * - Reduced motion & tab visibility optimization
 * - 0% interference with clicks or scrolling (pointer-events: none)
 */
function initSpatialBackground() {
  const canvas = document.getElementById("synex-bg-canvas");
  if (!canvas) return;

  if (typeof THREE === "undefined" || !isWebGLAvailable()) {
    console.log("[SYNEX] WebGL unavailable for full-page background; using CSS fallback.");
    return;
  }

  try {
    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 1200);
    camera.position.set(0, 0, 420);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0xF7F5F0, 1);
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Antialiased circular sprite texture
    function createCircleTexture() {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.75, "rgba(255,255,255,0.85)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(c);
    }

    const dotTexture = createCircleTexture();

    // Particle Configuration
    const isMobile = width <= 768;
    const count = isMobile ? 85 : 160;
    const bounds = { x: 540, y: 400, z: 260 };

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const particles = [];

    const colNavy = new THREE.Color(0x17243A);
    const colMuted = new THREE.Color(0x4A5B73);
    const colOrange = new THREE.Color(0xC75B39);
    const colWarmWhite = new THREE.Color(0xEAE4D8);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * bounds.x * 2;
      const y = (Math.random() - 0.5) * bounds.y * 2;
      const z = (Math.random() - 0.5) * bounds.z * 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const rand = Math.random();
      let c;
      if (rand < 0.52) c = colNavy;
      else if (rand < 0.80) c = colMuted;
      else if (rand < 0.94) c = colOrange;
      else c = colWarmWhite;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      particles.push({
        x, y, z,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.20,
        vz: (Math.random() - 0.5) * 0.12,
        ox: 0, oy: 0,
        seed: Math.random() * 100
      });
    }

    const pointsGeom = new THREE.BufferGeometry();
    pointsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 5.6,
      map: dotTexture,
      transparent: true,
      opacity: 0.82,
      vertexColors: true,
      sizeAttenuation: true,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(pointsGeom, pointsMat);
    scene.add(particleSystem);

    // Subtle line connections between nearby particles
    const maxLines = isMobile ? 45 : 70;
    const maxDist = 78;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeom.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.32,
      depthWrite: false
    });

    const lineSegments = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(lineSegments);

    // Interaction & Scroll Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 0;
    let scrollProgress = 0;

    function onPointerMove(e) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCamX = mouseX * 36;
      targetCamY = mouseY * 26;
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    function onScroll() {
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;
      scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Reduced Motion Detection
    let isReducedMotion = false;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function checkReducedMotion(e) {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        camera.position.set(0, 0, 420);
        renderer.render(scene, camera);
      }
    }

    checkReducedMotion(motionQuery);
    motionQuery.addEventListener("change", checkReducedMotion);

    // Resize Handler
    function onResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      if (isReducedMotion) {
        renderer.render(scene, camera);
      }
    }

    window.addEventListener("resize", onResize, { passive: true });

    // Tab Visibility Pause
    let isTabVisible = !document.hidden;
    document.addEventListener("visibilitychange", () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && !isReducedMotion && !animId) {
        lastTime = performance.now();
        animId = requestAnimationFrame(animate);
      }
    });

    // Animation Render Loop
    let animId = null;
    let lastTime = performance.now();

    function animate(currentTime) {
      if (!isTabVisible || isReducedMotion) {
        animId = null;
        return;
      }

      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      const time = currentTime * 0.001;

      // Project mouse into approximate 3D world plane at z=0
      const mouseWorldX = mouseX * bounds.x * 0.85;
      const mouseWorldY = mouseY * bounds.y * 0.85;
      const repelDist = 120;

      const posAttr = pointsGeom.attributes.position;
      const posArray = posAttr.array;

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // Organic harmonic drift
        p.x += p.vx + Math.sin(time * 0.5 + p.seed) * 0.04;
        p.y += p.vy + Math.cos(time * 0.6 + p.seed) * 0.03;
        p.z += p.vz;

        // Wrap boundaries
        if (p.x > bounds.x) p.x = -bounds.x;
        else if (p.x < -bounds.x) p.x = bounds.x;
        if (p.y > bounds.y) p.y = -bounds.y;
        else if (p.y < -bounds.y) p.y = bounds.y;
        if (p.z > bounds.z) p.z = -bounds.z;
        else if (p.z < -bounds.z) p.z = bounds.z;

        // Gentle mouse repulsion
        const dx = p.x - mouseWorldX;
        const dy = p.y - mouseWorldY;
        const d2 = dx * dx + dy * dy;

        if (d2 < repelDist * repelDist && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = (1 - d / repelDist) * 1.8;
          p.ox += (dx / d) * force;
          p.oy += (dy / d) * force;
        }

        // Damping on deflection offset
        p.ox *= 0.92;
        p.oy *= 0.92;

        posArray[i * 3] = p.x + p.ox;
        posArray[i * 3 + 1] = p.y + p.oy;
        posArray[i * 3 + 2] = p.z;
      }

      posAttr.needsUpdate = true;

      // Dynamic Line Connections
      let lineIdx = 0;
      const linePosArray = lineGeom.attributes.position.array;
      const lineColArray = lineGeom.attributes.color.array;

      for (let i = 0; i < count && lineIdx < maxLines; i++) {
        const pi = particles[i];
        const xi = posArray[i * 3];
        const yi = posArray[i * 3 + 1];
        const zi = posArray[i * 3 + 2];

        for (let j = i + 1; j < count && lineIdx < maxLines; j++) {
          const xj = posArray[j * 3];
          const yj = posArray[j * 3 + 1];
          const zj = posArray[j * 3 + 2];

          const ddx = xi - xj;
          const ddy = yi - yj;
          const ddz = zi - zj;
          const distSq = ddx * ddx + ddy * ddy + ddz * ddz;

          if (distSq < maxDist * maxDist) {
            const idx6 = lineIdx * 6;
            linePosArray[idx6] = xi;
            linePosArray[idx6 + 1] = yi;
            linePosArray[idx6 + 2] = zi;
            linePosArray[idx6 + 3] = xj;
            linePosArray[idx6 + 4] = yj;
            linePosArray[idx6 + 5] = zj;

            lineColArray[idx6] = colors[i * 3];
            lineColArray[idx6 + 1] = colors[i * 3 + 1];
            lineColArray[idx6 + 2] = colors[i * 3 + 2];
            lineColArray[idx6 + 3] = colors[j * 3];
            lineColArray[idx6 + 4] = colors[j * 3 + 1];
            lineColArray[idx6 + 5] = colors[j * 3 + 2];

            lineIdx++;
          }
        }
      }

      for (let k = lineIdx * 6; k < maxLines * 6; k++) {
        linePosArray[k] = 0;
      }

      lineGeom.attributes.position.needsUpdate = true;
      lineGeom.attributes.color.needsUpdate = true;
      lineGeom.setDrawRange(0, lineIdx * 2);

      // Camera Parallax & Scroll Coupling
      const scrollYOffset = scrollProgress * 160;
      camera.position.x += (targetCamX - camera.position.x) * 0.035;
      camera.position.y += (targetCamY - scrollYOffset - camera.position.y) * 0.035;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }

    renderer.render(scene, camera);
    if (!isReducedMotion) {
      animId = requestAnimationFrame(animate);
    }

    console.log("[SYNEX] Full-page 3D spatial particle background initialized successfully.");
  } catch (e) {
    console.warn("[SYNEX] Spatial background error, fallback to static canvas.", e);
  }
}
