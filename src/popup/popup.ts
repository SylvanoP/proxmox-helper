import { getSettings, saveSettings } from '../shared/settings';

const copyButtonsCheckbox = document.getElementById(
  'copyButtons',
) as HTMLInputElement;

async function loadSettings(): Promise<void> {
  const settings = await getSettings();
  copyButtonsCheckbox.checked = settings.copyButtons;
}

copyButtonsCheckbox.addEventListener('change', async () => {
  const settings = await getSettings();
  settings.copyButtons = copyButtonsCheckbox.checked;
  await saveSettings(settings);
});

void loadSettings();
