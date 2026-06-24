import { copyToClipboard } from '../../shared/clipboard';
import { isTaskLogCopyable } from '../../shared/copyable-value';
import {
  attachCopyButtonToCell,
  createCopyButton,
  getCopyableText,
} from '../../shared/dom';
import { COPY_MARKER, GRID_NAME_CELL_SELECTOR } from '../../shared/selectors';
import { isTaskLogCopyContext } from '../context';

const TASK_CELL_SELECTOR = '.x-grid-view .x-grid-cell .x-grid-cell-inner';

function shouldEnhanceTaskCell(element: HTMLElement): boolean {
  if (!isTaskLogCopyContext()) {
    return false;
  }

  if (element.hasAttribute(COPY_MARKER)) {
    return false;
  }

  const text = getCopyableText(element).trim();
  return isTaskLogCopyable(text);
}

function enhanceTaskCell(element: HTMLElement): void {
  if (!shouldEnhanceTaskCell(element)) {
    return;
  }

  element.dataset.phCopyValue = getCopyableText(element).trim();

  const button = createCopyButton(
    () => element.dataset.phCopyValue ?? getCopyableText(element),
    copyToClipboard,
  );
  attachCopyButtonToCell(element, button);
}

export function scanTaskCopyTargets(): void {
  if (!isTaskLogCopyContext()) {
    return;
  }

  document
    .querySelectorAll<HTMLElement>(TASK_CELL_SELECTOR)
    .forEach((element) => enhanceTaskCell(element));
}

export function cleanupTaskCopyMarkers(): void {
  document.querySelectorAll<HTMLElement>(TASK_CELL_SELECTOR).forEach((element) => {
    if (!element.classList.contains('ph-copy-cell')) {
      return;
    }

    element.querySelector('.ph-copy-btn')?.remove();
    element.classList.remove('ph-copy-cell');
    element.removeAttribute(COPY_MARKER);
    delete element.dataset.phCopyValue;
  });
}

export function cleanupStorageCopyMarkers(): void {
  document
    .querySelectorAll<HTMLElement>(GRID_NAME_CELL_SELECTOR)
    .forEach((element) => {
      if (!element.classList.contains('ph-copy-cell')) {
        return;
      }

      element.querySelector('.ph-copy-btn')?.remove();
      element.classList.remove('ph-copy-cell');
      element.removeAttribute(COPY_MARKER);
      delete element.dataset.phCopyValue;
    });
}
