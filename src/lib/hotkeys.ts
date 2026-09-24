import { streamBus } from "./stream-bus";
import { soundEffects } from "./sound-effects";
import { StreamScene } from "./types";

export function setupStreamHotkeys() {
  if (typeof window === "undefined") return () => {};

  const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore hotkeys when typing in input, textarea, or select
    const target = e.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable)
    ) {
      return;
    }

    const state = streamBus.getState();

    // Scene switching (1-5 or Numpad 1-5)
    const sceneMap: Record<string, StreamScene> = {
      "1": "starting",
      "Numpad1": "starting",
      "2": "chatting",
      "Numpad2": "chatting",
      "3": "game",
      "Numpad3": "game",
      "4": "brb",
      "Numpad4": "brb",
      "5": "ending",
      "Numpad5": "ending",
    };

    if (sceneMap[e.code] || sceneMap[e.key]) {
      const scene = sceneMap[e.code] || sceneMap[e.key];
      soundEffects.play("whoosh");
      streamBus.updateState({ currentScene: scene });
      return;
    }

    // Toggle Mic Mute ('m' or 'M')
    if (e.key === "m" || e.key === "M") {
      soundEffects.play("mute");
      streamBus.updateState({ isMicMuted: !state.isMicMuted });
      return;
    }

    // Toggle Panic Shield ('p' or 'P')
    if (e.key === "p" || e.key === "P") {
      soundEffects.play("scratch");
      streamBus.updateState({
        privacyShield: !state.privacyShield,
        isMicMuted: true,
        currentScene: "brb",
      });
      return;
    }

    // Next Sponsor ('s' or 'S')
    if (e.key === "s" || e.key === "S") {
      soundEffects.play("chime");
      streamBus.emit("TRIGGER_SPONSOR");
      return;
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}
