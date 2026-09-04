const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const FILE_PLANES = path.join(__dirname, 'data', 'planes.json');
const FILE_TESTIMONIOS = path.join(__dirname, 'data', 'testimonios.json');
const FILE_PORTAFOLIO = path.join(__dirname, 'data', 'portafolio.json');
const FILE_MENSAJES = path.join(__dirname, 'data', 'mensajes.json');

// Credenciales de acceso al panel de administración.
// Cámbialas antes de publicar el sitio en producción.
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'wireless2024';

// ---------- Config ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'svo-paginas-web-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 4 } // 4 horas
}));

// ---------- Helpers de datos ----------
const leer = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));
const guardar = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect('/admin/login');
}

// ---------- Rutas públicas ----------
app.get('/', (req, res) => {
  res.render('index', {
    planes: leer(FILE_PLANES),
    testimonios: leer(FILE_TESTIMONIOS),
    portafolio: leer(FILE_PORTAFOLIO)
  });
});

// Recibir mensajes del formulario de contacto
app.post('/api/contacto', (req, res) => {
  const { nombre, telefono, email, mensaje } = req.body;
  if (!nombre || !telefono || !email || !mensaje) {
    return res.status(400).json({ ok: false, error: 'Faltan datos.' });
  }
  const mensajes = leer(FILE_MENSAJES);
  mensajes.unshift({
    id: Date.now().toString(),
    nombre, telefono, email, mensaje,
    fecha: new Date().toISOString(),
    atendido: false
  });
  guardar(FILE_MENSAJES, mensajes);
  res.json({ ok: true });
});

// ---------- Admin: autenticación ----------
app.get('/admin/login', (req, res) => {
  res.render('admin/login', { error: null });
});

app.post('/admin/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  if (usuario === ADMIN_USER && contrasena === ADMIN_PASS) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'Usuario o contraseña incorrectos.' });
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

// ---------- Admin: panel ----------
app.get('/admin', requireAdmin, (req, res) => {
  res.render('admin/dashboard', {
    planes: leer(FILE_PLANES),
    mensajes: leer(FILE_MENSAJES)
  });
});

// Crear plan
app.post('/admin/planes', requireAdmin, (req, res) => {
  const planes = leer(FILE_PLANES);
  const caracteristicas = (req.body.caracteristicas || '')
    .split('\n').map(l => l.trim()).filter(Boolean);
  planes.push({
    id: Date.now().toString(),
    nombre: req.body.nombre,
    precio: Number(req.body.precio) || 0,
    destacado: req.body.destacado === 'on',
    descripcion: req.body.descripcion,
    caracteristicas
  });
  guardar(FILE_PLANES, planes);
  res.redirect('/admin');
});

// Actualizar plan
app.post('/admin/planes/:id', requireAdmin, (req, res) => {
  const planes = leer(FILE_PLANES);
  const idx = planes.findIndex(p => p.id === req.params.id);
  if (idx !== -1) {
    const caracteristicas = (req.body.caracteristicas || '')
      .split('\n').map(l => l.trim()).filter(Boolean);
    planes[idx] = {
      ...planes[idx],
      nombre: req.body.nombre,
      precio: Number(req.body.precio) || 0,
      destacado: req.body.destacado === 'on',
      descripcion: req.body.descripcion,
      caracteristicas
    };
    guardar(FILE_PLANES, planes);
  }
  res.redirect('/admin');
});

// Eliminar plan
app.post('/admin/planes/:id/eliminar', requireAdmin, (req, res) => {
  let planes = leer(FILE_PLANES);
  planes = planes.filter(p => p.id !== req.params.id);
  guardar(FILE_PLANES, planes);
  res.redirect('/admin');
});

// Marcar mensaje/lead como atendido, o eliminarlo
app.post('/admin/mensajes/:id/atendido', requireAdmin, (req, res) => {
  const mensajes = leer(FILE_MENSAJES);
  const idx = mensajes.findIndex(m => m.id === req.params.id);
  if (idx !== -1) { mensajes[idx].atendido = !mensajes[idx].atendido; guardar(FILE_MENSAJES, mensajes); }
  res.redirect('/admin');
});

app.post('/admin/mensajes/:id/eliminar', requireAdmin, (req, res) => {
  let mensajes = leer(FILE_MENSAJES);
  mensajes = mensajes.filter(m => m.id !== req.params.id);
  guardar(FILE_MENSAJES, mensajes);
  res.redirect('/admin');
});

app.listen(PORT, () => {
  console.log(`SVO Páginas Web corriendo en http://localhost:${PORT}`);
  console.log(`Panel de administración en http://localhost:${PORT}/admin/login`);
  console.log(`Usuario: ${ADMIN_USER} | Contraseña: ${ADMIN_PASS}`);
});
