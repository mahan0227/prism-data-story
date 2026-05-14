"use client";

import { useState } from "react";
import { ApiKeyBar, authHeaders, useOpenAISettings } from "@/components/ApiKeyBar";

export default function Home() {
  const settings = useOpenAISettings();
  const { apiKey, model } = settings;
  const [data, setData] = useState(
    `week,signups,activation_7d,churn_30d\n1,1200,0.41,0.08\n2,980,0.39,0.09\n3,1505,0.36,0.11\n4,1320,0.44,0.07`,
  );
  const [audience, setAudience] = useState("Board + product leadership");
  const [angle, setAngle] = useState("Growth vs quality tradeoff in onboarding");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function run() {
    setError("");
    setOutput("");
    if (!apiKey.trim()) {
      setError("Add your OpenAI API key above.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/story", {
        method: "POST",
        headers: authHeaders(apiKey),
        body: JSON.stringify({ data, audience, angle, model }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Request failed");
        return;
      }
      setOutput(JSON.stringify(json.result ?? json, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col gap-8 px-4 py-10 md:px-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-200/90">
          Neuron suite · 16
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          Prism Data Story
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400">
          Feed metrics or CSV snippets — get headline, storyline beats, chart blueprints, anomalies, and
          ethics guardrails so the narrative stays honest.
        </p>
      </header>

      <ApiKeyBar settings={settings} accent="from-lime-400 to-emerald-700" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Audience</span>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-lime-400/60"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Angle / hypothesis</span>
            <input
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-lime-400/60"
            />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-300">Data (CSV, table, or prose metrics)</span>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              rows={12}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-lime-400/60"
            />
          </label>
          <button
            type="button"
            disabled={loading}
            onClick={run}
            className="w-full rounded-xl bg-gradient-to-r from-lime-400 to-emerald-700 px-4 py-3 text-sm font-semibold text-lime-950 shadow-lg shadow-lime-500/30 transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Refracting…" : "Refract into story"}
          </button>
        </div>
        <div className="flex min-h-[520px] flex-col gap-3 rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-xs md:text-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Story JSON</span>
            {error ? <span className="text-rose-400">Error</span> : null}
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <pre className="flex-1 overflow-auto whitespace-pre-wrap text-zinc-100">{output}</pre>
        </div>
      </div>
    </div>
  );
}
