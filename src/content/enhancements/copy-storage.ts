import { copyToClipboard } from '../../shared/clipboard';
import {
  attachCopyButtonToCell,
  createCopyButton,
  getCopyableText,
} from '../../shared/dom';
import {
  COPY_MARKER,
  GRID_NAME_CELL_SELECTOR,
  isFilenameLike,
} from '../../shared/selectors';
import { isStorageNameCopyContext } from '../context';

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

export function scanStorageCopyTargets(): void {
  if (!isStorageNameCopyContext()) {
    return;
  }

  document
    .querySelectorAll<HTMLElement>(GRID_NAME_CELL_SELECTOR)
    .forEach((element) => enhanceGridCell(element));
}
