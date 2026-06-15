# Mi Negocio — Plantilla web

Plantilla inicial para una página de negocio/servicio. Hecha con HTML, CSS y un
poco de JavaScript. No necesita ningún programa especial: se abre en cualquier
navegador.

## Estructura de archivos

```
mi-negocio/
├── index.html        ← el contenido y la estructura de la página
├── css/
│   └── estilos.css   ← todos los colores, tipografías y diseño
├── js/
│   └── script.js     ← interactividad (por ahora, el menú móvil)
└── README.md         ← este archivo
```

## Cómo verla

Abre el archivo `index.html` con doble clic, o arrástralo a una ventana del
navegador. Eso es todo.

## Qué editar primero

1. **Nombre del negocio**: busca `TuNegocio` en `index.html` y reemplázalo.
2. **Textos**: cada bloque editable está marcado con un comentario
   `<!-- EDITA ESTO: ... -->`.
3. **Colores y tipografías**: están al inicio de `css/estilos.css`, dentro de
   `:root`. Cambia esos valores y se actualiza toda la página de una vez.
4. **Datos de contacto**: en la sección de contacto del `index.html`.

## Próximos pasos sugeridos

- **Control de versiones (Git)**: dentro de la carpeta, ejecuta `git init`,
  luego crea un repositorio en GitHub y vincúlalo. Así tienes respaldo e
  historial de cambios.
- **Publicar gratis**: con GitHub Pages, Netlify o Vercel puedes dejar el sitio
  online en pocos minutos.
- **Formulario funcional**: hoy el formulario es solo visual. Para que envíe
  mensajes de verdad, lo más simple es usar un servicio como Formspree o
  Netlify Forms (no requiere backend propio).

## Notas

- El diseño es responsivo: se adapta a celular, tablet y escritorio.
- Las tipografías se cargan desde Google Fonts (necesita conexión a internet la
  primera vez). Si quieres, después podemos dejarlas instaladas localmente.
