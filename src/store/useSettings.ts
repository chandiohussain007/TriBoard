import { create } from "zustand";

interface UserSettings {
  soundEnabled: boolean;
  bgmEnabled: boolean;
  botLevel: string;
  setSoundEnabled: (v: boolean) => void;
  setBgmEnabled: (v: boolean) => void;
  setBotLevel: (level: string) => void;
}

export const useSettings = create<UserSettings>((set) => ({
  soundEnabled: true,
  bgmEnabled: false,
  botLevel: "Easy",
  setSoundEnabled: (v) => set({ soundEnabled: v }),
  setBgmEnabled: (v) => set({ bgmEnabled: v }),
  setBotLevel: (level) => set({ botLevel: level }),
}));
