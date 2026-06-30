/* ════════════════════════════════════════════════════════════════════
 *  mockApi.js — Backend SIMULADO en el navegador (modo demostración)
 *
 *  Intercepta todas las llamadas fetch('/api/...') y las responde en
 *  memoria, sin servidor ni base de datos real. Replica el comportamiento
 *  del backend Express original (auth.js / rooms.js).
 *
 *  El estado se guarda en localStorage para que sobreviva a recargas
 *  durante la demo. NO es persistencia real: se puede resetear borrando
 *  la clave 'penguin_mock_db_v1' del navegador.
 *
 *  Para volver a usar un backend real, basta con NO importar este archivo
 *  en main.jsx.
 * ════════════════════════════════════════════════════════════════════ */

const DB_KEY = 'penguin_mock_db_v1';
const FACE_THRESHOLD = 0.6; // umbral estándar de face-api.js

// ─── Datos semilla ────────────────────────────────────────────────────

// Convierte "Cama King, Chimenea, Jacuzzi" en un array de características.
const feat = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);

const seedRooms = () => [
  { id: 'hab-01', name: 'Suite Iglú Deluxe', price: 350, status: 'disponible', image: '/img/habitacion_hotel_1.png', description: 'Una hermosa suite de hielo con vistas espectaculares a las auroras boreales. Incluye una amplia cama king size con mantas térmicas de alta tecnología, chimenea de vapor de agua, jacuzzi polar climatizado y baño privado.', features: feat('Cama King, Calefacción, Chimenea de vapor, Jacuzzi polar') },
  { id: 'hab-02', name: 'Cabaña Ventisca', price: 250, status: 'ocupada', image: '/img/habitacion_hotel_2.png', description: 'Cabaña rústica construida con troncos de pino alpino de alta calidad. Cuenta con dos camas matrimoniales ultra suaves rellenas de plumón de puffle, balcón privado con fogata de gas y servicio de café de puffle ilimitado.', features: feat('2 Camas Matrimoniales, Fogata en balcón, Café ilimitado') },
  { id: 'hab-03', name: 'Domo Glaciar Premium', price: 500, status: 'disponible', image: '/img/habitacion_hotel_3.png', description: 'Domo geodésico de cristal reforzado ubicado en la cima del glaciar más alto. Ideal para avistamiento de estrellas. Cuenta con calefacción inteligente, telescopio astronómico profesional y una cama redonda ultra cómoda.', features: feat('Cama Redonda, Calefacción inteligente, Telescopio, Vista al cielo') },
  { id: 'hab-04', name: 'Refugio Ventisquero', price: 180, status: 'disponible', image: '/img/habitacion_hotel_4.png', description: 'Un refugio acogedor perfecto para aventureros de la isla. Cuenta con calefacción central, escritorio de madera tallada a mano, minibar surtido con helados de fruta y baño privado con tina de aguas termales.', features: feat('Calefacción central, Escritorio, Minibar, Tina termal') },
  { id: 'hab-05', name: 'Cabaña Ventisca Familiar', price: 400, status: 'disponible', image: '/img/habitacion_hotel_1.png', description: 'Hermosa cabaña familiar de madera alpina en el bosque. Cuenta con tres amplias habitaciones, chimenea tradicional a leña, tina de hidromasaje en la terraza y una vista espectacular del monte Ventisca.', features: feat('3 Dormitorios, Chimenea, Hidromasaje exterior, Cocina equipada') },
  { id: 'hab-06', name: 'Estudio Nieve Nueva', price: 190, status: 'disponible', image: '/img/habitacion_hotel_2.png', description: 'Ideal para parejas o aventureros solitarios. Este estudio minimalista ofrece calefacción radiante en el piso, cafetera espresso automática con granos premium y un gran ventanal con vistas al patio central del hotel.', features: feat('Cama Queen, Calefacción radiante, Minibar, Vista al patio') },
  { id: 'hab-07', name: 'Suite Aurora Boreal', price: 600, status: 'disponible', image: '/img/habitacion_hotel_3.png', description: 'Nuestra joya del hotel. Suite en el último piso con techo completamente vidriado y retráctil para disfrutar del cielo estrellado y las auroras sin salir de la comodidad de la cama King con sábanas de seda térmica.', features: feat('Techo de cristal, Cama King, Jacuzzi, Champaña de cortesía') },
  { id: 'hab-08', name: 'Refugio Ventisquero Suite', price: 320, status: 'disponible', image: '/img/habitacion_hotel_4.png', description: 'La versión premium de nuestro clásico refugio. Cuenta con sala de estar independiente con sillones de cuero, minibar premium libre de costo, sauna privado integrado en el baño y balcón con telescopio.', features: feat('Sauna privado, Sala de estar, Minibar premium, Balcón con telescopio') },
  { id: 'hab-09', name: 'Suite Glaciar Esmeralda', price: 380, status: 'ocupada', image: '/img/habitacion_hotel_1.png', description: 'Decorada con detalles en hielo teñido de verde esmeralda y luces LED ambientales. Ofrece una ambientación fantástica con cama con dosel, sistema de sonido envolvente, ducha escocesa de alta presión y chimenea ecológica.', features: feat('Cama dosel, Ducha escocesa, Luces LED rítmicas, Chimenea ecológica') },
  { id: 'hab-10', name: 'Iglú Tradicional de Nieve', price: 150, status: 'disponible', image: '/img/habitacion_hotel_2.png', description: 'Para quienes buscan la auténtica experiencia polar. Construido con bloques de hielo compactado a mano. Equipado con bolsas de dormir térmicas de grado expedición y fogata central simulada sin humo para tu total seguridad.', features: feat('Bolsas expedición, Fogata segura, Experiencia autóctona') },
  { id: 'hab-11', name: 'Domo Geodésico Ventisca', price: 450, status: 'disponible', image: '/img/habitacion_hotel_3.png', description: 'Una estructura futurista en medio del paisaje nevado. Equipado con domótica completa para controlar la temperatura, luces y cortinas desde una tableta. Incluye cama suspendida y un telescopio digital de alta gama.', features: feat('Control por tablet, Cama suspendida, Telescopio digital') },
  { id: 'hab-12', name: 'Cabaña Bosque de Pinos', price: 280, status: 'disponible', image: '/img/habitacion_hotel_4.png', description: 'Rodeada de pinos cargados de nieve fresca. Esta cabaña ofrece una tranquilidad inigualable. Cuenta con cocina completa de concepto abierto, estufa de hierro fundido a leña y una pequeña biblioteca con novelas clásicas.', features: feat('Cocina completa, Estufa de hierro, Biblioteca, Rodeada de bosque') },
  { id: 'hab-13', name: 'Suite Nupcial de Hielo', price: 550, status: 'disponible', image: '/img/habitacion_hotel_1.png', description: 'Especialmente diseñada para lunas de miel o escapadas románticas. Incluye decoraciones florales congeladas en las paredes, jacuzzi doble con sales termales aromáticas, cama con dosel de piel sintética y servicio a la habitación 24/7.', features: feat('Jacuzzi doble, Decoración romántica, Cama dosel, Servicio 24/7') },
  { id: 'hab-14', name: 'Refugio del Explorador', price: 170, status: 'disponible', image: '/img/habitacion_hotel_2.png', description: 'Diseñado en honor a los grandes exploradores de la isla. Cuenta con mapas históricos, detalles en bronce y madera envejecida, una cama matrimonial sumamente cómoda y una cafetera de prensa francesa con granos de origen único.', features: feat('Detalles antiguos, Cama matrimonial, Prensa francesa, Minibar') },
  { id: 'hab-15', name: 'Iglú Familiar Nevado', price: 310, status: 'disponible', image: '/img/habitacion_hotel_3.png', description: 'Un iglú de gran escala ideal para familias pequeñas con niños. Equipado con un área de juegos con consolas retro, dos camas matrimoniales y servicio de chocolate caliente con malvaviscos de cortesía todas las tardes.', features: feat('Área de videojuegos, 2 Camas, Chocolate de cortesía, Muy amplio') },
];

// Usuarios de demo con contraseñas en texto plano (es una simulación).
const seedUsers = () => [
  { id: 'admin-id-0001', name: 'Administrador', email: 'admin@gmail.com', password: 'admin123', role: 'admin', verified: true, faceDescriptor: null, createdAt: '2026-06-21T01:45:00.000Z' },
  { id: 'client-id-0002', name: 'Cliente de Prueba', email: 'cliente@gmail.com', password: 'cliente123', role: 'client', verified: true, faceDescriptor: null, createdAt: '2026-06-21T01:45:00.000Z' },
];

// Una reserva semilla para que el dashboard del cliente y las finanzas
// del admin muestren datos desde el inicio.
const seedReservations = () => [
  { id: 'res-seed-0001', roomId: 'hab-02', roomName: 'Cabaña Ventisca', userId: 'client-id-0002', userName: 'Cliente de Prueba', userEmail: 'cliente@gmail.com', date: '2026-06-25T10:00:00.000Z', startDate: '2026-07-01', endDate: '2026-07-04', price: 250 },
];

const initialDb = () => ({
  users: seedUsers(),
  rooms: seedRooms(),
  reservations: seedReservations(),
  history: [],
});

// ─── Persistencia en localStorage ─────────────────────────────────────

let db;
try {
  const raw = localStorage.getItem(DB_KEY);
  db = raw ? JSON.parse(raw) : initialDb();
} catch {
  db = initialDb();
}

const save = () => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    /* almacenamiento lleno o no disponible: la demo sigue en memoria */
  }
};
save();

// ─── Utilidades ───────────────────────────────────────────────────────

const uid = () =>
  (crypto.randomUUID && crypto.randomUUID()) ||
  'id-' + Date.now() + '-' + Math.random().toString(16).slice(2);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const euclideanDistance = (a, b) => {
  if (!a || !b || a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
};

const makeToken = (user) => 'mockjwt.' + user.id;

const userFromAuth = (init) => {
  const h = (init.headers && (init.headers.Authorization || init.headers.authorization)) || '';
  const token = h.replace('Bearer ', '');
  if (!token.startsWith('mockjwt.')) return null;
  const id = token.slice('mockjwt.'.length);
  return db.users.find((u) => u.id === id) || null;
};

const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role || 'client',
  createdAt: u.createdAt,
});

// Respuesta tipo `Response` (las páginas solo usan .ok y .json()).
const reply = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

// Pequeño retardo para imitar una llamada de red real.
const delay = () => new Promise((r) => setTimeout(r, 180));

// ─── Enrutador de la API simulada ─────────────────────────────────────

async function handle(path, method, body, init) {
  // ----- AUTH -----
  if (path === '/api/auth/register' && method === 'POST') {
    const { name, email, password, faceDescriptor } = body;
    if (!name || !email || !password) return reply(400, { error: 'Todos los campos son obligatorios' });
    if (name.trim().length < 2) return reply(400, { error: 'El nombre debe tener al menos 2 caracteres' });
    if (!isValidEmail(email)) return reply(400, { error: 'El formato del email no es válido' });
    if (password.length < 6) return reply(400, { error: 'La contraseña debe tener al menos 6 caracteres' });
    if (db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()))
      return reply(409, { error: 'El email ya está registrado en el sistema' });

    const newUser = {
      id: uid(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      faceDescriptor: faceDescriptor || null,
      role: 'client',
      verified: true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    save();
    return reply(201, { message: 'Cuenta creada exitosamente.', token: makeToken(newUser), user: publicUser(newUser) });
  }

  if (path === '/api/auth/login' && method === 'POST') {
    const { email, password } = body;
    if (!email || !password) return reply(400, { error: 'Email y contraseña son requeridos' });
    const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase().trim());
    if (!user || user.password !== password) return reply(401, { error: 'Credenciales incorrectas' });
    return reply(200, { message: 'Sesión iniciada exitosamente', token: makeToken(user), user: publicUser(user) });
  }

  if (path === '/api/auth/login-face' && method === 'POST') {
    const { faceDescriptor } = body;
    if (!faceDescriptor || !Array.isArray(faceDescriptor)) return reply(400, { error: 'Descriptor facial requerido' });
    let best = null;
    let min = Infinity;
    for (const u of db.users) {
      if (u.faceDescriptor) {
        const dist = euclideanDistance(faceDescriptor, u.faceDescriptor);
        if (dist < min) { min = dist; best = u; }
      }
    }
    if (best && min < FACE_THRESHOLD)
      return reply(200, { message: 'Sesión facial iniciada exitosamente', token: makeToken(best), user: publicUser(best) });
    return reply(401, { error: 'Rostro no reconocido' });
  }

  if (path === '/api/auth/forgot' && method === 'POST') {
    return reply(200, { message: 'Si el email está registrado, recibirás las instrucciones (simulado en modo demo).' });
  }

  if (path === '/api/auth/admin/users' && method === 'GET') {
    const admin = userFromAuth(init);
    if (!admin || admin.role !== 'admin') return reply(403, { error: 'Acceso denegado.' });
    return reply(200, db.users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role || 'client', verified: u.verified, createdAt: u.createdAt })));
  }

  // ----- ROOMS (rutas específicas primero) -----
  if (path === '/api/rooms' && method === 'GET') {
    return reply(200, db.rooms);
  }

  if (path === '/api/rooms/my-reservations' && method === 'GET') {
    const user = userFromAuth(init);
    if (!user) return reply(401, { error: 'No autorizado' });
    return reply(200, db.reservations.filter((r) => r.userId === user.id));
  }

  if (path === '/api/rooms/admin/financial-stats' && method === 'GET') {
    const admin = userFromAuth(init);
    if (!admin || admin.role !== 'admin') return reply(403, { error: 'Acceso denegado.' });
    const clientes = db.users.filter((u) => u.role !== 'admin');
    let totalRevenue = 0;
    const clients = clientes.map((user) => {
      const reservas = db.reservations.filter((r) => r.userId === user.id);
      let totalPaid = 0;
      const details = reservas.map((r) => {
        let nights = 1;
        if (r.startDate && r.endDate) {
          const diff = Math.round((new Date(r.endDate) - new Date(r.startDate)) / (1000 * 60 * 60 * 24));
          if (diff > 0) nights = diff;
        }
        const total = r.price * nights;
        totalPaid += total;
        return { roomName: r.roomName, period: `${r.startDate} al ${r.endDate}`, nights, pricePerNight: r.price, total };
      });
      totalRevenue += totalPaid;
      return { userId: user.id, name: user.name, email: user.email, verified: user.verified, reservationsCount: reservas.length, totalPaid, details };
    });
    return reply(200, { totalRevenue, clients });
  }

  if (path === '/api/rooms/admin/toggle-status' && method === 'POST') {
    const admin = userFromAuth(init);
    if (!admin || admin.role !== 'admin') return reply(403, { error: 'Acceso denegado.' });
    const { roomId, status } = body;
    if (!roomId || !['disponible', 'ocupada'].includes(status)) return reply(400, { error: 'Datos inválidos' });
    const room = db.rooms.find((r) => r.id === roomId);
    if (!room) return reply(404, { error: 'Habitación no encontrada' });
    if (room.status === status) return reply(400, { error: `La habitación ya se encuentra en estado: ${status}` });
    room.status = status;
    db.history.push({ id: uid(), type: 'cambio_estado', description: `El administrador cambió el estado de "${room.name}" a "${status.toUpperCase()}"`, date: new Date().toISOString(), userId: admin.id, userName: admin.name, roomId });
    save();
    return reply(200, { message: 'Estado actualizado', room });
  }

  // PUT /api/rooms/admin/:id
  let m = path.match(/^\/api\/rooms\/admin\/([^/]+)$/);
  if (m && method === 'PUT') {
    const admin = userFromAuth(init);
    if (!admin || admin.role !== 'admin') return reply(403, { error: 'Acceso denegado.' });
    const { name, description, price } = body;
    if (!name || !description || price === undefined) return reply(400, { error: 'Nombre, descripción y precio son requeridos' });
    const room = db.rooms.find((r) => r.id === m[1]);
    if (!room) return reply(404, { error: 'Habitación no encontrada' });
    room.name = name;
    room.description = description;
    room.price = Number(price);
    save();
    return reply(200, { message: 'Habitación actualizada exitosamente', room });
  }

  // POST /api/rooms/:id/reserve
  m = path.match(/^\/api\/rooms\/([^/]+)\/reserve$/);
  if (m && method === 'POST') {
    const user = userFromAuth(init);
    if (!user) return reply(401, { error: 'No autorizado' });
    const { startDate, endDate } = body;
    if (!startDate || !endDate) return reply(400, { error: 'Debes seleccionar una fecha de inicio y fin para tu reserva' });
    const room = db.rooms.find((r) => r.id === m[1]);
    if (!room) return reply(404, { error: 'Habitación no encontrada' });
    if (room.status !== 'disponible') return reply(400, { error: 'La habitación ya está ocupada o reservada' });
    room.status = 'ocupada';
    const reservation = { id: uid(), roomId: room.id, roomName: room.name, userId: user.id, userName: user.name, userEmail: user.email, date: new Date().toISOString(), startDate, endDate, price: room.price };
    db.reservations.push(reservation);
    db.history.push({ id: uid(), type: 'reserva', description: `Habitación "${room.name}" reservada por ${user.name} desde ${startDate} hasta ${endDate}`, date: new Date().toISOString(), userId: user.id, userName: user.name, roomId: room.id });
    save();
    return reply(200, { message: 'Reserva realizada exitosamente', reservation });
  }

  // GET /api/rooms/:id  (genérica, al final)
  m = path.match(/^\/api\/rooms\/([^/]+)$/);
  if (m && method === 'GET') {
    const room = db.rooms.find((r) => r.id === m[1]);
    if (!room) return reply(404, { error: 'Habitación no encontrada' });
    return reply(200, room);
  }

  return reply(404, { error: 'Endpoint no encontrado (mock): ' + method + ' ' + path });
}

// ─── Interceptor de fetch ─────────────────────────────────────────────

const originalFetch = window.fetch ? window.fetch.bind(window) : null;

window.fetch = async (input, init = {}) => {
  const url = typeof input === 'string' ? input : (input && input.url) || '';
  let path = url;
  try {
    path = new URL(url, window.location.origin).pathname;
  } catch {
    /* url relativa simple */
  }

  // Solo interceptamos la API; el resto (modelos de IA, imágenes, fuentes) pasa de largo.
  if (!path.startsWith('/api/')) {
    if (originalFetch) return originalFetch(input, init);
    throw new Error('fetch no disponible para: ' + url);
  }

  const method = (init.method || 'GET').toUpperCase();
  let body = {};
  if (init.body) {
    try { body = JSON.parse(init.body); } catch { body = {}; }
  }

  await delay();
  return handle(path, method, body, init);
};

console.info('🐧 Modo DEMO activo: backend simulado en el navegador (mockApi.js). Sin servidor ni base de datos.');
