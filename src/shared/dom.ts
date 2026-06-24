import { COPY_MARKER } from './selectors';

const STYLE_ID = 'proxmox-helper-styles';

export function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .ph-copy-wrap {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      max-width: 100%;
    }

    .ph-copy-wrap > input,
    .ph-copy-wrap > textarea,
    .ph-copy-wrap > .x-form-display-field {
      flex: 1;
      min-width: 0;
    }

    .ph-copy-btn {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      padding: 0;
      border: 1px solid #c8c8c8;
      border-radius: 3px;
      background: #f5f5f5;
      color: #333;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
      transition: background 0.15s, border-color 0.15s;
    }

    .ph-copy-btn:hover {
      background: #e56531;
      border-color: #d45520;
      color: #fff;
    }

    .ph-copy-btn--success {
      background: #3d8b40;
      border-color: #2e6b30;
      color: #fff;
    }

    .ph-copy-btn--error {
      background: #c0392b;
      border-color: #a93226;
      color: #fff;
    }

    .ph-copy-cell {
      display: inline-flex !important;
      align-items: center;
      gap: 4px;
      max-width: 100%;
      overflow: visible !important;
    }

    .ph-copy-cell .ph-copy-btn {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      font-size: 10px;
      opacity: 0;
      transition: opacity 0.15s;
    }

    .x-grid-row:hover .ph-copy-cell .ph-copy-btn,
    .ph-copy-cell .ph-copy-btn:focus,
    .ph-copy-cell .ph-copy-btn.ph-copy-btn--success,
    .ph-copy-cell .ph-copy-btn.ph-copy-btn--error {
      opacity: 1;
    }

    .ph-copy-toast {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 2147483647;
      padding: 10px 16px;
      border-radius: 6px;
      background: #2e6b30;
      color: #fff;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      opacity: 0;
      transform: translateY(8px);
      pointer-events: none;
      transition: opacity 0.2s, transform 0.2s;
    }

    .ph-copy-toast--visible {
      opacity: 1;
      transform: translateY(0);
    }

    .ph-copy-toast--error {
      background: #a93226;
    }

    .ph-shell-bar {
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      gap: 10px;
      max-width: calc(100vw - 32px);
      margin-top: 4px;
      padding: 6px 10px;
      border: 1px solid #d8d8d8;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.97);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
    }

    .ph-shell-bar__title {
      font-weight: 600;
      color: #444;
      white-space: nowrap;
    }

    .ph-shell-bar__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .ph-shell-bar__btn {
      padding: 3px 8px;
      border: 1px solid #c8c8c8;
      border-radius: 3px;
      background: #f5f5f5;
      color: #333;
      cursor: pointer;
      font-size: 11px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }

    .ph-shell-bar__btn:hover {
      background: #e56531;
      border-color: #d45520;
      color: #fff;
    }

    .ph-pinned-bar {
      position: fixed;
      top: 0;
      right: 12px;
      z-index: 2147483645;
      display: flex;
      align-items: center;
      gap: 6px;
      max-width: 45vw;
      margin-top: 4px;
      padding: 5px 8px;
      border: 1px solid #d8d8d8;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.97);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      overflow-x: auto;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      font-size: 11px;
    }

    .ph-pinned-bar__label {
      font-weight: 600;
      color: #666;
      white-space: nowrap;
    }

    .ph-pinned-bar__item {
      padding: 3px 8px;
      border: 1px solid #c8c8c8;
      border-radius: 3px;
      background: #fff;
      color: #333;
      cursor: pointer;
      white-space: nowrap;
    }

    .ph-pinned-bar__item:hover {
      background: #e56531;
      border-color: #d45520;
      color: #fff;
    }

    .ph-pin-btn {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      padding: 0;
      border: none;
      background: transparent;
      color: #999;
      cursor: pointer;
      font-size: 13px;
      line-height: 1;
      opacity: 0;
      transition: opacity 0.15s, color 0.15s;
    }

    .x-treelist-item:hover .ph-pin-btn,
    .ph-pin-btn--active {
      opacity: 1;
    }

    .ph-pin-btn--active {
      color: #e56531;
    }

    .ph-pin-btn:hover {
      color: #e56531;
    }

    .ph-storage-warn {
      display: inline-flex;
      margin-left: 6px;
      padding: 1px 5px;
      border-radius: 3px;
      background: #c0392b;
      color: #fff;
      font-size: 10px;
      font-weight: 600;
      line-height: 1.3;
      vertical-align: middle;
    }
  `;
  document.head.appendChild(style);
}

let toastTimeout: number | undefined;

export function showCopyToast(message = 'Kopiert!', success = true): void {
  let toast = document.getElementById('ph-copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ph-copy-toast';
    toast.className = 'ph-copy-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.toggle('ph-copy-toast--error', !success);
  toast.classList.add('ph-copy-toast--visible');

  if (toastTimeout !== undefined) {
    window.clearTimeout(toastTimeout);
  }

  toastTimeout = window.setTimeout(() => {
    toast?.classList.remove('ph-copy-toast--visible');
  }, 2000);
}

export function createCopyButton(
  getValue: () => string,
  onCopy: (value: string) => Promise<boolean>,
): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ph-copy-btn';
  button.title = 'In Zwischenablage kopieren';
  button.setAttribute('aria-label', 'In Zwischenablage kopieren');
  button.innerHTML =
    '<svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 11V3a1 1 0 0 1 1-1h8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

  button.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const success = await onCopy(getValue());
    const originalHtml = button.innerHTML;

    button.classList.remove('ph-copy-btn--success', 'ph-copy-btn--error');
    button.classList.add(success ? 'ph-copy-btn--success' : 'ph-copy-btn--error');

    if (success) {
      button.textContent = '✓';
      showCopyToast('Kopiert!', true);
    } else {
      button.textContent = '✗';
      showCopyToast('Kopieren fehlgeschlagen', false);
    }

    window.setTimeout(() => {
      button.classList.remove('ph-copy-btn--success', 'ph-copy-btn--error');
      button.innerHTML = originalHtml;
    }, 1500);
  });

  return button;
}

export function attachCopyButtonToCell(
  container: HTMLElement,
  button: HTMLButtonElement,
): void {
  if (container.hasAttribute(COPY_MARKER)) {
    return;
  }

  container.classList.add('ph-copy-cell');
  container.appendChild(button);
  container.setAttribute(COPY_MARKER, 'true');
}

export function wrapWithCopyButton(
  element: HTMLElement,
  button: HTMLButtonElement,
): void {
  if (element.closest('.ph-copy-wrap') || element.hasAttribute(COPY_MARKER)) {
    return;
  }

  const parent = element.parentElement;
  if (!parent) {
    return;
  }

  const wrapper = document.createElement('span');
  wrapper.className = 'ph-copy-wrap';
  parent.insertBefore(wrapper, element);
  wrapper.appendChild(element);
  wrapper.appendChild(button);
  element.setAttribute(COPY_MARKER, 'true');
}

export function observeDomChanges(callback: () => void): MutationObserver {
  let scheduled = false;

  const run = () => {
    scheduled = false;
    callback();
  };

  const schedule = () => {
    if (scheduled) {
      return;
    }
    scheduled = true;
    requestAnimationFrame(run);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['value', 'class'],
  });

  return observer;
}

export function getCopyableText(element: HTMLElement): string {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.value;
  }

  const stored = element.dataset.phCopyValue;
  if (stored) {
    return stored;
  }

  const clone = element.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('.ph-copy-btn').forEach((btn) => btn.remove());
  return (clone.textContent ?? '').trim();
}
