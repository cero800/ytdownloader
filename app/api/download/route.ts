import { NextRequest, NextResponse } from 'next/server';
import { PythonShell } from 'python-shell';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body.url;

    if (!url) {
      return NextResponse.json({ error: 'Se requiere una URL' }, { status: 400 });
    }

    // Validar URL básica
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return NextResponse.json({ error: 'URL de YouTube no válida' }, { status: 400 });
    }

    const tmpDir = '/tmp';
    const outputFile = path.join(tmpDir, `yt_video_${Date.now()}.mp4`);

    // Ejecutar yt-dlp para descargar
    await new Promise<void>((resolve, reject) => {
      const options = {
        mode: 'text',
        pythonPath: 'python3',
        pythonOptions: ['-u'],
        scriptPath: '/tmp',
      };

      // Usamos un script de Python inline a través de python-shell con -c
      const pyShell = new PythonShell('yt-dlp', {
        mode: 'text',
        pythonPath: 'python3',
        args: [
          '--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
          '--output', outputFile,
          '--no-playlist',
          '--merge-output-format', 'mp4',
          url
        ],
        timeout: 300000, // 5 minutos para descargas largas
      });

      pyShell.on('message', (msg) => console.log('yt-dlp:', msg));
      pyShell.end((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Verificar que existe el archivo
    const stats = await fs.stat(outputFile);
    if (!stats.isFile()) {
      return NextResponse.json({ error: 'El archivo no se generó correctamente' }, { status: 500 });
    }

    const fileBuffer = await fs.readFile(outputFile);
    const fileName = `youtube_video_${Date.now()}.mp4`;

    // Limpiar archivo temporal
    try { await fs.unlink(outputFile); } catch {}

    const headers = new Headers();
    headers.set('Content-Type', 'video/mp4');
    headers.set('Content-Disposition', `attachment; filename="${fileName}"`);
    headers.set('Content-Length', String(fileBuffer.length));

    return new NextResponse(fileBuffer, { headers });

  } catch (error: any) {
    console.error('Error con yt-dlp:', error);
    return NextResponse.json({ error: error.message || 'Falló yt-dlp' }, { status: 500 });
  }
}