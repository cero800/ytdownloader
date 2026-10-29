"use client";

import { useState } from 'react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [info, setInfo] = useState<{ title?: string; duration?: string; thumbnail?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setInfo(null);

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(`Error: ${data.error || 'No se pudo descargar'}`);
        setLoading(false);
        return;
      }

      // Obtener el archivo como blob
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `youtube_video.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setMessage('¡Descarga iniciada!');
      setInfo({ title: 'Video descargado', duration: '', thumbnail: '' });
    } catch (err: any) {
      setMessage(`Error: ${err.message || 'Ocurrió un error inesperado'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-red-500 to-red-700 rounded-2xl shadow-lg mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
            YouTube <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">Downloader</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base font-medium">Descarga videos de YouTube fácilmente y sin complicaciones</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Pega la URL del video de YouTube..."
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-300 transition-all duration-200 text-base shadow-inner"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold text-base shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                Procesando...
              </span>
            ) : (
              'Descargar Video'
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-5 px-4 py-3 rounded-xl text-sm font-semibold ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
            {message}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-8 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Descarga Directa
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Sin Registro
          </div>
        </div>
      </div>
    </main>
  );
}