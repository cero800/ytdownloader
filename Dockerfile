FROM node:20-alpine

# Instalar python3, pip, ffmpeg y dependencias (Alpine usa apk)
RUN apk add --no-cache python3 py3-pip ffmpeg curl ca-certificates git bash

# Instalar yt-dlp (sin --break-system-packages porque no existe en Alpine)
RUN pip3 install --break-system-packages --no-cache-dir yt-dlp

# Directorio de trabajo
WORKDIR /app

# Copiar y instalar dependencias
COPY package*.json ./
RUN npm ci || npm install

# Copiar código y compilar
COPY . .
RUN npm run build

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
