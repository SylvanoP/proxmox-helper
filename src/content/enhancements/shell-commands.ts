import { copyToClipboard } from '../../shared/clipboard';
import { ensureStyles, showCopyToast } from '../../shared/dom';
import { getSelectedGuest, type GuestType } from '../../shared/guest-context';

const BAR_ID = 'ph-shell-bar';

interface ShellCommand {
  label: string;
  command: string;
}

function buildCommands(type: GuestType, id: number): ShellCommand[] {
  if (type === 'lxc') {
    return [
      { label: 'pct enter', command: `pct enter ${id}` },
      { label: 'pct start', command: `pct start ${id}` },
      { label: 'pct stop', command: `pct stop ${id}` },
      { label: 'pct shutdown', command: `pct shutdown ${id}` },
      { label: 'pct reboot', command: `pct reboot ${id}` },
    ];
  }

  return [
    { label: 'qm terminal', command: `qm terminal ${id}` },
    { label: 'qm start', command: `qm start ${id}` },
    { label: 'qm stop', command: `qm stop ${id}` },
    { label: 'qm shutdown', command: `qm shutdown ${id}` },
    { label: 'qm reboot', command: `qm reboot ${id}` },
  ];
}

function removeBar(): void {
  document.getElementById(BAR_ID)?.remove();
}

function renderBar(): void {
  const guest = getSelectedGuest();
  if (!guest) {
    removeBar();
    return;
  }

  let bar = document.getElementById(BAR_ID);
  if (!bar) {
    bar = document.createElement('div');
    bar.id = BAR_ID;
    bar.className = 'ph-shell-bar';
    document.body.appendChild(bar);
  }

  const commands = buildCommands(guest.type, guest.id);
  bar.replaceChildren();

  const title = document.createElement('span');
  title.className = 'ph-shell-bar__title';
  title.textContent = `CLI · ${guest.type.toUpperCase()} ${guest.id}`;
  bar.appendChild(title);

  const actions = document.createElement('div');
  actions.className = 'ph-shell-bar__actions';

  for (const entry of commands) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ph-shell-bar__btn';
    button.textContent = entry.label;
    button.title = entry.command;
    button.addEventListener('click', async () => {
      const success = await copyToClipboard(entry.command);
      showCopyToast(success ? `${entry.command} kopiert` : 'Kopieren fehlgeschlagen', success);
    });
    actions.appendChild(button);
  }

  bar.appendChild(actions);
}

let observer: MutationObserver | null = null;

export const shellCommandsEnhancement = {
  id: 'shellCommands',

  start() {
    ensureStyles();
    renderBar();
    observer = new MutationObserver(() => renderBar());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    });
    window.addEventListener('hashchange', renderBar);
  },

  stop() {
    observer?.disconnect();
    observer = null;
    window.removeEventListener('hashchange', renderBar);
    removeBar();
  },
};
