import { ensureStyles } from '../../shared/dom';

const BADGE_CLASS = 'ph-storage-warn';
const WARN_THRESHOLD = 0.9;
const POLL_INTERVAL_MS = 60_000;

interface StorageEntry {
  storage: string;
  used_fraction?: number;
  enabled?: number;
}

interface NodeStorageResponse {
  data?: StorageEntry[];
}

async function fetchNodeStorage(node: string): Promise<StorageEntry[]> {
  try {
    const response = await fetch(`/api2/json/nodes/${encodeURIComponent(node)}/storage`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as NodeStorageResponse;
    return payload.data ?? [];
  } catch {
    return [];
  }
}

async function fetchNodes(): Promise<string[]> {
  try {
    const response = await fetch('/api2/json/nodes', {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as { data?: Array<{ node: string }> };
    return (payload.data ?? []).map((entry) => entry.node);
  } catch {
    return [];
  }
}

function clearBadges(): void {
  document.querySelectorAll(`.${BADGE_CLASS}`).forEach((badge) => badge.remove());
}

function applyBadge(treeText: HTMLElement, fraction: number): void {
  const item = treeText.closest('.x-treelist-item, .x-grid-cell');
  if (!item || item.querySelector(`.${BADGE_CLASS}`)) {
    return;
  }

  const badge = document.createElement('span');
  badge.className = BADGE_CLASS;
  badge.title = `Speicher zu ${Math.round(fraction * 100)}% belegt`;
  badge.textContent = `${Math.round(fraction * 100)}%`;
  item.appendChild(badge);
}

async function updateStorageBadges(): Promise<void> {
  clearBadges();

  const nodes = await fetchNodes();
  const warnings = new Map<string, number>();

  for (const node of nodes) {
    const storage = await fetchNodeStorage(node);
    for (const entry of storage) {
      if (entry.enabled === 0) {
        continue;
      }

      const fraction = entry.used_fraction;
      if (fraction === undefined || fraction < WARN_THRESHOLD) {
        continue;
      }

      warnings.set(entry.storage, fraction);
    }
  }

  document.querySelectorAll<HTMLElement>('.x-treelist-item-text').forEach((textEl) => {
    const label = textEl.textContent?.trim();
    if (!label) {
      return;
    }

    const fraction = warnings.get(label);
    if (fraction !== undefined) {
      applyBadge(textEl, fraction);
    }
  });
}

let pollTimer: number | undefined;
let observer: MutationObserver | null = null;

export const apiInsightsEnhancement = {
  id: 'apiInsights',

  start() {
    ensureStyles();
    void updateStorageBadges();

    pollTimer = window.setInterval(() => {
      void updateStorageBadges();
    }, POLL_INTERVAL_MS);

    observer = new MutationObserver(() => {
      void updateStorageBadges();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },

  stop() {
    if (pollTimer !== undefined) {
      window.clearInterval(pollTimer);
      pollTimer = undefined;
    }
    observer?.disconnect();
    observer = null;
    clearBadges();
  },
};
