/* =========================================================
   ZEUS GYM - admin.js
   Panel de administración: CRUD de Miembros contra la API
   Laravel (sedes, planes y members).
   ========================================================= */

'use strict';

/* ============ CONFIGURACIÓN GLOBAL ============ */
const API_URL = 'https://backzeusgym.byronrm.com/api/';

/* ============ ESTADO GLOBAL ============ */
let sedesCache = [];
let planesCache = [];
let editingMemberId = null;

/* ============ ELEMENTOS DEL DOM ============ */
const membersTbody = document.getElementById('members-tbody');
const alertBox = document.getElementById('alert-box');

const memberModal = document.getElementById('member-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalBox = memberModal.querySelector('.modal-box');
const modalTitle = document.getElementById('modal-title');
const modalSubmitText = document.getElementById('modal-submit-text');
const memberForm = document.getElementById('member-form');
const formError = document.getElementById('form-error');
const formErrorText = document.getElementById('form-error-text');

const inputId = document.getElementById('member-id');
const inputNombre = document.getElementById('input-nombre');
const inputApellido = document.getElementById('input-apellido');
const inputEmail = document.getElementById('input-email');
const inputCelular = document.getElementById('input-celular');
const inputSede = document.getElementById('input-sede');
const inputPlan = document.getElementById('input-plan');

const btnNuevoMiembro = document.getElementById('btn-nuevo-miembro');
const modalCloseBtn = document.getElementById('modal-close-btn');

/* ============ INICIALIZACIÓN ============ */
document.addEventListener('DOMContentLoaded', () => {
  initModalEvents();
  bootstrap();
});

async function bootstrap() {
  await Promise.all([loadSedes(), loadPlanes()]);
  await index();
}

/* ============ CARGA DE SEDES Y PLANES (PARA LOS SELECTS) ============ */
async function loadSedes() {
  try {
    const response = await fetch(`${API_URL}sedes`);
    if (!response.ok) throw new Error('No se pudo obtener las sedes');
    sedesCache = await response.json();
    renderSedeOptions();
  } catch (error) {
    showAlert('No se pudieron cargar las sedes. Verifica la conexión con la API.', 'error');
  }
}

async function loadPlanes() {
  try {
    const response = await fetch(`${API_URL}planes`);
    if (!response.ok) throw new Error('No se pudo obtener los planes');
    planesCache = await response.json();
    renderPlanOptions();
  } catch (error) {
    showAlert('No se pudieron cargar los planes. Verifica la conexión con la API.', 'error');
  }
}

function renderSedeOptions() {
  const placeholder = '<option value="" disabled selected>Selecciona una sede</option>';
  const options = sedesCache
    .map((sede) => `<option value="${sede.id}">${escapeHtml(sede.nombre)}</option>`)
    .join('');
  inputSede.innerHTML = placeholder + options;
}

function renderPlanOptions() {
  const placeholder = '<option value="" disabled selected>Selecciona un plan</option>';
  const options = planesCache
    .map((plan) => `<option value="${plan.id}">${escapeHtml(plan.nombre)}</option>`)
    .join('');
  inputPlan.innerHTML = placeholder + options;
}

/* ============ INDEX: LISTAR MIEMBROS ============ */
async function index() {
  setTableLoading();

  try {
    const response = await fetch(`${API_URL}members`);
    if (!response.ok) throw new Error('No se pudo obtener la lista de miembros');
    const members = await response.json();
    renderMembers(members);
  } catch (error) {
    setTableError();
    showAlert('No se pudo cargar la lista de miembros. Verifica la conexión con la API.', 'error');
  }
}

function renderMembers(members) {
  membersTbody.innerHTML = '';

  if (!members.length) {
    membersTbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-10 text-center text-gray-500">
          No hay miembros registrados todavía.
        </td>
      </tr>`;
    return;
  }

  members.forEach((member) => {
    const sedeNombre = member.sede ? member.sede.nombre : '—';
    const planNombre = member.plan ? member.plan.nombre : '—';

    const row = document.createElement('tr');
    row.className = 'hover:bg-white/5 transition-colors duration-150';
    row.innerHTML = `
      <td class="px-6 py-4 font-semibold">${escapeHtml(member.nombre)} ${escapeHtml(member.apellido)}</td>
      <td class="px-6 py-4 text-gray-400">${escapeHtml(member.email)}</td>
      <td class="px-6 py-4 text-gray-400">${escapeHtml(member.celular)}</td>
      <td class="px-6 py-4">
        <span class="inline-block bg-zeus-gray-light border border-white/10 text-gray-200 text-xs px-3 py-1 rounded-full">
          ${escapeHtml(sedeNombre)}
        </span>
      </td>
      <td class="px-6 py-4">
        <span class="inline-block bg-zeus-gold/10 border border-zeus-gold text-zeus-gold text-xs font-bold uppercase px-3 py-1 rounded-full">
          ${escapeHtml(planNombre)}
        </span>
      </td>
      <td class="px-6 py-4">
        <div class="flex items-center justify-end gap-3">
          <button type="button" data-action="edit" data-id="${member.id}" aria-label="Editar miembro"
                  class="w-9 h-9 rounded-full bg-white/5 hover:bg-zeus-gold hover:text-zeus-dark text-gray-300 flex items-center justify-center transition-all duration-200">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button type="button" data-action="delete" data-id="${member.id}" aria-label="Eliminar miembro"
                  class="w-9 h-9 rounded-full bg-white/5 hover:bg-red-500 hover:text-white text-gray-300 flex items-center justify-center transition-all duration-200">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>`;

    membersTbody.appendChild(row);
  });

  membersTbody.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener('click', () => openEditModal(Number(btn.dataset.id)));
  });
  membersTbody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener('click', () => destroy(Number(btn.dataset.id)));
  });
}

function setTableLoading() {
  membersTbody.innerHTML = `
    <tr><td colspan="6" class="px-6 py-6"><div class="skeleton-row h-6 rounded"></div></td></tr>
    <tr><td colspan="6" class="px-6 py-6"><div class="skeleton-row h-6 rounded"></div></td></tr>
    <tr><td colspan="6" class="px-6 py-6"><div class="skeleton-row h-6 rounded"></div></td></tr>`;
}

function setTableError() {
  membersTbody.innerHTML = `
    <tr>
      <td colspan="6" class="px-6 py-10 text-center text-red-400">
        Ocurrió un error al cargar los miembros.
      </td>
    </tr>`;
}

/* ============ MODAL: ABRIR / CERRAR ============ */
function initModalEvents() {
  btnNuevoMiembro.addEventListener('click', openCreateModal);
  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);
  memberForm.addEventListener('submit', handleSubmit);
}

function openCreateModal() {
  editingMemberId = null;
  memberForm.reset();
  inputId.value = '';
  modalTitle.textContent = 'Registrar Miembro';
  modalSubmitText.textContent = 'Guardar Miembro';
  hideFormError();
  openModal();
}

function openEditModal(id) {
  editingMemberId = id;
  modalTitle.textContent = 'Editar Miembro';
  modalSubmitText.textContent = 'Actualizar Miembro';
  hideFormError();

  fetch(`${API_URL}members/${id}`)
    .then((response) => {
      if (!response.ok) throw new Error('No se pudo obtener el miembro');
      return response.json();
    })
    .then((data) => {
      inputId.value = data.id;
      inputNombre.value = data.nombre;
      inputApellido.value = data.apellido;
      inputEmail.value = data.email;
      inputCelular.value = data.celular;
      inputSede.value = data.sede_id;
      inputPlan.value = data.plan_id;
      openModal();
    })
    .catch(() => {
      showAlert('No se pudo cargar la información del miembro a editar.', 'error');
    });
}

function openModal() {
  memberModal.classList.remove('hidden');
  requestAnimationFrame(() => {
    modalBox.classList.remove('scale-95', 'opacity-0');
    modalBox.classList.add('scale-100', 'opacity-100');
  });
}

function closeModal() {
  modalBox.classList.remove('scale-100', 'opacity-100');
  modalBox.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    memberModal.classList.add('hidden');
    memberForm.reset();
    editingMemberId = null;
  }, 300);
}

/* ============ STORE / UPDATE: GUARDAR MIEMBRO ============ */
async function handleSubmit(event) {
  event.preventDefault();
  hideFormError();

  const payload = {
    nombre: inputNombre.value.trim(),
    apellido: inputApellido.value.trim(),
    email: inputEmail.value.trim(),
    celular: inputCelular.value.trim(),
    sede_id: Number(inputSede.value),
    plan_id: Number(inputPlan.value),
  };

  const isEditing = Boolean(editingMemberId);
  const url = isEditing ? `${API_URL}members/${editingMemberId}` : `${API_URL}members`;
  const method = isEditing ? 'PUT' : 'POST';

  toggleSubmitButton(true);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData && errorData.message
        ? errorData.message
        : 'Ocurrió un error al guardar el miembro.';
      throw new Error(message);
    }

    closeModal();
    showAlert(isEditing ? 'Miembro actualizado correctamente.' : 'Miembro registrado correctamente.', 'success');
    await index();
  } catch (error) {
    showFormError(error.message);
  } finally {
    toggleSubmitButton(false);
  }
}

function toggleSubmitButton(disabled) {
  const submitBtn = document.getElementById('modal-submit-btn');
  submitBtn.disabled = disabled;
  submitBtn.classList.toggle('opacity-60', disabled);
  submitBtn.classList.toggle('cursor-not-allowed', disabled);
}

/* ============ DESTROY: ELIMINAR MIEMBRO ============ */
async function destroy(id) {
  const confirmado = confirm('¿Seguro que deseas eliminar a este miembro? Esta acción no se puede deshacer.');
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}members/${id}`, { method: 'DELETE' });
    if (!response.ok && response.status !== 204) {
      throw new Error('No se pudo eliminar el miembro.');
    }

    showAlert('Miembro eliminado correctamente.', 'success');
    await index();
  } catch (error) {
    showAlert(error.message, 'error');
  }
}

/* ============ HELPERS DE UI ============ */
function showAlert(message, type) {
  const isError = type === 'error';
  alertBox.className = `mb-6 rounded-xl px-5 py-4 text-sm font-medium flex items-center gap-3 ${
    isError
      ? 'bg-red-500/10 border border-red-500/40 text-red-400'
      : 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400'
  }`;
  alertBox.innerHTML = `<i class="fa-solid ${isError ? 'fa-triangle-exclamation' : 'fa-circle-check'}"></i> ${escapeHtml(message)}`;
  alertBox.classList.remove('hidden');

  clearTimeout(showAlert._timeout);
  showAlert._timeout = setTimeout(() => alertBox.classList.add('hidden'), 5000);
}

function showFormError(message) {
  formErrorText.textContent = message;
  formError.classList.remove('hidden');
}

function hideFormError() {
  formError.classList.add('hidden');
  formErrorText.textContent = '';
}

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value ?? '';
  return div.innerHTML;
}
