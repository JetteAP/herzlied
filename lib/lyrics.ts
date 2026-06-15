import OpenAI from "openai";
import { buildLyricsBrief, type SongAnswers } from "./songPrompt";

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

/**
 * Schreibt die persönlichen Songtexte mit OpenAI.
 * Gibt einen leeren String zurück, wenn kein OPENAI_API_KEY gesetzt ist
 * (dann schreibt ElevenLabs die Lyrics selbst anhand des Prompts).
 */
export async function writeLyrics(a: SongAnswers): Promise<string> {
  const openai = getOpenAI();
  if (!openai) return "";

  const { system, user } = buildLyricsBrief(a);

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      temperature: 0.9,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    const text = completion.choices?.[0]?.message?.content?.trim() ?? "";
    return text;
  } catch (e) {
    // Lyrics sind ein "nice to have" — wenn OpenAI ausfällt, fällt der
    // Funnel auf ElevenLabs-eigene Lyrics zurück statt zu scheitern.
    console.error("[lyrics] OpenAI lyric generation failed, falling back:", e);
    return "";
  }
}
