import type { GuestRef, GuestType } from './guest-context';
import { buildGuestHash, getCurrentHost, parseGuestFromHash } from './guest-context';

export interface PinnedGuest {
  host: string;
  node: string;
  type: GuestType;
  id: number;
  name: string;
  hash: string;
}

const STORAGE_KEY = 'pinnedGuests';

function guestKey(guest: Pick<PinnedGuest, 'type' | 'id'>): string {
  return `${guest.type}:${guest.id}`;
}

export async function getPinnedGuests(host = getCurrentHost()): Promise<PinnedGuest[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  const all = (result[STORAGE_KEY] as Record<string, PinnedGuest[]> | undefined) ?? {};
  return all[host] ?? [];
}

export async function isGuestPinned(
  guest: Pick<PinnedGuest, 'host' | 'type' | 'id'>,
): Promise<boolean> {
  const pinned = await getPinnedGuests(guest.host);
  return pinned.some((entry) => guestKey(entry) === guestKey(guest));
}

export async function togglePinnedGuest(guest: GuestRef): Promise<boolean> {
  const host = getCurrentHost();
  const pinned = await getPinnedGuests(host);
  const key = guestKey(guest);
  const existing = pinned.findIndex((entry) => guestKey(entry) === key);

  if (existing >= 0) {
    pinned.splice(existing, 1);
  } else {
    pinned.push({
      host,
      node: guest.node,
      type: guest.type,
      id: guest.id,
      name: guest.name,
      hash: guest.hash || buildGuestHash(guest.node, guest.type, guest.id),
    });
  }

  const result = await chrome.storage.local.get(STORAGE_KEY);
  const all = (result[STORAGE_KEY] as Record<string, PinnedGuest[]> | undefined) ?? {};
  all[host] = pinned;
  await chrome.storage.local.set({ [STORAGE_KEY]: all });
  return existing < 0;
}

export function guestFromTreeItem(element: HTMLElement): GuestRef | null {
  const text = element.querySelector('.x-treelist-item-text')?.textContent?.trim();
  if (!text || !/^\d+/.test(text)) {
    return null;
  }

  const id = Number(text.match(/^(\d+)/)?.[1]);
  const nameMatch = text.match(/^\d+\s*\((.+)\)$/);
  const name = nameMatch?.[1]?.trim() ?? text;

  const fromHash = parseGuestFromHash();
  if (fromHash && fromHash.id === id) {
    fromHash.name = name;
    return fromHash;
  }

  const row = element.closest('.x-treelist-item');
  const iconClass = row?.querySelector('[class*="fa-"]')?.className ?? '';
  const type: GuestType = iconClass.includes('lxc') ? 'lxc' : 'qemu';

  return {
    id,
    type,
    node: fromHash?.node ?? 'pve',
    name,
    hash: fromHash?.hash ?? buildGuestHash(fromHash?.node ?? 'pve', type, id),
  };
}

export function onPinnedGuestsChanged(callback: () => void): () => void {
  const listener = (
    changes: Record<string, chrome.storage.StorageChange>,
    areaName: string,
  ) => {
    if (areaName === 'local' && changes[STORAGE_KEY]) {
      callback();
    }
  };

  chrome.storage.onChanged.addListener(listener);
  return () => chrome.storage.onChanged.removeListener(listener);
}
