const PROXMOX_PORT = '8006';

export function isProxmoxPage(): boolean {
  if (window.location.port !== PROXMOX_PORT) {
    return false;
  }

  if (document.querySelector('body.x-body, .x-panel, #ext-element-1')) {
    return true;
  }

  const title = document.title.toLowerCase();
  if (title.includes('proxmox')) {
    return true;
  }

  const scripts = Array.from(document.scripts);
  return scripts.some(
    (script) =>
      script.src.includes('extjs') ||
      script.src.includes('pve') ||
      script.textContent?.includes('Proxmox'),
  );
}
