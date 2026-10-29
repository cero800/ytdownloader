FROM python:3.12-slim

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    nodejs \
    npm \
    git \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Instalar yt-dlp
RUN pip install --no-cache-dir yt-dlp

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de la app
COPY package*.json ./
COPY package-lock.json* ./
RUN npm ci --only=production || npm install

# Copiar el resto del código
COPY . .

# Compilar la app Next.js
RUN npm run build

# Exponer puerto
ENV PORT=3000
ENV NODE_ENV=production

# Comando para iniciar
CMD ["npm", "start"]