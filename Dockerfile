# ═══════════════════════════════════════════════════════════════
#  Etapa 1 — Builder: compilar el frontend React (Vite)
# ═══════════════════════════════════════════════════════════════
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend-react

# Instalar dependencias usando el lockfile (build reproducible)
COPY frontend-react/package*.json ./
RUN npm ci

# Copiar el código fuente y generar el build de producción (carpeta dist/)
COPY frontend-react/ ./
RUN npm run build


# ═══════════════════════════════════════════════════════════════
#  Etapa 2 — Runtime: backend Express que sirve el dist + la API
# ═══════════════════════════════════════════════════════════════
FROM node:20-alpine AS runtime

ENV NODE_ENV=production

WORKDIR /app/backend

# Instalar solo las dependencias de producción del backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copiar el código fuente del backend (incluye los JSON semilla de data/)
COPY backend/ ./

# Copiar el frontend ya compilado desde la etapa builder.
# server.js lo sirve desde ../frontend-react/dist (relativo a /app/backend).
COPY --from=frontend-builder /app/frontend-react/dist /app/frontend-react/dist

# El servidor escucha en process.env.PORT || 3000
EXPOSE 3000

CMD ["npm", "start"]
