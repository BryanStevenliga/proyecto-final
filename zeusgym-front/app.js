/* =========================================================
   ZEUS GYM - app.js
   Lógica principal: navbar móvil, acordeón de reglamento,
   consumo de API (sedes y planes) con fallback a Mock Data,
   y flujo de inscripción con modal + redirección a WhatsApp.
   ========================================================= */

'use strict';

/* ============ CONFIGURACIÓN GLOBAL ============ */
const API_URL = 'https://backzeusgym.byronrm.com/api/';
const WHATSAPP_NUMBER = '593999999999'; // TODO: reemplazar por el número real de Zeus Gym

/* ============ MOCK DATA (RESPALDO LOCAL) ============ */
const MOCK_SEDES = [
  {
    id: 1,
    nombre: 'Sede Norte de Quito',
    direccion: 'Av. Amazonas y Naciones Unidas (C.C. El Jardín)',
    horario: 'Lun-Vie: 05:00 - 23:00 / Sáb-Dom: 07:00 - 18:00',
    imagen: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1974&auto=format&fit=crop',
    telefono: '+593 99 111 2222'
  },
  {
    id: 2,
    nombre: 'Sede Centro de Quito',
    direccion: 'Centro Histórico, Av. Guayaquil y Chile',
    horario: 'Lun-Vie: 06:00 - 22:00 / Sáb-Dom: 08:00 - 16:00',
    imagen: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop',
    telefono: '+593 99 333 4444'
  },
  {
    id: 3,
    nombre: 'Sede Sur de Quito',
    direccion: 'Av. Maldonado y Rodrigo de Chávez (Frente al C.C. El Recreo)',
    horario: 'Lun-Vie: 05:00 - 23:00 / Sáb-Dom: 07:00 - 18:00',
    imagen: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=2070&auto=format&fit=crop',
    telefono: '+593 99 555 6666'
  }
];

const MOCK_PLANES = [
  {
    id: 1,
    nombre: 'Plan Smart',
    precio: '19.90',
    destacado: false,
    beneficios: [
      'Acceso a 1 sede',
      'Zona de pesas y cardio',
      'App de rutinas básicas',
      'Clases grupales limitadas',
      'Sin congelamiento de mes'
    ]
  },
  {
    id: 2,
    nombre: 'Plan Fit',
    precio: '29.90',
    destacado: false,
    beneficios: [
      'Acceso a todas las sedes',
      'Zona de pesas y cardio',
      'Clases grupales ilimitadas',
      'Invita un amigo al mes',
      'Congelamiento de membresía'
    ]
  },
  {
    id: 3,
    nombre: 'Plan Black',
    precio: '39.90',
    destacado: true,
    beneficios: [
      'Acceso a todas las sedes',
      'Zonas VIP y área premium',
      'Clases grupales ilimitadas',
      'Invitados ilimitados',
      'Toallas y lockers incluidos',
      'Descuentos en tienda y suplementos'
    ]
  }
];

/* ============ ESTADO GLOBAL DEL MODAL ============ */
let selectedPlanName = '';
let sedesData = [];
let planesData = [];

/* ============ INICIALIZACIÓN ============ */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAccordion();
  initFooterYear();
  initNavbarScroll();
  initInscripcionModal();
  fetchSedes();
  fetchPlanes();
});

/* ============ MENÚ MÓVIL (HAMBURGUESA) ============ */
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburgerBtn || !mobileMenu) return;

  let isOpen = false;

  const openMenu = () => {
    isOpen = true;
    mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
    mobileMenu.classList.remove('opacity-0');
    mobileMenu.classList.add('opacity-100');
    hamburgerIcon.classList.remove('fa-bars');
    hamburgerIcon.classList.add('fa-xmark');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    isOpen = false;
    mobileMenu.style.maxHeight = '0px';
    mobileMenu.classList.remove('opacity-100');
    mobileMenu.classList.add('opacity-0');
    hamburgerIcon.classList.remove('fa-xmark');
    hamburgerIcon.classList.add('fa-bars');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  };

  hamburgerBtn.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && isOpen) {
      closeMenu();
    }
  });
}

/* ============ EFECTO NAVBAR AL HACER SCROLL ============ */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-lg', 'shadow-black/40');
    } else {
      navbar.classList.remove('shadow-lg', 'shadow-black/40');
    }
  });
}

/* ============ ACORDEÓN DE REGLAMENTO ============ */
function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const icon = trigger.querySelector('.accordion-icon');
      const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

      document.querySelectorAll('.accordion-content').forEach((el) => {
        el.style.maxHeight = '0px';
      });
      document.querySelectorAll('.accordion-icon').forEach((el) => {
        el.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

/* ============ AÑO DINÁMICO EN FOOTER ============ */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ============ MODAL DE INSCRIPCIÓN + INTEGRACIÓN WHATSAPP ============ */
function initInscripcionModal() {
  const modal = document.getElementById('inscripcion-modal');
  const modalBox = modal ? modal.querySelector('.modal-box') : null;
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('inscripcion-form');
  const errorBox = document.getElementById('form-error');
  const errorText = document.getElementById('form-error-text');

  if (!modal || !modalBox || !form) return;

  const showError = (message) => {
    errorText.textContent = message;
    errorBox.classList.remove('hidden');
  };

  const hideError = () => {
    errorBox.classList.add('hidden');
  };

  const openModal = (planName) => {
    selectedPlanName = planName;
    modalTitle.textContent = `Inscripción - ${planName}`;
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    requestAnimationFrame(() => {
      modalBox.classList.remove('scale-95', 'opacity-0');
      modalBox.classList.add('scale-100', 'opacity-100');
    });
  };

  const closeModal = () => {
    modalBox.classList.add('scale-95', 'opacity-0');
    modalBox.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
      form.reset();
      hideError();
    }, 250);
  };

  /* Delegación de eventos: cualquier botón .plan-cta-btn abre el modal */
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.plan-cta-btn');
    if (trigger) {
      event.preventDefault();
      openModal(trigger.dataset.plan || 'Zeus Gym');
    }
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    hideError();

    const nombreCompleto = document.getElementById('input-nombre').value.trim();
    const correo = document.getElementById('input-correo').value.trim();
    const celular = document.getElementById('input-celular').value.trim();
    const sedeSelect = document.getElementById('input-sede');
    const sedeId = Number(sedeSelect.value);

    if (!nombreCompleto || !correo || !celular || !sedeSelect.value) {
      showError('Por favor completa todos los campos antes de continuar.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      showError('Ingresa un correo electrónico válido.');
      return;
    }

    const partesNombre = nombreCompleto.split(/\s+/);
    if (partesNombre.length < 2) {
      showError('Ingresa tu nombre y apellido completos.');
      return;
    }
    const nombre = partesNombre[0];
    const apellido = partesNombre.slice(1).join(' ');

    const sedeObj = sedesData.find((s) => Number(s.id) === sedeId);
    const sedeNombre = sedeObj ? sedeObj.nombre : sedeSelect.options[sedeSelect.selectedIndex].text;

    // Sincroniza el registro con el panel de administración (mejor esfuerzo:
    // si falla, no debe impedir que el cliente sea contactado por WhatsApp).
    const planObj = planesData.find((p) => p.nombre === selectedPlanName);
    if (sedeObj && planObj) {
      fetch(`${API_URL}members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          celular,
          email: correo,
          sede_id: sedeObj.id,
          plan_id: planObj.id,
        }),
      }).catch((error) => {
        console.warn('[Zeus Gym] No se pudo sincronizar el registro con el panel de administración.', error.message);
      });
    } else {
      console.warn('[Zeus Gym] No se pudo determinar la sede o el plan real para sincronizar con el panel de administración.');
    }

    const mensaje = `¡Hola Zeus Gym! Me interesa inscribirme. Mi nombre es ${nombreCompleto}, mi correo es ${correo}, mi celular es ${celular}. Deseo adquirir el ${selectedPlanName} para la sede ${sedeNombre}. ¡Espero su respuesta!`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    closeModal();
  });
}

/* ============ FETCH: SEDES ============ */
async function fetchSedes() {
  const container = document.getElementById('sedes-container');
  if (!container) return;

  try {
    const response = await fetch(`${API_URL}sedes`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    const sedes = Array.isArray(data) ? data : (data.sedes || data.data || []);

    if (!sedes.length) {
      throw new Error('La API no devolvió sedes.');
    }

    sedesData = sedes;
    renderSedes(sedes, container);
    populateSedeSelect(sedes);
  } catch (error) {
    console.warn('[Zeus Gym] No se pudo conectar a la API de sedes. Usando datos simulados.', error.message);
    sedesData = MOCK_SEDES;
    renderSedes(MOCK_SEDES, container);
    populateSedeSelect(MOCK_SEDES);
  }
}

function populateSedeSelect(sedes) {
  const select = document.getElementById('input-sede');
  if (!select) return;

  const placeholder = '<option value="" disabled selected>Selecciona una sede</option>';
  const options = sedes
    .map((sede) => `<option value="${sede.id}">${sede.nombre || sede.name}</option>`)
    .join('');

  select.innerHTML = placeholder + options;
}

function renderSedes(sedes, container) {
  container.innerHTML = sedes.map((sede) => {
    const nombre = sede.nombre || sede.name || 'Sede Zeus Gym';
    const direccion = sede.direccion || sede.address || 'Dirección no disponible';
    const horario = sede.horario || sede.schedule || 'Lun - Dom: 05:00 - 23:00';
    const imagen = sede.imagen || sede.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop';
    const telefono = sede.telefono || sede.phone || '+593 99 000 0000';

    return `
      <div class="card-hover hover:scale-105 transition duration-300 bg-zeus-dark border border-white/5 rounded-2xl overflow-hidden fade-in">
        <div class="relative h-52 overflow-hidden">
          <img src="${imagen}" alt="${nombre}" class="w-full h-full object-cover" loading="lazy"
               onerror="this.src='https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'">
          <div class="absolute top-4 right-4 bg-zeus-gold text-zeus-dark text-xs font-bold uppercase px-3 py-1 rounded-full">
            <i class="fa-solid fa-circle text-[8px] mr-1"></i> Abierto
          </div>
        </div>
        <div class="p-6">
          <h3 class="font-bold text-xl mb-3">${nombre}</h3>
          <div class="flex items-start gap-3 mb-2 text-gray-400 text-sm">
            <i class="fa-solid fa-location-dot text-zeus-gold mt-1"></i>
            <span>${direccion}</span>
          </div>
          <div class="flex items-start gap-3 mb-2 text-gray-400 text-sm">
            <i class="fa-solid fa-clock text-zeus-gold mt-1"></i>
            <span>${horario}</span>
          </div>
          <div class="flex items-start gap-3 mb-5 text-gray-400 text-sm">
            <i class="fa-solid fa-phone text-zeus-gold mt-1"></i>
            <span>${telefono}</span>
          </div>
          <a href="#planes" class="block text-center w-full bg-zeus-gold/10 border border-zeus-gold text-zeus-gold font-bold uppercase text-sm px-6 py-3 rounded-full hover:bg-zeus-gold hover:text-zeus-dark transition-all duration-300">
            Ver Planes
          </a>
        </div>
      </div>
    `;
  }).join('');
}

/* ============ FETCH: PLANES ============ */
async function fetchPlanes() {
  const container = document.getElementById('planes-container');
  if (!container) return;

  try {
    const response = await fetch(`${API_URL}planes`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    const planes = Array.isArray(data) ? data : (data.planes || data.data || []);

    if (!planes.length) {
      throw new Error('La API no devolvió planes.');
    }

    planesData = planes;
    renderPlanes(planes, container);
  } catch (error) {
    console.warn('[Zeus Gym] No se pudo conectar a la API de planes. Usando datos simulados.', error.message);
    planesData = MOCK_PLANES;
    renderPlanes(MOCK_PLANES, container);
  }
}

function renderPlanes(planes, container) {
  container.innerHTML = planes.map((plan) => {
    const nombre = plan.nombre || plan.name || 'Plan Zeus';
    const precio = plan.precio || plan.price || '0.00';
    const destacado = plan.destacado !== undefined ? plan.destacado : !!plan.featured;
    const beneficios = plan.beneficios || plan.benefits || [];

    const beneficiosHtml = beneficios.map((beneficio) => `
      <li class="flex items-center gap-3">
        <i class="fa-solid fa-circle-check text-zeus-gold"></i>
        <span class="${destacado ? 'text-gray-300' : 'text-gray-400'} text-sm">${beneficio}</span>
      </li>
    `).join('');

    if (destacado) {
      return `
        <div class="relative plan-card-black rounded-2xl overflow-hidden card-hover hover:scale-105 transition duration-300 fade-in md:-translate-y-4 shadow-2xl shadow-zeus-gold/10">
          <div class="bg-zeus-gold text-zeus-dark text-center text-xs font-extrabold uppercase tracking-wider py-2">
            <i class="fa-solid fa-star mr-1"></i> El más ventajoso
          </div>
          <div class="p-8">
            <h3 class="font-display text-3xl tracking-wide mb-1 text-zeus-gold">${nombre}</h3>
            <p class="text-gray-400 text-sm mb-6">Para quienes exigen lo mejor</p>
            <div class="flex items-end gap-1 mb-8">
              <span class="text-2xl font-bold text-zeus-gold self-start mt-2">$</span>
              <span class="font-display text-6xl text-white leading-none">${precio}</span>
              <span class="text-gray-400 text-sm mb-1">+ IVA/mes</span>
            </div>
            <ul class="flex flex-col gap-4 mb-10">
              ${beneficiosHtml}
            </ul>
            <button type="button" class="plan-cta-btn btn-shine block text-center w-full bg-zeus-gold text-zeus-dark font-extrabold uppercase text-sm px-6 py-4 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-zeus-gold/30" data-plan="${nombre}">
              Quiero este plan
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="relative bg-zeus-gray border border-white/10 rounded-2xl overflow-hidden card-hover hover:scale-105 transition duration-300 fade-in">
        <div class="p-8">
          <h3 class="font-display text-3xl tracking-wide mb-1 text-white">${nombre}</h3>
          <p class="text-gray-500 text-sm mb-6">Entrena a tu ritmo</p>
          <div class="flex items-end gap-1 mb-8">
            <span class="text-2xl font-bold text-white self-start mt-2">$</span>
            <span class="font-display text-6xl text-white leading-none">${precio}</span>
            <span class="text-gray-500 text-sm mb-1">+ IVA/mes</span>
          </div>
          <ul class="flex flex-col gap-4 mb-10">
            ${beneficiosHtml}
          </ul>
          <button type="button" class="plan-cta-btn block text-center w-full bg-white/5 border border-white/20 text-white font-bold uppercase text-sm px-6 py-4 rounded-full hover:bg-zeus-gold hover:text-zeus-dark hover:border-zeus-gold transition-all duration-300" data-plan="${nombre}">
            Quiero este plan
          </button>
        </div>
      </div>
    `;
  }).join('');
}
