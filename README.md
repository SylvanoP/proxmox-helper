# Proxmox Helper

Chrome-Extension mit Quality-of-Life-Verbesserungen für die [Proxmox VE](https://www.proxmox.com/) Web-Oberfläche.

Aktuell: Copy-Buttons in Storage-Listen für **Backups**, **CT Templates**, **CT Volumes** und **VM Disks** (Namensspalte).

## Funktionsweise

Die Extension injiziert **Content Scripts** in die laufende Proxmox-Web-UI (Port `8006`). Es werden keine Credentials gespeichert und keine Daten an externe Server gesendet. Die Erweiterung liest und ergänzt nur das DOM der Seite, die du bereits geöffnet hast.

## Installation (Entwicklung)

### Voraussetzungen

- Node.js 20+
- Google Chrome oder Chromium

### Build

```bash
npm install
npm run build
```

Der fertige Extension-Ordner liegt in `dist/`.

### In Chrome laden

1. `chrome://extensions` öffnen
2. **Entwicklermodus** aktivieren
3. **Entpackte Erweiterung laden** → Ordner `dist/` auswählen
4. Proxmox-Web-UI öffnen (`https://dein-host:8006`)

### Entwicklung mit Hot Reload

```bash
npm run dev
```

Dann `dist/` wie oben laden. Änderungen werden beim Speichern neu gebaut.

## Einstellungen

Über das Extension-Icon im Browser:

- **Copy-Buttons anzeigen** – ein-/ausschalten

Einstellungen werden per `chrome.storage.sync` gespeichert.

## Neues Feature hinzufügen

1. Modul unter `src/content/enhancements/` anlegen (siehe `copy-button.ts`)
2. In `src/content/index.ts` in `ENHANCEMENTS` registrieren
3. Optional: Toggle in `src/shared/settings.ts` und `src/popup/` ergänzen
4. Proxmox-spezifische Selektoren in `src/shared/selectors.ts` pflegen

## Projektstruktur

```
src/
├── manifest.json          # Chrome Manifest V3
├── background/            # Service Worker (minimal)
├── content/               # Content Scripts + Enhancements
├── popup/                 # Einstellungs-Popup
└── shared/                # Utils, Settings, Selektoren
```

## Sicherheit & Datenschutz

- Keine API-Tokens oder Passwörter in der Extension
- Kein Tracking, keine Analytics
- Läuft nur auf Seiten mit Port `8006` und erkanntem Proxmox-DOM
- Open Source unter MIT-Lizenz

## Roadmap

- Copy-Buttons für weitere Proxmox-Felder
- Keyboard-Shortcuts
- Status-Badges / bessere Übersicht
- Optional später: Proxmox REST API für Bulk-Operationen

## Lizenz

MIT – siehe [LICENSE](LICENSE)
