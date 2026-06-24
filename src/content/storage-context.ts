const BACKUP_LABELS = ['backup', 'backups', 'sicherung', 'sicherungen'];
const CT_TEMPLATE_LABELS = [
  'ct template',
  'ct templates',
  'ct-template',
  'ct-templates',
  'ct vorlage',
  'ct vorlagen',
];
const CT_VOLUME_LABELS = ['ct volume', 'ct volumes', 'ct-volume', 'ct-volumes'];
const VM_DISK_LABELS = ['vm disk', 'vm disks', 'vm-disk', 'vm-disks', 'vm-laufwerk', 'vm-laufwerke'];

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

function labelMatches(label: string, patterns: string[]): boolean {
  const normalized = normalizeLabel(label);
  return patterns.some(
    (pattern) => normalized === pattern || normalized.includes(pattern),
  );
}

function getSelectedSidebarLabel(): string | null {
  const selectors = [
    '.x-treelist-item-selected .x-treelist-item-text',
    '.x-treelist-row.x-treelist-item-selected .x-treelist-item-text',
    '.x-grid-item-selected .x-tree-node-text',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    const text = element?.textContent?.trim();
    if (text) {
      return text;
    }
  }

  return null;
}

function hashIndicatesAllowedView(): boolean {
  const hash = location.hash.toLowerCase();
  return (
    hash.includes('backup') ||
    hash.includes('vztmpl') ||
    hash.includes('rootdir') ||
    hash.includes(':images') ||
    hash.includes('content/images')
  );
}

/** Copy buttons on storage content lists (name column). */
export function isStorageNameCopyContext(): boolean {
  if (hashIndicatesAllowedView()) {
    return true;
  }

  const label = getSelectedSidebarLabel();
  if (!label) {
    return false;
  }

  return (
    labelMatches(label, BACKUP_LABELS) ||
    labelMatches(label, CT_TEMPLATE_LABELS) ||
    labelMatches(label, CT_VOLUME_LABELS) ||
    labelMatches(label, VM_DISK_LABELS)
  );
}
