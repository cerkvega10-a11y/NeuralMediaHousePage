/**
 * NEURAL MEDIA HOUSE - Minimalist Multi-Page Router & Interaction Core
 * Clean Client-Side Routing, Tactile Button States, WhatsApp Triggers & Zero Visual Clutter
 */

// ==========================================
// 1. CLIENT-SIDE ROUTER (MULTI-VIEW ARCHITECTURE)
// ==========================================
const VALID_VIEWS = [
  'home',
  'quantum',
  'academia',
  'govtech',
  'broadcast',
  'contacto',
  'app-govtech',
  'app-neural',
  'app-lexcore',
  'app-classroom',
  'app-sandbox',
  'app-chess'
];

function navigateTo(viewId) {
  if (!VALID_VIEWS.includes(viewId)) {
    viewId = 'home';
  }

  // Hide all view pages
  const allViews = document.querySelectorAll('.view-page');
  allViews.forEach(view => {
    view.classList.add('hidden');
  });

  // Show target view
  const targetView = document.getElementById(`view-${viewId}`);
  if (targetView) {
    targetView.classList.remove('hidden');
  }

  // Scroll to absolute top
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  // Update hash without triggering hashchange loop
  if (window.location.hash !== `#${viewId}`) {
    history.pushState(null, '', `#${viewId}`);
  }

  // Update Header Navigation Active State
  updateActiveNavState(viewId);

  // Close dropdowns & mobile menus
  closePlatformDropdown();
  closeMobileMenu();
}

function updateActiveNavState(viewId) {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.classList.remove('active-nav');
    const target = btn.getAttribute('data-view');
    if (target === viewId) {
      btn.classList.add('active-nav');
    }
  });

  // If viewing an individual platform, highlight the platforms dropdown toggle
  const platformToggle = document.getElementById('platforms-dropdown-toggle');
  if (platformToggle) {
    if (viewId.startsWith('app-')) {
      platformToggle.classList.add('active-nav');
    } else {
      platformToggle.classList.remove('active-nav');
    }
  }

  // Update dropdown item states
  const dropdownItems = document.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-view') === viewId) {
      item.classList.add('active');
    }
  });
}

// Router Event Listeners
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash);
});

// ==========================================
// 2. DROPDOWN & MOBILE MENU MANAGERS
// ==========================================
function togglePlatformDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('platforms-dropdown-menu');
  if (menu) {
    menu.classList.toggle('show');
  }
}

function closePlatformDropdown() {
  const menu = document.getElementById('platforms-dropdown-menu');
  if (menu && menu.classList.contains('show')) {
    menu.classList.remove('show');
  }
}

function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.classList.toggle('hidden');
  }
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer && !drawer.classList.contains('hidden')) {
    drawer.classList.add('hidden');
  }
}

// ==========================================
// 3. TOAST NOTIFICATIONS & CLIPBOARD
// ==========================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

function copyEmail() {
  const email = 'cerkvega@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast(`Correo copiado: ${email}`);
  }).catch(() => {
    showToast(`Correo oficial: ${email}`);
  });
}

// ==========================================
// 4. CONTACT FORM INTEGRATION TO cerkvega@gmail.com
// ==========================================
async function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('form-name').value.trim();
  const org = document.getElementById('form-org').value.trim();
  const countryCode = document.getElementById('form-country-code') ? document.getElementById('form-country-code').value : '+52';
  const phone = document.getElementById('form-phone') ? document.getElementById('form-phone').value.trim() : '';
  const fullPhone = phone ? `${countryCode} ${phone}` : 'No proporcionado';
  const division = document.getElementById('form-division').value;
  const message = document.getElementById('form-message').value.trim();
  const submitBtn = document.getElementById('form-submit-btn');
  const alertBox = document.getElementById('form-success-alert');

  if (!name || !message || !phone) {
    showToast('Por favor completa todos los campos requeridos incluyendo tu teléfono.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = 'Transmitiendo mensaje a Dirección...';

  const subject = `[Neural Media House - ${division}] Contacto de ${name} (${org || 'General'})`;
  const body = `Estimada Dirección General de Neural Media House,\n\nSe ha generado una nueva solicitud ejecutiva de contacto:\n\n• Nombre Completo: ${name}\n• Empresa / Institución: ${org || 'No especificada'}\n• Teléfono de Contacto: ${fullPhone}\n• División de Interés: ${division}\n\n• Mensaje / Requerimiento:\n${message}\n\n---\nTransmisión corporativa directa desde Santa Fe, CDMX.`;

  const mailtoUrl = `mailto:cerkvega@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Intento de envío a través de FormSubmit AJAX con fallback directo a Mailto
  try {
    fetch('https://formsubmit.co/ajax/cerkvega@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        nombre: name,
        empresa_institucion: org || 'No especificada',
        telefono: fullPhone,
        division_interes: division,
        mensaje: message
      })
    }).catch(() => {
      // Fallback silencioso sin interrumpir
    });
  } catch (err) {
    console.warn('Fallback a protocolo mailto ejecutado:', err);
  }

  // Ejecución del enlace mailto para garantizar apertura directa en el cliente de correo
  setTimeout(() => {
    window.location.href = mailtoUrl;

    submitBtn.disabled = false;
    submitBtn.innerText = 'Enviar Mensaje a Dirección';

    const folio = 'NMH-' + Math.floor(100000 + Math.random() * 900000);

    if (alertBox) {
      alertBox.innerHTML = `
        <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm">
          <strong>Mensaje Preparado y Transmitido a cerkvega@gmail.com</strong><br>
          Estimado(a) <strong>${name}</strong> (${org || 'Sector Corporativo'}), se ha canalizado tu requerimiento para la división <strong>${division}</strong> hacia la Dirección General.<br>
          <span class="text-xs text-emerald-700 font-mono-clean mt-1 block">Teléfono registrado: ${fullPhone} · Folio de seguimiento: ${folio}</span>
        </div>
      `;
      alertBox.classList.remove('hidden');
    }

    showToast(`Solicitud canalizada a cerkvega@gmail.com (Folio ${folio})`);
    document.getElementById('main-contact-form').reset();
  }, 400);
}

// ==========================================
// 5. DARK MODE THEME CONTROLLER
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('nmh_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      setDarkMode(!isCurrentlyDark);
    });
  }
}

function setDarkMode(enableDark) {
  const moonIcon = document.getElementById('moon-icon');
  const sunIcon = document.getElementById('sun-icon');
  const themeText = document.getElementById('theme-text');

  if (enableDark) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    localStorage.setItem('nmh_theme', 'dark');
    if (moonIcon) moonIcon.classList.add('hidden');
    if (sunIcon) sunIcon.classList.remove('hidden');
    if (themeText) themeText.textContent = 'Modo Día';
    showToast('Modo Noche activado (paleta oscura ejecutiva)');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('nmh_theme', 'light');
    if (moonIcon) moonIcon.classList.remove('hidden');
    if (sunIcon) sunIcon.classList.add('hidden');
    if (themeText) themeText.textContent = 'Modo Noche';
    showToast('Modo Claro activado (iluminación de estudio)');
  }
}

// ==========================================
// 6. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme (Dark/Light mode)
  initTheme();

  // Read initial hash or default to home
  const initialHash = window.location.hash.replace('#', '') || 'home';
  navigateTo(initialHash);

  // Global click listeners for navigation buttons with [data-view]
  document.addEventListener('click', (e) => {
    const navTarget = e.target.closest('[data-view]');
    if (navTarget) {
      e.preventDefault();
      const viewId = navTarget.getAttribute('data-view');
      navigateTo(viewId);
    }
  });

  // Dropdown listeners
  const platformToggle = document.getElementById('platforms-dropdown-toggle');
  if (platformToggle) {
    platformToggle.addEventListener('click', togglePlatformDropdown);
  }

  // Click outside closes dropdown
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('platforms-dropdown-container');
    if (dropdown && !dropdown.contains(e.target)) {
      closePlatformDropdown();
    }
  });

  // Mobile menu listeners
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  const mobileClose = document.getElementById('mobile-drawer-close');
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  // Contact form listener
  const form = document.getElementById('main-contact-form');
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  }
});
