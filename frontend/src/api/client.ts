import type { DetectionResult, LanguageCode, SignToken } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`API ${path} failed with ${response.status}`);
  }
  return response.json() as Promise<TResponse>;
}

export async function detectFrame(imageDataUrl: string, language: LanguageCode): Promise<DetectionResult> {
  return postJson<DetectionResult>('/translation/sign-frame', {
    image_data_url: imageDataUrl,
    language,
  });
}

export async function translateTextToSign(text: string, language: LanguageCode): Promise<{ tokens: SignToken[]; normalizedText: string }> {
  return postJson('/translation/text-to-sign', { text, language });
}

export async function translateSpeechToSign(audioDataUrl: string, language: LanguageCode): Promise<{ transcript: string; tokens: SignToken[] }> {
  return postJson('/translation/speech-to-sign', { audio_data_url: audioDataUrl, language });
}

export async function translateImage(imageDataUrl: string, language: LanguageCode): Promise<DetectionResult & { animatedRecreation: SignToken[] }> {
  return postJson('/translation/image', { image_data_url: imageDataUrl, language });
}

export async function getAnalytics(): Promise<{ accuracy: number; sessionLengthMinutes: number; wordsRecognized: number; commonSigns: string[]; usageTrend: number[] }> {
  const response = await fetch(`${API_BASE}/analytics/summary`);
  if (!response.ok) {
    throw new Error(`Analytics failed with ${response.status}`);
  }
  return response.json();
}
