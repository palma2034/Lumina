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

// 3. Guía gratuita: valida el formulario, guarda los datos en Google Sheets y muestra la descarga
(function () {
  const form = document.getElementById('guia-form');
  if (!form) return;
  const ENDPOINT = form.dataset.endpoint || '';
  const error = document.getElementById('guia-error');
  const lista = document.getElementById('guia-lista');
  const boton = document.getElementById('guia-enviar');

  const mostrarError = (texto, campo) => {
    error.textContent = texto;
    error.hidden = false;
    if (campo) campo.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    error.hidden = true;
    const nombre = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const correo = form.correo.value.trim();
    // Celular chileno: 9 dígitos que parten en 9, con o sin el 56 adelante
    let digitos = telefono.replace(/\D/g, '');
    if (digitos.length === 11 && digitos.startsWith('56')) digitos = digitos.slice(2);
    const celularOk = /^9\d{8}$/.test(digitos);
    const telefonoNormal = celularOk ? '+56 9 ' + digitos.slice(1, 5) + ' ' + digitos.slice(5) : '';

    if (nombre.length < 2) return mostrarError('Escribe tu nombre.', form.nombre);
    if (!celularOk) return mostrarError('Revisa tu celular: debe tener 9 dígitos y empezar con 9. Por ejemplo: 9 1234 5678.', form.telefono);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) return mostrarError('Revisa tu correo. Por ejemplo: nombre@gmail.com.', form.correo);
    if (!form.acepta.checked) return mostrarError('Para descargar la guía, acepta que te contactemos.', form.acepta);

    boton.disabled = true;
    boton.textContent = 'Enviando…';

    const datos = new URLSearchParams({
      nombre, telefono: telefonoNormal, correo,
      acepta: 'si',
      empresa: form.empresa.value,
      pagina: location.href
    });

    try {
      if (ENDPOINT) await fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: datos });
    } catch (err) {
      // Si falla el registro, igual entregamos la guía: no queremos frustrar a la persona
    }

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', { content_name: 'Guía De la consulta a la reserva' });
    }

    form.hidden = true;
    lista.hidden = false;
    lista.focus();
  });
})();
