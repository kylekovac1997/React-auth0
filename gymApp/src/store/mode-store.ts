import Storage from 'expo-sqlite/kv-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Simple mode spreads information over more screens with plain-English explainers.
 * Advanced mode shows denser dashboards for experienced lifters.
 */
export type AppMode = 'simple' | 'advanced';

type ModeState = {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
};

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: 'simple',
      setMode: (mode) => set({ mode }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'simple' ? 'advanced' : 'simple' })),
    }),
    {
      name: 'app-mode',
      storage: createJSONStorage(() => Storage),
    }
  )
);

export function useMode() {
  return useModeStore((state) => state.mode);
}
