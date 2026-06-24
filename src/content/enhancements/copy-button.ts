import { copyToClipboard } from '../../shared/clipboard';
import {
  attachCopyButtonToCell,
  createCopyButton,
  ensureStyles,
  getCopyableText,
  observeDomChanges,
} from '../../shared/dom';
import {
  COPY_MARKER,
  GRID_NAME_CELL_SELECTOR,
  isFilenameLike,
} from '../../shared/selectors';
import { isStorageNameCopyContext } from '../storage-context';

export interface Enhancement {
  id: string;
  start: () => void;
  stop: () => void;
}

let observer: MutationObserver | null = null;

function shouldEnhanceGridCell(element: HTMLElement): boolean {
  if (!isStorageNameCopyContext()) {
    return false;
  }

  if (element.hasAttribute(COPY_MARKER)) {
    return false;
  }

  if (
    element.closest(
      '.x-form-trigger-wrap, .x-combobox, .x-boundlist, .x-form-type-combobox, .x-field',
    )
  ) {
    return false;
  }

  const text = getCopyableText(element).trim();
  return isFilenameLike(text);
}

function enhanceGridCell(element: HTMLElement): void {
  if (!shouldEnhanceGridCell(element)) {
    return;
  }

  const text = getCopyableText(element).trim();
  element.dataset.phCopyValue = text;

  const button = createCopyButton(
    () => element.dataset.phCopyValue ?? getCopyableText(element),
    copyToClipboard,
  );
  attachCopyButtonToCell(element, button);
}

function scanForCopyTargets(): void {
  if (!isStorageNameCopyContext()) {
    cleanupCopyMarkers();
    return;
  }

  document
    .querySelectorAll<HTMLElement>(GRID_NAME_CELL_SELECTOR)
    .forEach((element) => enhanceGridCell(element));
}

function cleanupCopyMarkers(): void {
  document.querySelectorAll(`[${COPY_MARKER}]`).forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    if (element.classList.contains('ph-copy-cell')) {
      element.querySelector('.ph-copy-btn')?.remove();
      element.classList.remove('ph-copy-cell');
      element.removeAttribute(COPY_MARKER);
      delete element.dataset.phCopyValue;
      return;
    }

    const wrapper = element.closest('.ph-copy-wrap');
    const button = wrapper?.querySelector('.ph-copy-btn');
    button?.remove();
    element.removeAttribute(COPY_MARKER);

    if (wrapper?.parentElement) {
      wrapper.parentElement.insertBefore(element, wrapper);
      wrapper.remove();
    }
  });
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
    cleanupCopyMarkers();
  },
};
