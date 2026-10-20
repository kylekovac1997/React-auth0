import { useModeStore } from '@/store/mode-store';

jest.mock('expo-sqlite/kv-store', () => {
  const items = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: async (key: string) => items.get(key) ?? null,
      setItem: async (key: string, value: string) => void items.set(key, value),
      removeItem: async (key: string) => void items.delete(key),
    },
  };
});

describe('mode store', () => {
  beforeEach(() => {
    useModeStore.setState({ mode: 'simple' });
  });

  it('starts in simple mode', () => {
    expect(useModeStore.getState().mode).toBe('simple');
  });

  it('sets the mode', () => {
    useModeStore.getState().setMode('advanced');
    expect(useModeStore.getState().mode).toBe('advanced');
  });

  it('toggles between modes', () => {
    useModeStore.getState().toggleMode();
    expect(useModeStore.getState().mode).toBe('advanced');
    useModeStore.getState().toggleMode();
    expect(useModeStore.getState().mode).toBe('simple');
  });
});
