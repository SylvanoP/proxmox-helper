import { getSettings, saveSettings, type Settings } from '../shared/settings';

type SettingKey = keyof Settings;

const TOGGLES: Array<{ id: SettingKey; elementId: string }> = [
  { id: 'copyButtons', elementId: 'copyButtons' },
  { id: 'keyboardShortcuts', elementId: 'keyboardShortcuts' },
  { id: 'shellCommands', elementId: 'shellCommands' },
  { id: 'pinnedGuests', elementId: 'pinnedGuests' },
  { id: 'apiInsights', elementId: 'apiInsights' },
];

async function loadSettings(): Promise<void> {
  const settings = await getSettings();

  for (const toggle of TOGGLES) {
    const element = document.getElementById(toggle.elementId) as HTMLInputElement | null;
    if (element) {
      element.checked = settings[toggle.id];
    }
  }
}

for (const toggle of TOGGLES) {
  const element = document.getElementById(toggle.elementId) as HTMLInputElement | null;
  if (!element) {
    continue;
  }

  element.addEventListener('change', async () => {
    const settings = await getSettings();
    settings[toggle.id] = element.checked;
    await saveSettings(settings);
  });
}

void loadSettings();
