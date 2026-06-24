export const COPY_MARKER = 'data-ph-copy';

/** ExtJS grid "Name" column in storage content lists. */
export const GRID_NAME_CELL_SELECTOR =
  '.x-grid-view .x-grid-cell-first .x-grid-cell-inner';

const SKIP_VALUE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/,
  /^(tzst|txz|vma|iso|raw|qcow2|vmdk)$/i,
];

const FILENAME_PATTERNS = [
  /^vzdump-(qemu|lxc)-\d+-.+/i,
  /^(vm|subvol|base)-\d+-disk-\d+/i,
  /\.(tar\.(zst|gz|lzo|xz)|vma\.(zst|gz|lzo)|iso|img|qcow2|raw|vmdk|log|conf)$/i,
  /^[\w@.+()-]+\.(zst|xz|gz|img|raw|qcow2|vmdk)$/i,
];

export function isFilenameLike(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length < 3 || trimmed.length > 255) {
    return false;
  }

  if (trimmed.includes('\n') || trimmed.includes(' ')) {
    return false;
  }

  if (SKIP_VALUE_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return false;
  }

  return FILENAME_PATTERNS.some((pattern) => pattern.test(trimmed));
}
