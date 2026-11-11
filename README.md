# Hotel Club Penguin | Demo de reservas con React

Prototipo frontend de una plataforma hotelera con catálogo de habitaciones, reservas y paneles de cliente y administración. Su identidad visual utiliza una temática polar inspirada en Club Penguin.

> **Modo demostración:** la aplicación funciona en el navegador. Las llamadas a la API se simulan y los datos se guardan en localStorage; no hay un backend ni una base de datos remota en esta versión.

## Qué muestra el proyecto

Un recorrido de producto desde la selección de una habitación hasta la consulta de reservas y su administración. La demo permite explorar los flujos sin desplegar un servidor de aplicación.

## Funcionalidades de la demo

- Presentación del hotel y catálogo de habitaciones.
- Registro, acceso y recuperación de cuenta simulados.
- Verificación de registro mediante un código de demostración.
- Detalle de habitación, selección de fechas y cálculo de importe.
- Panel del cliente con sus reservas.
- Panel administrativo con habitaciones, usuarios, ingresos e historial.
- Integración de face-api.js para explorar acceso facial en el navegador.
- Estado persistido localmente entre recargas.

Las cuentas, comprobaciones y métricas pertenecen a la simulación. No representan cobros, correos enviados ni controles de identidad válidos para producción.

## Tecnologías

| Área | Implementación |
|---|---|
| Interfaz | React 19 y CSS |
| Navegación | React Router |
| Desarrollo y build | Vite 8 |
| Demo de API | Intercepción de fetch en JavaScript |
| Persistencia | localStorage del navegador |
| Modelos faciales | face-api.js y archivos en public/models |
| Análisis estático | Oxlint |

## Organización

| Ruta | Responsabilidad |
|---|---|
| [src/App.jsx](src/App.jsx) | Rutas y carga de modelos faciales |
| [src/pages/](src/pages/) | Pantallas de acceso, habitaciones y paneles |
| [src/mockApi.js](src/mockApi.js) | API simulada, datos semilla y almacenamiento local |
| [src/main.jsx](src/main.jsx) | Arranque e incorporación del simulador |
| [public/img/](public/img/) | Recursos visuales del hotel |
| [public/models/](public/models/) | Modelos utilizados por face-api.js |
| [package.json](package.json) | Dependencias y comandos |

## Ejecutar localmente

Requisitos: Node.js **20.19+ en la rama 20, o 22.12+**, según el requisito de Vite fijado en el lockfile, y npm.

```bash
git clone https://github.com/AmehdFM/T5-IA.git
cd T5-IA
npm ci
npm run dev
```

Abrir la dirección que indique Vite en la terminal, normalmente `http://localhost:5173`.

### Comandos

```bash
npm run lint
npm run build
npm run preview
```

`build` produce los archivos estáticos en `dist/`. `preview` sirve esa compilación localmente para inspeccionarla.

## Recorrido de demostración

La semilla de [mockApi.js](src/mockApi.js) incluye estas cuentas ficticias:

| Rol | Correo | Contraseña de demo |
|---|---|---|
| Administrador | admin@gmail.com | admin123 |
| Cliente | cliente@gmail.com | cliente123 |

1. Entrar con el cliente y consultar las habitaciones.
2. Elegir una habitación y un rango de fechas.
3. Confirmar la reserva y revisar el panel del cliente.
4. Entrar con el administrador y consultar habitaciones, usuarios e indicadores.
5. Para probar el registro, usar el código simulado `333777`.

Si se modifica la semilla o se necesita reiniciar la demo, borrar únicamente la clave `penguin_mock_db_v1` del almacenamiento local del sitio y recargar. Esto elimina los cambios de esa demo.

La cámara necesita permiso del navegador y un contexto seguro, como HTTPS o localhost. Se puede recorrer la aplicación con las credenciales de demo sin utilizar acceso facial.

## Publicar como sitio estático

- Comando de compilación: `npm run build`.
- Directorio de salida: `dist`.
- Configurar en el hosting una reescritura a `index.html` para las rutas de React Router.
- Servir los archivos de `public/models` y los recursos de imágenes.

El repositorio no incluye un archivo `public/_redirects`; la regla de navegación debe configurarse según el proveedor de hosting.

## Estado y límites

Prototipo de interfaz y experiencia de usuario. Las contraseñas y los datos de la demo permanecen accesibles desde el navegador; utilizar exclusivamente información ficticia y evitar capturas faciales de personas reales.

Para convertirlo en un sistema operativo se necesitan API y base de datos reales, autenticación y autorización en servidor, protección de datos y pruebas de reservas concurrentes. Retirar la importación de `mockApi.js` por sí solo no implementa ese backend.

La documentación describe el modo de demostración; no implica que la aplicación esté certificada como sistema de reservas ni que exista afiliación con la marca que inspira su estética.

## Autor

[Amehd Mendez](https://github.com/AmehdFM) · Desarrollo de aplicaciones e interfaces web.
