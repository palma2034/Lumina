/* ============================================================
   LUMINA — script.js
   Maneja la apertura y cierre del menú overlay.
   ============================================================ */

const abrir   = document.getElementById('abrirMenu');
const cerrar  = document.getElementById('cerrarMenu');
const menu    = document.getElementById('menuOverlay');

// Abrir el menú
abrir.addEventListener('click', () => {
  menu.classList.add('abierto');
  abrir.setAttribute('aria-expanded', 'true');
});

// Cerrar con la X
cerrar.addEventListener('click', cerrarMenu);

// Cerrar al hacer clic en cualquier enlace (y deja que salte a la sección)
menu.querySelectorAll('a').forEach((enlace) => {
  enlace.addEventListener('click', cerrarMenu);
});

// Cerrar con la tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarMenu();
});

function cerrarMenu() {
  menu.classList.remove('abierto');
  abrir.setAttribute('aria-expanded', 'false');
}
