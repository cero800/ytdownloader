"use client";

import { useState, useEffect, useCallback } from "react";

type Status = "idle" | "downloading" | "done" | "error";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [videoInfo, setVideoInfo] = useState<{ title?: string; duration?: string; thumbnail?: string; views?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setStatus("downloading");
    setProgress(0);
    setVideoInfo(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Error" }));
        setStatus("error");
        setMessage(`❌ ${data.error || "No se pudo descargar"}`);
        return;
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `youtube_video_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setStatus("done");
      setMessage("🎉 Descarga completada!");

      // Simular barra de progreso
      let p = 0;
      const interval = setInterval(() => {
        p = Math.min(p + Math.random() * 45, 98);
        setProgress(Math.round(p));
        if (p >= 98) clearInterval(interval);
      }, 250);

      // Obtener info del video para mostrárlo
      const titleMatch = url.match(/(?:v=|youtu\.be\/)([\w-]+)/);
      if (titleMatch) {
        setVideoInfo({ id: titleMatch[1] });
      }

    } catch (err: any) {
      setStatus("error");
      setMessage(`❌ ${err.message || "Ocurrió un error"}`);
    } finally {
      clearInterval(interval as unknown as number);
    }
  };

  const demos = [
    "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    "https://www.youtube.com/watch?v=O-lX5IgMrVY",
    "https://www.youtube.com/watch?v=VI4XRP6DBfo",
  ];

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 md:py-20">
      {/* Decorativo bg blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/40 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/40 blur-3xl rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Header animado */}
        <div className="mb-2 text-sm font-medium tracking-wide text-slate-200 animate-[fadeIn_0.6s_ease-out]">
          Descarga videos de YouTube rápidamente
        </div>

        <div className="overflow-hidden rounded-3xl shadow-2xl shadow-black/30 backdrop-blur-xl bg-white/90 dark:bg-black/40 transition-all duration-700 hover:shadow-2xl hover:shadow-black/20">
          {/* Sidebar izquierda */}
          <div className="flex-1 p-1 md:p-2">
            <div className="h-3 w-3/4 rounded-full bg-slate-200/30"></div>
            <div className="h-3 w-1/4 rounded-full bg-slate-200/20 mt-1"></div>
            <div className="h-3 w-3/4 rounded-full bg-slate-200/20 mt-3 h-[calc(3/4*1px)]"></div>
          </div>

          {/* Card principal */}
          <div className="p-6 md:p-8">
            {/* Icono */}
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-red-500 via-orange-500 to-purple-600 rounded-2xl shadow-lg shadow-red-500/25 mb-6 transform translate-y-1 transition-transform duration-500" id="iconbox">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-slate-800">
              YouTube{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-purple-600">
                Downloader
              </span>
            </h1>
            <p className="mt-3 text-slate-500 font-medium text-sm md:text-base max-w-xs">
              Descarga videos de YouTube con el clic de un botón. Sin programas, sin complejidad.
            </p>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Pega la URL del video de YouTube..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-300 transition-all duration-300 shadow-inner"
                  required
                />
                {url && (
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8m-8 4h8m-8 4h8" />
                  </svg>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "downloading"}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold text-base shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/30 active:scale-[0.99] hover:active:scale-95 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
              >
                {status === "downloading" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8l-4-4-4 4H4z" />
                      </svg>
                      Procesando...
                    </div>
                  </>
                ) : status === "done" ? (
                  "✅ Descargado!"
                ) : status === "error" ? (
                  "⚠️ Tente"
                ) : (
                  "Descargar Video"
                )}
              </button>

              {/* Barra de progreso mientras descarga */}
              {status === "downloading" && (
                <div className="px-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-2 text-center text-xs text-slate-500 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
                      {progress}%
                    </span>
                  </div>
                </div>
              )}
            </form>

            {/* Mensaje de estado */}
            {(message || videoInfo) && (
              <div className={`mt-5 text-center text-sm font-semibold px-4 py-3 rounded-xl border ${
                status === "done" ? "border-emerald-200 bg-emerald-50 text-emerald-600" :
                status === "error" ? "border-red-200 bg-red-50 text-red-600" : ""
              }`}>
                {status === "done" && message && <span>{message}</span>}
                {status === "error" && <span>❌ {message}</span>}
                {videoInfo && (
                  <span className="block mt-1">{videoInfo.id && `Video #${videoInfo.id}...`}</span>
                )}
              </div>
            )}

            {/* Ejemplos */}
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-3">Otros Videos</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {demos.map((d) => (
                  <button
                    key={d}
                    onClick={() => setUrl(d)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left text-sm text-slate-600"
                  >
                    <span className="truncate">{d.split("/").pop()?.replace("watch?v=", "") || "video"}</span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Métricas / confianza */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Descarga Directa
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Sin Registro
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> yt-dlp
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-5 text-center text-xs text-slate-400 font-normal">
              Usando yt-dlp · Descarga simultánea de video y audio
            </div>
          </div>
        </div>
      </div>

      {/* Animación fadeIn */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        #iconbox { animation: popIn 0.5s ease-out; }
        @keyframes popIn {
          from { transform: scale(0.8) translateY(-4px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </main>
  );
}