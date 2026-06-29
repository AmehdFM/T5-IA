# Informe de Proyecto: Sistema de Gestión Hotel Club Penguin 🐧

Este documento proporciona una explicación detallada del sistema de reservas del **Hotel Club Penguin**, incluyendo su arquitectura general, la descripción técnica de todas las páginas y vistas, la funcionalidad implementada y el flujo de los roles de usuario (Cliente y Administrador).

---

## 1. Descripción General del Sistema

El sistema es una aplicación web SPA (Single Page Application) montada sobre una arquitectura cliente-servidor (Node.js/Express) contenerizada con Docker. La persistencia de datos se gestiona mediante archivos JSON en disco en lugar de una base de datos relacional compleja, lo que facilita el despliegue inmediato sin configuraciones externas.

El diseño visual está inspirado en la estética alegre y colorida del juego clásico **Club Penguin** (fuentes tipográficas redondeadas, colores azules, amarillos y naranjas contrastantes, bordes gruesos y uso de emojis polares). A nivel de experiencia de usuario, se eliminaron las tarjetas genéricas en favor de contenedores planos minimalistas e integrados que utilizan el 100% de la pantalla para mejorar el espacio y legibilidad.

---

## 2. Arquitectura de Archivos y Directorios

```text
├── backend/
│   ├── data/            # Persistencia local (JSON)
│   │   ├── users.json        # Base de datos de usuarios (con contraseñas hasheadas mediante bcrypt)
│   │   ├── rooms.json        # Base de datos de 15 habitaciones e iglús del hotel
│   │   ├── reservations.json # Listado global de reservas
│   │   └── history.json      # Logs de movimientos para auditoría del admin
│   ├── middleware/      # Capa de seguridad
│   │   └── validateToken.js  # Validación de tokens JWT y expiración de sesiones
│   ├── routes/          # Controladores de la API REST
│   │   ├── auth.js           # Rutas para registro, verificación, login y restablecimiento
│   │   └── rooms.js          # Rutas para habitaciones, reservas y reportes del admin
│   ├── package.json     # Declaración de dependencias del servidor
│   └── server.js        # Configuración e inicio del servidor HTTP Express
├── frontend-react/      # Frontend migrado a React + Vite
│   ├── public/          # Archivos estáticos (img, models de Face API, favicon)
│   ├── src/
│   │   ├── pages/            # Páginas de la app (Landing, Login, Register, Dashboards, etc.)
│   │   ├── styles.css        # Hoja de estilos con variables de color y tipografía de Club Penguin
│   │   ├── index.css         # Estilos base y de componentes de las páginas React
│   │   ├── App.jsx           # Definición de rutas (React Router)
│   │   └── main.jsx          # Punto de entrada de la aplicación
│   ├── index.html       # HTML raíz que monta la app React
│   ├── vite.config.js   # Configuración de Vite
│   └── package.json     # Dependencias y scripts del frontend (build / dev)
├── Dockerfile           # Receta de empaquetado Docker (Node.js Alpine)
└── README.md            # Informe y manual de uso del sistema
```

---

## 3. Detalle de Páginas y Vistas del Sistema

### 3.1. Pantalla de Inicio de Sesión (`index.html` y `login.js`)
* **Propósito**: Punto de acceso controlado al sistema mediante credenciales.
* **Funcionalidad**:
  * Formulario minimalista con validación de campos vacíos del lado del cliente.
  * Botón para alternar la visibilidad de la contraseña.
  * Petición POST a `/api/auth/login`. Si el login es exitoso, almacena el token JWT y los datos del usuario en el `localStorage` y lo redirige a su panel correspondiente según su rol (`client` o `admin`).

### 3.2. Pantalla de Registro (`register.html` y `register.js`)
* **Propósito**: Permite a nuevos usuarios del hotel registrarse en la plataforma.
* **Funcionalidad**:
  * Campos obligatorios: Nombre completo, Correo electrónico y Contraseña (mínimo 6 caracteres).
  * Indicador visual de fortaleza de contraseña en tiempo real (Muy débil → Muy fuerte).
  * **Paso de Verificación por Código (Simulado)**: Antes de crear la cuenta, el sistema realiza una validación de identidad. Tras completar el formulario correctamente, se despliega un **modal de verificación de cuenta** con el mensaje:
    > *"Ingresa el código de verificación enviado al correo ingresado"*
  * El usuario debe ingresar el **código por defecto `333777`** (código fijo de simulación, ya que el sistema no envía correos reales). Si el código es incorrecto, se muestra un mensaje de error sin cerrar el modal. Solo al ingresar el código correcto el sistema procede a crear la cuenta vía `POST /api/auth/register`.
  * Una vez creada la cuenta, el sistema almacena el token JWT en `localStorage` y redirige automáticamente al panel de cliente.

### 3.3. Panel del Cliente (`client-dashboard.html` y `client-dashboard.js`)
* **Propósito**: Interfaz de autogestión de estadías para los clientes del hotel.
* **Funcionalidad**:
  * **Diseño de dos columnas ordenadas** que maximiza el espacio horizontal útil de la pantalla.
  * **Columna Izquierda - Habitaciones Disponibles**: Muestra un listado ordenado de las habitaciones e iglús en estado "disponible" (obtenidas mediante un `GET` cruzado de la API). Cuenta con imágenes optimizadas y un botón para ver los detalles.
  * **Columna Derecha - Mis Habitaciones**: Muestra las reservas activas del usuario actual de manera clara. Se renderiza la imagen de la habitación, el rango de fechas reservado (llegada y salida), el precio por noche y el importe total en Lempiras (`L.`).

### 3.4. Vista Detalle de Habitación (`room-detail.html` y `room-detail.js`)
* **Propósito**: Muestra la descripción extendida y comodidades de una habitación seleccionada para completar una reserva.
* **Funcionalidad**:
  * Carga dinámica de la información (imágenes, título, descripción larga y comodidades en forma de lista) utilizando el parámetro de búsqueda `?id=xxx` en la URL.
  * **Modal de Rango de Fechas**: Al pulsar "Reservar Habitación", se despliega un cuadro de diálogo donde el usuario selecciona la fecha de llegada y salida (con validación para no elegir fechas pasadas ni rangos inconsistentes).
  * **Cálculo en Tiempo Real**: Calcula la cantidad de noches del rango y actualiza de inmediato el precio total a pagar en Lempiras (`L.`).

### 3.5. Panel de Administración (`admin-dashboard.html` y `admin-dashboard.js`)
* **Propósito**: Panel de control del hotel para el personal administrativo.
* **Funcionalidad**:
  * **Sistema de navegación por pestañas en la barra superior** para alternar vistas dinámicamente sin recargar la página.
  * **Pestaña 1: Control de Habitaciones**:
    * Muestra métricas rápidas de habitaciones disponibles y ocupadas.
    * Una tabla con todas las habitaciones del hotel donde el administrador puede cambiar su estado de forma manual en tiempo real (por ejemplo, liberar una habitación ocupada).
    * Feed de historial donde se registran cronológicamente todas las acciones del sistema.
  * **Pestaña 2: Finanzas & Usuarios**:
    * Muestra el cálculo de ingresos totales recaudados por el hotel.
    * Una tabla que lista todos los clientes registrados y sus correos electrónicos.
    * Desglose detallado de las habitaciones reservadas por cada cliente, noches, subtotal de pagos y total acumulado pagado por usuario.

---

## 4. Flujo de Verificación de Cuenta al Registro

El proceso de creación de cuenta sigue estos pasos:

1. El usuario completa el formulario de registro con nombre, correo y contraseña.
2. El sistema valida todos los campos en el frontend (longitud, formato de email, coincidencia de contraseñas).
3. Si las validaciones pasan, **en lugar de crear la cuenta de inmediato**, se despliega un modal de verificación.
4. El modal solicita un código de 6 dígitos simulando un envío de correo electrónico.
5. El usuario ingresa el código **`333777`** (código fijo de simulación).
6. Si el código es correcto, el sistema realiza la petición al backend (`POST /api/auth/register`) y crea la cuenta.
7. Si el código es incorrecto, se muestra un error en el modal y el usuario puede reintentar sin perder los datos del formulario.
8. Al cancelar el modal, se cierra sin crear la cuenta ni perder los datos del formulario.

> **Nota**: El código `333777` es un valor fijo de demostración. En un entorno de producción real, este código se generaría aleatoriamente y se enviaría al correo del usuario mediante un servicio de email (por ejemplo: SendGrid, Nodemailer, etc.).

---

## 5. Funcionalidades y Mecanismos Clave del Servidor

1. **Gestión de Sesiones (JWT)**: Las solicitudes protegidas viajan con una cabecera `Authorization: Bearer <token>`. El backend verifica la firma criptográfica para validar la identidad y el rol.
2. **Cruce de Datos Financieros**: El endpoint `/api/rooms/admin/financial-stats` procesa todas las reservas registradas, calcula la diferencia en milisegundos de las fechas de entrada/salida para derivar la cantidad de noches y multiplica este valor por la tarifa registrada al momento de reservar, garantizando estadísticas financieras precisas.
3. **Control de Errores Robusto**: El backend captura excepciones críticas y previene la caída del servidor enviando códigos HTTP informativos (como `401 Unauthorized` o `404 Not Found`).
4. **Hashing de Contraseñas**: Las contraseñas nunca se almacenan en texto plano. Se usa `bcryptjs` con salt de 10 rondas para proteger las credenciales de los usuarios en `users.json`.

---

## 6. Credenciales de Acceso por Defecto

El sistema cuenta con las siguientes cuentas de prueba integradas en `backend/data/users.json`:

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Cliente | `cliente@gmail.com` | `123456` |
| Administrador | `admin@gmail.com` | `123456` |

Para crear una **nueva cuenta**, utiliza la pantalla de registro e ingresa el código de verificación **`333777`** cuando se solicite.
