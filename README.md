# YouTube Downloader con yt-dlp

## Requisitos del sistema
- `yt-dlp` debe estar instalado: `pip install yt-dlp` (o `brew install yt-dlp` / `apk add yt-dlp`)
- `python3` en el PATH

## Cómo desplegar en Vercel
1. Instala `yt-dlp` en tu entorno local para probar
2. `npm install`
3. `npm run build`
4. `vercel --prod`

> ⚠️ **Nota importante:** Vercel (y Cloudflare Pages) no incluyen `yt-dlp` por defecto. 
> Para producción con `yt-dlp`, usa un servidor real (Railway, Render, DigitalOcean) 
> o instala `yt-dlp` vía `Docker` / imagen personalizada.
