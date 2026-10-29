import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body.url;

    if (!url) return NextResponse.json({ error: 'Se requiere una URL' }, { status: 400 });
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) return NextResponse.json({ error: 'URL de YouTube no válida' }, { status: 400 });

    const tmpDir = '/tmp';
    const outputFile = path.join(tmpDir, `yt_video_${Date.now()}.mp4`);

    await new Promise<void>((resolve, reject) => {
      const child = spawn('yt-dlp', [
        '--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        '--output', outputFile,
        '--no-playlist',
        '--merge-output-format', 'mp4',
        url
      ], { stdio: 'inherit' });

      child.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`yt-dlp salió con código ${code}`));
      });

      child.on('error', (err) => reject(err));
    });

    const stats = await fs.stat(outputFile);
    if (!stats.isFile()) return NextResponse.json({ error: 'El archivo no se generó' }, { status: 500 });

    const fileBuffer = await fs.readFile(outputFile);
    const fileName = `youtube_video_${Date.now()}.mp4`;
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