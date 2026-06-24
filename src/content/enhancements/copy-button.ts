import { ensureStyles, observeDomChanges } from '../../shared/dom';

import { isGuestFormCopyContext } from '../../shared/guest-context';
import { isStorageNameCopyContext, isTaskLogCopyContext } from '../context';
import {
  cleanupFormCopyMarkers,
  scanFormCopyTargets,
} from './copy-form';
import { scanStorageCopyTargets } from './copy-storage';
import {
  cleanupStorageCopyMarkers,
  cleanupTaskCopyMarkers,
  scanTaskCopyTargets,
} from './copy-task';
import type { Enhancement } from './types';

let observer: MutationObserver | null = null;

function scanForCopyTargets(): void {
  if (isStorageNameCopyContext()) {
    scanStorageCopyTargets();
  } else {
    cleanupStorageCopyMarkers();
  }

  if (isGuestFormCopyContext()) {
    scanFormCopyTargets();
  } else {
    cleanupFormCopyMarkers();
  }

  if (isTaskLogCopyContext()) {
    scanTaskCopyTargets();
  } else {
    cleanupTaskCopyMarkers();
  }
}

function cleanupCopyMarkers(): void {
  cleanupStorageCopyMarkers();
  cleanupFormCopyMarkers();
  cleanupTaskCopyMarkers();
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
