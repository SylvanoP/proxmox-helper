export const COPY_MARKER = 'data-ph-copy';

export interface CopyTarget {
  selector: string;
  label?: string;
}

/** Proxmox DOM selectors for fields that benefit from a copy button. */
export const COPY_TARGETS: CopyTarget[] = [
  { selector: 'input.x-form-field[type="text"][readonly]', label: 'Feld' },
  { selector: 'input.x-form-field[type="text"]:not([type="password"])', label: 'Feld' },
  { selector: 'textarea.x-form-field[readonly]', label: 'Text' },
  { selector: 'div.x-form-display-field', label: 'Wert' },
  { selector: 'span[id*="value"]', label: 'Wert' },
];

export function isLikelyCopyableValue(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) {
    return false;
  }

  if (trimmed.length < 3) {
    return false;
  }

  const skipPatterns = [
    /^(ja|nein|yes|no|true|false|on|off)$/i,
    /^(running|stopped|paused|enabled|disabled)$/i,
    /^\d+\s*(gb|mb|kb|tb|%|mhz|ghz)$/i,
  ];

  if (skipPatterns.some((pattern) => pattern.test(trimmed))) {
    return false;
  }

  const copyablePatterns = [
    /^[\d.a-f:]+$/i,
    /^[\w.-]+@[\w.-]+$/,
    /^[\w./:?#&=+-]+$/,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    /^PVEAPIToken=/i,
    /^vmid:\d+/i,
  ];

  return copyablePatterns.some((pattern) => pattern.test(trimmed));
}
