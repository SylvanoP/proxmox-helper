const DEFAULT_SETTINGS = {
  copyButtons: true,
  keyboardShortcuts: true,
  shellCommands: true,
  pinnedGuests: true,
  apiInsights: false,
};

export type Settings = {
  copyButtons: boolean;
  keyboardShortcuts: boolean;
  shellCommands: boolean;
  pinnedGuests: boolean;
  apiInsights: boolean;
};

export const STORAGE_KEY = 'settings';

export function getDefaultSettings(): Settings {
  return { ...DEFAULT_SETTINGS };
}

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  const stored = result[STORAGE_KEY] as Partial<Settings> | undefined;
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.sync.set({ [STORAGE_KEY]: settings });
}

export function onSettingsChanged(
  callback: (settings: Settings) => void,
): () => void {
  const listener = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string,
  ) => {
    if (areaName !== 'sync' || !changes[STORAGE_KEY]) {
      return;
    }
    callback({ ...DEFAULT_SETTINGS, ...changes[STORAGE_KEY].newValue });
  };

  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
