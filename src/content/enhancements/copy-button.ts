import { copyToClipboard } from '../../shared/clipboard';
import {
  createCopyButton,
  ensureStyles,
  getElementText,
  observeDomChanges,
  wrapWithCopyButton,
} from '../../shared/dom';
import {
  COPY_MARKER,
  COPY_TARGETS,
  isLikelyCopyableValue,
} from '../../shared/selectors';

export interface Enhancement {
  id: string;
  start: () => void;
  stop: () => void;
}

let observer: MutationObserver | null = null;

function shouldEnhanceElement(element: HTMLElement): boolean {
  if (element.hasAttribute(COPY_MARKER)) {
    return false;
  }

  if (element.closest('.ph-copy-wrap')) {
    return false;
  }

  if (element instanceof HTMLInputElement && element.type === 'password') {
    return false;
  }

  if (element instanceof HTMLInputElement && element.type === 'hidden') {
    return false;
  }

  const value = getElementText(element).trim();
  return isLikelyCopyableValue(value);
}

function enhanceElement(element: HTMLElement): void {
  if (!shouldEnhanceElement(element)) {
    return;
  }

  const button = createCopyButton(
    () => getElementText(element),
    copyToClipboard,
  );
  wrapWithCopyButton(element, button);
}

function scanForCopyTargets(): void {
  for (const target of COPY_TARGETS) {
    const elements = document.querySelectorAll<HTMLElement>(target.selector);
    elements.forEach((element) => enhanceElement(element));
  }
}

export const copyButtonEnhancement: Enhancement = {
  id: 'copyButtons',

  start() {
    ensureStyles();
    scanForCopyTargets();
    observer = observeDomChanges(scanForCopyTargets);
  },

  stop() {
    observer?.disconnect();
    observer = null;

    document.querySelectorAll(`[${COPY_MARKER}]`).forEach((element) => {
      const wrapper = element.closest('.ph-copy-wrap');
      const button = wrapper?.querySelector('.ph-copy-btn');
      button?.remove();
      element.removeAttribute(COPY_MARKER);

      if (wrapper && wrapper.parentElement) {
        wrapper.parentElement.insertBefore(element, wrapper);
        wrapper.remove();
      }
    });
  },
};
