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
  // Solo los enlaces a secciones de esta misma página (#...); en el blog no aplica
  const enlaces = Array.from(document.querySelectorAll('.menu a'))
    .filter((a) => (a.getAttribute('href') || '').startsWith('#'));
  const secciones = enlaces
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
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

// 3. Video del celular en el inicio: subtítulos que se iluminan al ritmo de la doctora
(function () {
  const video = document.getElementById('reel-video');
  const sub = document.querySelector('.reel-subtitulo');
  const barra = document.querySelector('.reel-progreso span');
  if (!video || !sub) return;

  // Si la persona prefiere menos movimiento, se queda la imagen fija con el texto completo
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
    return;
  }

  // Tramos en que habla (segundos), medidos en el audio original del video
  const FRASES = [[0.45, 3.55], [4.95, 6.35]];
  const palabras = sub.textContent.trim().split(/\s+/);
  const corte = palabras.findIndex((p) => p.includes('?')) + 1 || Math.ceil(palabras.length / 2);
  const grupos = [palabras.slice(0, corte), palabras.slice(corte)];
  sub.textContent = '';
  const spans = [];
  grupos.forEach((grupo, g) => {
    const [desde, hasta] = FRASES[g] || FRASES[FRASES.length - 1];
    const paso = (hasta - desde) / Math.max(grupo.length, 1);
    grupo.forEach((texto, i) => {
      const s = document.createElement('span');
      s.textContent = texto + ' ';
      s.dataset.t = (desde + paso * i).toFixed(2);
      sub.appendChild(s);
      spans.push(s);
    });
  });

  let animando = false;
  const pintar = () => {
    const t = video.currentTime;
    spans.forEach((s) => s.classList.toggle('dicha', t >= parseFloat(s.dataset.t)));
    if (barra && video.duration) barra.style.width = (t / video.duration * 100).toFixed(1) + '%';
    if (animando) requestAnimationFrame(pintar);
  };
  video.addEventListener('playing', () => {
    sub.classList.add('karaoke');
    if (!animando) { animando = true; requestAnimationFrame(pintar); }
  });
  video.addEventListener('pause', () => { animando = false; });

  // Solo se reproduce cuando el celular está a la vista (ahorra batería y datos)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: 0.25 }).observe(video);
  }
})();

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
    if (!form.acepta.checked) return mostrarError('Para descargar la guía, acepta recibir información de Lúmina Studio.', form.acepta);

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
