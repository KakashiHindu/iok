export type NavigationKey =
  | 'dashboard'
  | 'live'
  | 'speech'
  | 'text'
  | 'image'
  | 'conversation'
  | 'history'
  | 'settings';

export type LanguageCode = 'en' | 'hi' | 'hinglish' | 'asl' | 'isl';

export interface DetectionResult {
  label: string;
  confidence: number;
  fps: number;
  generatedText: string;
  speechUrl?: string;
  boundingBoxes: Array<{ x: number; y: number; width: number; height: number }>;
  landmarks: Array<{ x: number; y: number; z: number }>;
}

export interface SignToken {
  gloss: string;
  durationMs: number;
  expression: 'neutral' | 'happy' | 'urgent' | 'question';
  handshape: string;
}

export interface AccessibilityState {
  largeText: boolean;
  highContrast: boolean;
  darkMode: boolean;
  voiceFeedback: boolean;
  colorBlind: boolean;
  reducedMotion: boolean;
}

export interface ConversationMessage {
  id: string;
  speaker: 'deaf-user' | 'hearing-user' | 'assistant';
  modality: 'sign' | 'speech' | 'text';
  text: string;
  confidence?: number;
  timestamp: string;
}
