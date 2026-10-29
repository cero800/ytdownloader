# 🚀 Despliegue en Render con yt-dlp

## 1. Preparar el repositorio (recomendado)
```bash
git init
git add .
git commit -m "yt-download con yt-dlp"
# Súbelo a GitHub o usa el repositorio directamente
```

## 2. En Render
1. Ve a [dashboard.render.com](https://dashboard.render.com)
2. **New → Web Service**
3. Conecta tu repositorio de GitHub (o sube manualmente)
4. Render detectará automáticamente `Dockerfile` y `render.yaml`
5. Si no detecta el archivo, selecciona:
   - **Runtime:** Docker
   - **Build Command:** `docker build -t app .`
   - **Start Command:** `docker run -p 3000:3000 app`

## 3. Variables de entorno (automáticas con `render.yaml`)
- `NODE_ENV=production`
- `PORT=3000`

## 4. Nota importante
- Render Free tiene **750 horas/mes** (se duerme después de 15 min de inactividad)
- Para videos largos, el timeout de descarga es el límite del contenedor (no hay límite rígido como en Vercel, pero el servicio gratuito puede reiniciarse)
- `ffmpeg` está incluido en el `Dockerfile` para que `yt-dlp` fusione audio+video sin problemas

## 5. Probar localmente
```bash
docker build -t yt-download .
docker run -p 3000:3000 -e PORT=3000 yt-download
```
Abre `http://localhost:3000` y prueba la descarga.
