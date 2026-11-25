"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Bot, Sparkles, Copy, Check, Send } from "lucide-react";

type ModePreset = "seo" | "copy" | "cotizacion";

const PRESET_PROMPTS: Record<ModePreset, { label: string; placeholder: string }> = {
  seo: {
    label: "SEO & Rich Snippets",
    placeholder:
      "Ej. Genera H1, H2, slug y meta description (máx. 155 caracteres) para un paquete de extintor de polvo holi para revelación de género en CDMX...",
  },
  copy: {
    label: "Copy Comercial",
    placeholder:
      "Ej. Redacta una descripción atractiva y puntos destacados para un paquete VIP de humo frío y confeti en eventos...",
  },
  cotizacion: {
    label: "Respuesta Cotización",
    placeholder:
      "Ej. Responde por WhatsApp a un cliente en Coyoacán que pregunta precio, anticipo y tiempos de montaje para un sábado...",
  },
};

export default function AdminAgenteIaPage() {
  const [mode, setMode] = useState<ModePreset>("seo");
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Escribe una instrucción para el agente");
      return;
    }

    setLoading(true);
    setCopied(false);

    try {
      const systemHint =
        mode === "seo"
          ? "Eres especialista en SEO técnico y local en México para Revelación. Entrega propuestas claras de H1, H2, slug y meta description de hasta 155 caracteres."
          : mode === "cotizacion"
          ? "Eres asesor comercial de Revelación en México. Responde de forma clara, cercana y orientada a cierre con anticipo, logística y siguientes pasos."
          : "Eres copywriter comercial de Revelación. Redacta textos persuasivos, concisos y listos para catálogo.";

      const res = await fetch("/api/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          systemPrompt: systemHint,
          prompt: prompt.trim(),
          messages: [
            { role: "system", content: systemHint },
            { role: "user", content: prompt.trim() },
          ],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "No se pudo consultar /api/groq/chat");
        return;
      }

      const text =
        data?.reply ||
        data?.message ||
        data?.data?.content ||
        data?.content ||
        (typeof data === "string" ? data : JSON.stringify(data, null, 2));

      setOutput(text);
      toast.success("Respuesta generada");
    } catch {
      toast.error("Error de conexión con /api/groq/chat");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("Copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Toaster position="top-right" />

      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-amber-500" />
          Agente IA (Groq)
        </h2>
        <p className="text-sm text-slate-400">
          Asistente interno para redactar SEO de paquetes, copies comerciales y respuestas rápidas.
        </p>
      </div>

      {/* Selector de modo */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PRESET_PROMPTS) as ModePreset[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              mode === key
                ? "bg-amber-600 text-white"
                : "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {PRESET_PROMPTS[key].label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleGenerate}
        className="bg-[#020617] border border-slate-800 rounded-xl p-5 space-y-4"
      >
        <div>
          <label className="block text-sm text-slate-300 mb-2">
            Instrucción para el agente
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={PRESET_PROMPTS[mode].placeholder}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {loading ? "Generando con Groq..." : "Generar propuesta"}
        </button>
      </form>

      {output && (
        <div className="bg-[#020617] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-semibold text-emerald-400">
              Resultado generado
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar texto
                </>
              )}
            </button>
          </div>

          <pre className="whitespace-pre-wrap font-sans text-sm text-slate-200 leading-relaxed">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}