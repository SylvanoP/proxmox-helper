const IPV4_PATTERN =
  /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

const IPV6_PATTERN =
  /^(?:[0-9a-f]{1,4}:){7}[0-9a-f]{4}$|^(?:[0-9a-f]{1,4}:){1,7}:$|^::(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4}$/i;

const MAC_PATTERN = /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i;

const HOSTNAME_PATTERN =
  /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;

const VMID_PATTERN = /^\d{1,8}$/;

const COPYABLE_LABELS = [
  'ip',
  'ip address',
  'ip-adresse',
  'ipv4',
  'ipv6',
  'mac',
  'mac address',
  'gateway',
  'dns',
  'dns server',
  'hostname',
  'fqdn',
  'name server',
  'nameserver',
  'bridge',
  'vlan',
  'vm id',
  'ct id',
  'node',
  'ssh key',
  'public key',
];

export function isCopyableValue(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 512 || trimmed.includes('\n')) {
    return false;
  }

  if (IPV4_PATTERN.test(trimmed)) {
    return true;
  }

  if (IPV6_PATTERN.test(trimmed)) {
    return true;
  }

  if (MAC_PATTERN.test(trimmed)) {
    return true;
  }

  if (HOSTNAME_PATTERN.test(trimmed) && trimmed.includes('.')) {
    return true;
  }

  if (VMID_PATTERN.test(trimmed) && Number(trimmed) > 0) {
    return false;
  }

  return false;
}

export function isCopyableByLabel(label: string, value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 512) {
    return false;
  }

  const normalizedLabel = label.trim().toLowerCase();
  if (!COPYABLE_LABELS.some((entry) => normalizedLabel.includes(entry))) {
    return false;
  }

  if (trimmed.includes('\n')) {
    return false;
  }

  if (VMID_PATTERN.test(trimmed) && Number(trimmed) > 0) {
    return true;
  }

  return trimmed.length >= 1;
}

export function isTaskLogCopyable(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length < 8) {
    return false;
  }

  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return false;
  }

  if (/^(OK|WARN|ERROR|running|stopped|active|inactive)$/i.test(trimmed)) {
    return false;
  }

  return true;
}
