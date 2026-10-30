/* ============================================================
   LÚMINA STUDIO — script.js
   1. Marca en el menú la sección que se está viendo.
   2. Registra en el píxel de Meta cada clic a WhatsApp.
   ============================================================ */

// 0. Imágenes opcionales: quedan ocultas y solo aparecen si el archivo existe en /img
document.querySelectorAll('img[data-opcional]').forEach((img) => {
  const mostrar = () => {
    if (!img.naturalWidth) return;
    img.hidden = false;
    const slot = img.closest('[data-slot]');
    if (slot) slot.hidden = false;
    // Si la imagen reemplaza un texto (por ejemplo, el logo), se oculta el texto
    if (img.dataset.reemplaza) {
      const texto = img.parentElement.querySelector(img.dataset.reemplaza);
      if (texto) texto.hidden = true;
    }
  };
  if (img.complete) mostrar();
  else img.addEventListener('load', mostrar);
});

// 1. Menú activo según la sección visible
(function () {
  const enlaces = Array.from(document.querySelectorAll('.menu a'));
  const secciones = enlaces
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if (!('IntersectionObserver' in window) || !secciones.length) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      enlaces.forEach((a) =>
        a.classList.toggle('activo', a.getAttribute('href') === '#' + entrada.target.id)
      );
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  secciones.forEach((s) => observador.observe(s));
})();

// 2. Evento "Contact" del píxel al hacer clic en cualquier botón de WhatsApp
document.querySelectorAll('.js-whatsapp').forEach((enlace) => {
  enlace.addEventListener('click', () => {
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', { content_name: 'WhatsApp', ubicacion: enlace.dataset.ubicacion || '' });
    }
  });
});
