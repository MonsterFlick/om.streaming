export type StreamScene = "starting" | "chatting" | "game" | "brb" | "ending";

export type AlertType = "FOLLOWER" | "SUB" | "DONATION" | "RAID" | "BITS" | "SPONSOR";

export interface AlertEvent {
  id: string;
  type: AlertType;
  user: string;
  amount?: string;
  message?: string;
  tier?: string;
  timestamp: number;
}

export interface SponsorItem {
  id: string;
  brand: string;
  subtitle: string;
  badge: string;
  headline: string;
  description: string;
  code: string;
  discount: string;
  url: string;
  accentColor: string;
  logoText: string;
}

export type ChatRole = "STREAMER" | "MOD" | "VIP" | "SUB" | "VIEWER";

export interface ChatMessage {
  id: string;
  author: string;
  role: ChatRole;
  text: string;
  timestamp: number;
  platform?: "twitch" | "youtube" | "system";
}

export type WebcamAspectRatio = "16:9" | "4:3" | "1:1" | "9:16";
export type WebcamRounding = "none" | "md" | "xl" | "full";

export interface WebcamConfig {
  mode: "separated" | "integrated";
  aspectRatio: WebcamAspectRatio;
  label: string;
  sublabel: string;
  micLabel: string;
  borderGlow: boolean;
  rounding: WebcamRounding;
  privacyBlur: boolean;
  voiceReactive: boolean;
}

export type TextAnimationPreset = "blur-focus" | "kinetic" | "typewriter" | "marquee" | "shimmer";

export interface StreamGoal {
  current: number;
  target: number;
  label: string;
}

export interface StreamState {
  currentScene: StreamScene;
  isLive: boolean;
  isMicMuted: boolean;
  isAudioMuted: boolean;
  privacyShield: boolean;
  topic: string;
  streamTitle: string;
  tickerText: string;
  followerGoal: StreamGoal;
  subGoal: StreamGoal;
  activeSponsorId: string | null;
  timerSeconds: number;
  textAnimation: TextAnimationPreset;
  webcamConfig: WebcamConfig;
  latestSub: string;
  topDonation: string;
  latestFollower: string;
}

export type SoundEffectType =
  | "chime"
  | "sub"
  | "donation"
  | "raid"
  | "bell"
  | "applause"
  | "scratch"
  | "click"
  | "mute"
  | "whoosh";
