import { copyToClipboard } from '../../shared/clipboard';
import { showCopyToast } from '../../shared/dom';
import { getSelectedGuest } from '../../shared/guest-context';

const SEARCH_SELECTORS = [
  '#fieldGlobalSearch-inputEl',
  '#fieldGlobalSearch-input',
  'input[name="Search"]',
  '.x-field-toolbar input.x-form-field',
  '#pagerSearch-inputEl',
  '.x-treelist-search input',
];

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable) {
    return true;
  }

  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

function focusSearchField(): boolean {
  for (const selector of SEARCH_SELECTORS) {
    const element = document.querySelector<HTMLInputElement>(selector);
    if (element && !element.disabled) {
      element.focus();
      element.select?.();
      return true;
    }
  }

  const fallback = document.querySelector<HTMLInputElement>(
    'input.x-form-field[placeholder*="Search"], input.x-form-field[placeholder*="Suche"]',
  );
  if (fallback) {
    fallback.focus();
    fallback.select?.();
    return true;
  }

  return false;
}

async function copySelectedGuestId(): Promise<void> {
  const guest = getSelectedGuest();
  if (!guest) {
    showCopyToast('Kein Gast ausgewählt', false);
    return;
  }

  const success = await copyToClipboard(String(guest.id));
  showCopyToast(success ? `VMID ${guest.id} kopiert` : 'Kopieren fehlgeschlagen', success);
}

function onKeyDown(event: KeyboardEvent): void {
  if (isEditableTarget(event.target)) {
    return;
  }

  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    if (!focusSearchField()) {
      showCopyToast('Suchfeld nicht gefunden', false);
    }
    return;
  }

  if (
    (event.key === 'k' || event.key === 'K') &&
    (event.ctrlKey || event.metaKey) &&
    !event.shiftKey &&
    !event.altKey
  ) {
    event.preventDefault();
    if (!focusSearchField()) {
      showCopyToast('Suchfeld nicht gefunden', false);
    }
    return;
  }

  if (
    event.key === 'C' &&
    event.ctrlKey &&
    event.shiftKey &&
    !event.altKey &&
    !event.metaKey
  ) {
    event.preventDefault();
    void copySelectedGuestId();
  }
}

let listening = false;

export const keyboardShortcutsEnhancement = {
  id: 'keyboardShortcuts',

  start() {
    if (listening) {
      return;
    }
    document.addEventListener('keydown', onKeyDown, true);
    listening = true;
  },

  stop() {
    if (!listening) {
      return;
    }
    document.removeEventListener('keydown', onKeyDown, true);
    listening = false;
  },
};
