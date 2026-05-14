import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getOpenAIApiKey } from "@/lib/openai-key";

export async function POST(request: NextRequest) {
  const apiKey = getOpenAIApiKey(request);
  if (!apiKey) {
    return NextResponse.json(
      { error: "Send Authorization: Bearer <your OpenAI API key> on each request." },
      { status: 401 },
    );
  }

  let body: { data?: string; audience?: string; angle?: string; model?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.data?.trim()) {
    return NextResponse.json({ error: "`data` (description, metrics, or CSV snippet) is required." }, { status: 400 });
  }

  const client = new OpenAI({ apiKey });
  const model = body.model?.trim() || "gpt-4o-mini";

  const system = `You are Prism Data Story — turn quantitative material into narrative that respects uncertainty.
Return JSON:
- headline: string
- nut_graf: string
- storyline_beats: { beat: string; evidence: string }[]
- chart_blueprints: { title: string; chart_type: string; x: string; y: string; insight_risk: string }[] // max 4
- anomalies: string[]
- ethics_and_limits: string[] (what we cannot claim from this data)
- exec_takeaway: string
- social_snippets: { platform: "linkedin"|"instagram"|"x"; copy: string }[]`;

  const user = `AUDIENCE:\n${body.audience?.trim() || "smart generalist"}\n\nANGLE:\n${body.angle?.trim() || "let the data choose the story"}\n\nDATA:\n${body.data}`;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) return NextResponse.json({ error: "Empty model response." }, { status: 502 });
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json({ raw: text }, { status: 200 });
    }
    return NextResponse.json({ result: parsed, model });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "OpenAI request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
