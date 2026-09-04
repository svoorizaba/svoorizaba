# SVO — Diseño de Páginas Web en Orizaba

Sitio web para vender servicios de diseño de páginas web, con la identidad de **SVO (Sistemas de Videovigilancia Orizaba)**: modo oscuro, efecto cristal (glassmorphism), acentos en degradado azul → cian, y un panel de administración.

## Estructura

```
svo-ecommerce/
├── server.js              # Servidor Express (rutas públicas + admin)
├── data/
│   ├── planes.json        # Los 3 planes/precios que se muestran en el sitio
│   ├── testimonios.json   # Testimonios de clientes
│   ├── portafolio.json    # Tarjetas del portafolio
│   └── mensajes.json      # Mensajes que llegan del formulario de contacto (leads)
├── views/
│   ├── index.ejs           # Página principal
│   ├── partials/           # Header y footer compartidos
│   └── admin/               # Login y dashboard del panel de administración
└── public/
    ├── css/style.css       # Estilos (Tailwind CDN + estilos propios)
    ├── js/main.js          # FAQ, filtro de portafolio, envío de formulario
    └── img/logo.png        # Tu logo
```

## Instalación y ejecución

```bash
npm install
npm start
```

El sitio queda disponible en **http://localhost:3000**
El panel de administración está en **http://localhost:3000/admin/login**

### Credenciales del panel de administración

- Usuario: `admin`
- Contraseña: `orizaba2024`

Puedes cambiarlas definiendo las variables de entorno `ADMIN_USER` y `ADMIN_PASS` antes de iniciar el servidor, por ejemplo:

```bash
ADMIN_USER=svo ADMIN_PASS=miClaveSegura npm start
```

**Importante:** cambia estas credenciales antes de publicar el sitio en internet.

## Qué puedes hacer desde el panel de administración

- **Mensajes de contacto:** ver todos los leads que llegan desde el formulario del sitio, marcarlos como atendidos o eliminarlos.
- **Planes y precios:** editar el nombre, precio, descripción y lista de características de cada plan, marcar uno como "destacado", agregar planes nuevos o eliminarlos. Los cambios se ven reflejados de inmediato en la página principal.

## Personalización rápida

- **Logo:** reemplaza `public/img/logo.png` por tu archivo (mismo nombre) para actualizarlo en todo el sitio.
- **Testimonios y portafolio:** edita directamente `data/testimonios.json` y `data/portafolio.json`.
- **Número de WhatsApp:** cambia el enlace `https://wa.me/522721569109` en `views/partials/footer.ejs`.
- **Colores:** la paleta está definida en el bloque `tailwind.config` dentro de `views/partials/header.ejs` (colores `navy`, `brand`, `cyan`).

## Notas técnicas

- Los datos (planes, testimonios, portafolio, mensajes) se guardan en archivos JSON dentro de `data/`, por lo que no necesitas una base de datos para probar o usar el sitio a baja escala.
- El formulario de contacto envía los datos por `fetch` a `/api/contacto` sin recargar la página, y los guarda en `data/mensajes.json`.
