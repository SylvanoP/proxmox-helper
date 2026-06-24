export type GuestType = 'qemu' | 'lxc';

export interface GuestRef {
  id: number;
  type: GuestType;
  node: string;
  name: string;
  hash: string;
}

function decodeHashPath(hash: string): string | null {
  const match = hash.match(/=([^:]+)/);
  if (!match?.[1]) {
    return null;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function parseGuestFromHash(hash = location.hash): GuestRef | null {
  const path = decodeHashPath(hash);
  if (!path) {
    return null;
  }

  const match = path.match(/\/([^/]+)\/(qemu|lxc)\/(\d+)$/i);
  if (!match) {
    return null;
  }

  const [, node, type, id] = match;
  return {
    node,
    type: type.toLowerCase() as GuestType,
    id: Number(id),
    name: `${type.toUpperCase()} ${id}`,
    hash,
  };
}

function getSelectedTreeText(): string | null {
  const selectors = [
    '.x-treelist-item-selected .x-treelist-item-text',
    '.x-grid-item-selected .x-tree-node-text',
    '.x-treelist-row.x-treelist-item-selected .x-treelist-item-text',
  ];

  for (const selector of selectors) {
    const text = document.querySelector(selector)?.textContent?.trim();
    if (text) {
      return text;
    }
  }

  return null;
}

function parseNameFromTreeText(text: string): string {
  const match = text.match(/^(\d+)\s*\((.+)\)$/);
  if (match) {
    return match[2].trim();
  }

  return text;
}

export function getSelectedGuest(): GuestRef | null {
  const fromHash = parseGuestFromHash();
  if (fromHash) {
    const treeText = getSelectedTreeText();
    if (treeText) {
      fromHash.name = parseNameFromTreeText(treeText);
    }
    return fromHash;
  }

  const treeText = getSelectedTreeText();
  if (!treeText) {
    return null;
  }

  const idMatch = treeText.match(/^(\d+)/);
  if (!idMatch) {
    return null;
  }

  const hash = location.hash;
  const path = decodeHashPath(hash) ?? '';
  const type: GuestType = path.toLowerCase().includes('/lxc/') ? 'lxc' : 'qemu';
  const nodeMatch = path.match(/\/([^/]+)\/(?:qemu|lxc)\//i);

  return {
    id: Number(idMatch[1]),
    type,
    node: nodeMatch?.[1] ?? 'pve',
    name: parseNameFromTreeText(treeText),
    hash,
  };
}

export function isGuestDetailContext(): boolean {
  const hash = location.hash.toLowerCase();
  if (hash.includes('qemu') || hash.includes('lxc')) {
    return true;
  }

  const label = document
    .querySelector(
      '.x-treelist-item-selected .x-treelist-item-text, .x-grid-item-selected .x-tree-node-text',
    )
    ?.textContent?.trim();

  return Boolean(label && /^\d+/.test(label));
}

const GUEST_PANEL_LABELS = [
  'summary',
  'übersicht',
  'network',
  'netzwerk',
  'cloud-init',
  'cloud init',
  'hardware',
  'options',
  'optionen',
  'dns',
];

export function isGuestFormCopyContext(): boolean {
  if (!isGuestDetailContext()) {
    return false;
  }

  const selectedPanel = document
    .querySelector('.x-treelist-item-selected .x-treelist-item-text')
    ?.textContent?.trim()
    .toLowerCase();

  if (!selectedPanel) {
    return true;
  }

  return GUEST_PANEL_LABELS.some((label) => selectedPanel.includes(label));
}

export function buildGuestHash(
  node: string,
  type: GuestType,
  id: number,
): string {
  const path = encodeURIComponent(`${node}/${type}/${id}`);
  return `#v1:0:=${path}:4:::::::`;
}

export function getCurrentHost(): string {
  return window.location.host;
}
