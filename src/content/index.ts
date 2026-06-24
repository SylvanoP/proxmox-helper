import { isProxmoxPage } from './detect-proxmox';
import { apiInsightsEnhancement } from './enhancements/api-insights';
import { copyButtonEnhancement } from './enhancements/copy-button';
import { keyboardShortcutsEnhancement } from './enhancements/keyboard-shortcuts';
import { pinnedGuestsEnhancement } from './enhancements/pinned-guests';
import { shellCommandsEnhancement } from './enhancements/shell-commands';
import type { Enhancement } from './enhancements/types';
import { getSettings, onSettingsChanged, type Settings } from '../shared/settings';

const ENHANCEMENTS: Enhancement[] = [
  copyButtonEnhancement,
  keyboardShortcutsEnhancement,
  shellCommandsEnhancement,
  pinnedGuestsEnhancement,
  apiInsightsEnhancement,
];

const activeEnhancements = new Set<string>();

function isEnhancementEnabled(
  enhancement: Enhancement,
  settings: Settings,
): boolean {
  return Boolean(settings[enhancement.id as keyof Settings]);
}

function applySettings(settings: Settings): void {
  for (const enhancement of ENHANCEMENTS) {
    const enabled = isEnhancementEnabled(enhancement, settings);
    const isActive = activeEnhancements.has(enhancement.id);

    if (enabled && !isActive) {
      enhancement.start();
      activeEnhancements.add(enhancement.id);
    } else if (!enabled && isActive) {
      enhancement.stop();
      activeEnhancements.delete(enhancement.id);
    }
  }
}

async function init(): Promise<void> {
  if (!isProxmoxPage()) {
    return;
  }

  const settings = await getSettings();
  applySettings(settings);
  onSettingsChanged(applySettings);
}

void init();
