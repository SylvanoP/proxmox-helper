import { ensureStyles } from '../../shared/dom';
import {
  getPinnedGuests,
  guestFromTreeItem,
  onPinnedGuestsChanged,
  togglePinnedGuest,
  type PinnedGuest,
} from '../../shared/pinned-storage';

const BAR_ID = 'ph-pinned-bar';
const PIN_CLASS = 'ph-pin-btn';

function navigateToGuest(guest: PinnedGuest): void {
  if (guest.hash) {
    window.location.hash = guest.hash;
    return;
  }

  window.location.hash = `#v1:0:=${encodeURIComponent(`${guest.node}/${guest.type}/${guest.id}`)}:4:::::::`;
}

async function renderPinnedBar(): Promise<void> {
  const pinned = await getPinnedGuests();
  let bar = document.getElementById(BAR_ID);

  if (pinned.length === 0) {
    bar?.remove();
    return;
  }

  if (!bar) {
    bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.className = 'ph-pinned-bar';
    document.body.appendChild(bar);
  }

  bar.replaceChildren();

  const label = document.createElement('span');
  label.className = 'ph-pinned-bar__label';
  label.textContent = 'Angepinnt';
  bar.appendChild(label);

  for (const guest of pinned) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ph-pinned-bar__item';
    button.textContent = `${guest.id} · ${guest.name}`;
    button.title = `${guest.type.toUpperCase()} ${guest.id} (${guest.node})`;
    button.addEventListener('click', () => navigateToGuest(guest));
    bar.appendChild(button);
  }
}

function enhanceTreeItem(item: HTMLElement): void {
  const text = item.querySelector('.x-treelist-item-text')?.textContent?.trim();
  if (!text || !/^\d+\s*\(/.test(text)) {
    return;
  }

  if (item.querySelector(`.${PIN_CLASS}`)) {
    return;
  }

  const guest = guestFromTreeItem(item);
  if (!guest) {
    return;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = PIN_CLASS;
  button.title = 'Gast anpinnen';
  button.textContent = '☆';
  button.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const pinned = await togglePinnedGuest(guest);
    button.textContent = pinned ? '★' : '☆';
    button.classList.toggle('ph-pin-btn--active', pinned);
    void renderPinnedBar();
  });

  void getPinnedGuests().then((pinned) => {
    const isPinned = pinned.some(
      (entry) => entry.type === guest.type && entry.id === guest.id,
    );
    button.textContent = isPinned ? '★' : '☆';
    button.classList.toggle('ph-pin-btn--active', isPinned);
  });

  item.style.position = 'relative';
  item.appendChild(button);
}

function scanTreeItems(): void {
  document
    .querySelectorAll<HTMLElement>('.x-treelist-item')
    .forEach((item) => enhanceTreeItem(item));
}

function cleanupPinButtons(): void {
  document.querySelectorAll(`.${PIN_CLASS}`).forEach((button) => button.remove());
  document.getElementById(BAR_ID)?.remove();
}

let observer: MutationObserver | null = null;
let unsubscribePinned: (() => void) | null = null;

export const pinnedGuestsEnhancement = {
  id: 'pinnedGuests',

  start() {
    ensureStyles();
    void renderPinnedBar();
    scanTreeItems();

    observer = new MutationObserver(() => scanTreeItems());
    observer.observe(document.body, { childList: true, subtree: true });

    unsubscribePinned = onPinnedGuestsChanged(() => {
      void renderPinnedBar();
      scanTreeItems();
    });
  },

  stop() {
    observer?.disconnect();
    observer = null;
    unsubscribePinned?.();
    unsubscribePinned = null;
    cleanupPinButtons();
  },
};
