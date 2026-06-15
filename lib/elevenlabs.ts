/**
 * ElevenLabs Music API Wrapper.
 *
 * Endpoint:  POST https://api.elevenlabs.io/v1/music
 * Auth:      Header  xi-api-key
 * Body:      { prompt, music_length_ms, model_id }
 * Response:  Binäre Audio-Daten (MP3) als application/octet-stream
 *
 * Doku: https://elevenlabs.io/docs/api-reference/music/compose
 */

const MUSIC_ENDPOINT = "https://api.elevenlabs.io/v1/music";

// Songlänge muss laut API zwischen 3s und 600s liegen.
const MIN_LENGTH_MS = 10_000;
const MAX_LENGTH_MS = 300_000;

export type ComposeOptions = {
  prompt: string;
  lengthMs: number;
  /** MP3-Format-String laut ElevenLabs (Default: mp3_44100_128). */
  outputFormat?: string;
};

export async function composeSong({
  prompt,
  lengthMs,
  outputFormat = "mp3_44100_128",
}: ComposeOptions): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY ist nicht gesetzt.");
  }

  const safeLength = Math.min(
    MAX_LENGTH_MS,
    Math.max(MIN_LENGTH_MS, Math.round(lengthMs))
  );
  const model = process.env.ELEVENLABS_MODEL || "music_v2";

  const url = `${MUSIC_ENDPOINT}?output_format=${encodeURIComponent(outputFormat)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      prompt,
      music_length_ms: safeLength,
      model_id: model,
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    throw new Error(
      `ElevenLabs Music API Fehler ${res.status}: ${detail.slice(0, 500)}`
    );
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  if (buffer.length < 1000) {
    throw new Error(
      `ElevenLabs lieferte eine verdächtig kleine Datei zurück (${buffer.length} Bytes).`
    );
  }
  return buffer;
}
