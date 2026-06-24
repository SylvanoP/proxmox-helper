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
  `;
  document.head.appendChild(style);
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
  button.textContent = '⧉';

  button.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const success = await onCopy(getValue());
    const original = button.textContent;

    button.classList.remove('ph-copy-btn--success', 'ph-copy-btn--error');
    button.classList.add(success ? 'ph-copy-btn--success' : 'ph-copy-btn--error');
    button.textContent = success ? '✓' : '✗';

    window.setTimeout(() => {
      button.classList.remove('ph-copy-btn--success', 'ph-copy-btn--error');
      button.textContent = original;
    }, 1200);
  });

  return button;
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

export function getElementText(element: HTMLElement): string {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.value;
  }
  return element.textContent ?? '';
}
