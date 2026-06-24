import { copyToClipboard } from '../../shared/clipboard';
import { isCopyableByLabel, isCopyableValue } from '../../shared/copyable-value';
import {
  attachCopyButtonToCell,
  createCopyButton,
  getCopyableText,
  wrapWithCopyButton,
} from '../../shared/dom';
import { isGuestFormCopyContext } from '../../shared/guest-context';
import { COPY_MARKER } from '../../shared/selectors';

const FORM_FIELD_SELECTOR =
  '.x-panel-body input.x-form-field:not([type="checkbox"]):not([type="radio"]), .x-panel-body textarea.x-form-field, .x-panel-body .x-form-display-field';

function getFieldLabel(element: HTMLElement): string {
  const formItem = element.closest('.x-form-item');
  const label =
    formItem?.querySelector('.x-form-item-label-text')?.textContent?.trim() ?? '';
  return label;
}

function shouldEnhanceFormField(element: HTMLElement): boolean {
  if (!isGuestFormCopyContext()) {
    return false;
  }

  if (element.hasAttribute(COPY_MARKER)) {
    return false;
  }

  if (
    element.closest(
      '.x-form-trigger-wrap, .x-combobox, .x-boundlist, .x-form-type-combobox, .x-field-toolbar',
    )
  ) {
    return false;
  }

  if (element instanceof HTMLInputElement && element.disabled) {
    return false;
  }

  const value = getCopyableText(element).trim();
  if (!value) {
    return false;
  }

  const label = getFieldLabel(element);
  return isCopyableValue(value) || isCopyableByLabel(label, value);
}

function enhanceFormField(element: HTMLElement): void {
  if (!shouldEnhanceFormField(element)) {
    return;
  }

  const button = createCopyButton(() => getCopyableText(element), copyToClipboard);
  wrapWithCopyButton(element, button);
}

export function scanFormCopyTargets(): void {
  if (!isGuestFormCopyContext()) {
    return;
  }

  document
    .querySelectorAll<HTMLElement>(FORM_FIELD_SELECTOR)
    .forEach((element) => enhanceFormField(element));
}

export function cleanupFormCopyMarkers(): void {
  document.querySelectorAll<HTMLElement>(FORM_FIELD_SELECTOR).forEach((element) => {
    if (!element.hasAttribute(COPY_MARKER)) {
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
