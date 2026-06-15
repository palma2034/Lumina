/* ============================================================
   script.js — Interactividad de la página
   Por ahora solo maneja el menú en móvil.
   Aquí irás agregando más funciones cuando las necesites.
   ============================================================ */

// Menú móvil: abrir/cerrar al tocar el botón hamburguesa
const botonMenu = document.querySelector('.menu-boton');
const menu = document.querySelector('.nav');

if (botonMenu && menu) {
  botonMenu.addEventListener('click', () => {
    const estaAbierto = menu.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', estaAbierto);
  });

  // Cerrar el menú al hacer clic en un enlace (útil en móvil)
  menu.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      menu.classList.remove('abierto');
      botonMenu.setAttribute('aria-expanded', 'false');
    });
  });
}
