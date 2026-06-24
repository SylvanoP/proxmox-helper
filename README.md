# Proxmox Helper

Chrome-Extension mit Quality-of-Life-Verbesserungen für die [Proxmox VE](https://www.proxmox.com/) Web-Oberfläche.

Aktuell: Copy-Buttons, Tastaturkürzel, Shell-Befehle, gepinnte Gäste und optionale API-Insights für die Proxmox-Web-UI.

## Features

| Feature | Beschreibung |
|---------|--------------|
| **Copy-Buttons** | Storage-Listen (Backups, Templates, …), VM/CT-Felder (IP, MAC, Gateway, …), Task-Logs |
| **Tastaturkürzel** | `/` oder `Ctrl+K` → Suche fokussieren · `Ctrl+Shift+C` → VMID kopieren |
| **Shell-Befehle** | Leiste mit `qm`/`pct`-Befehlen zum Kopieren bei ausgewähltem Gast |
| **Gepinnte Gäste** | Stern in der Baumansicht · Schnellzugriff-Leiste oben rechts |
| **API-Insights** | Opt-in: Storage-Warnbadge ab 90% Belegung (nutzt Proxmox-Session) |

## Funktionsweise

Die Extension injiziert **Content Scripts** in die laufende Proxmox-Web-UI (Port `8006`). Es werden keine Credentials gespeichert und keine Daten an externe Server gesendet. Die Erweiterung liest und ergänzt nur das DOM der Seite, die du bereits geöffnet hast.

## Installation

### Voraussetzungen

- Google Chrome oder Chromium
- Zum lokalen Bauen: Node.js 20+

### Fertig gebaut (ohne Node.js)

**GitHub Release** (empfohlen für stabile Versionen):

1. Unter [Releases](https://github.com/SylvanoP/proxmox-helper/releases) die neueste Version laden
2. ZIP entpacken → ein Ordner mit `manifest.json` im Root
3. In Chrome: `chrome://extensions` → **Entwicklermodus** → **Entpackte Erweiterung laden** → diesen Ordner wählen

**Neuester Build von `main`** (tägliche Entwicklungsversion):

1. [Actions → CI](https://github.com/SylvanoP/proxmox-helper/actions/workflows/ci.yml) → letzter grüner Lauf auf `main`
2. Artefakt **proxmox-helper-extension** herunterladen und entpacken
3. Entpackten Ordner wie oben in Chrome laden

### Lokal bauen (Entwicklung)

```bash
npm install
npm run build
```

Der fertige Extension-Ordner liegt in `dist/`.

### In Chrome laden

1. `chrome://extensions` öffnen
2. **Entwicklermodus** aktivieren
3. **Entpackte Erweiterung laden** → Ordner `dist/` (oder entpacktes Release) auswählen
4. Proxmox-Web-UI öffnen (`https://dein-host:8006`)

### Release erstellen (Maintainer)

Bei einem Version-Tag baut CI automatisch und hängt ein ZIP an das GitHub Release:

```bash
git tag v0.1.0
git push origin v0.1.0
```

### Entwicklung mit Hot Reload

```bash
npm run dev
```

Dann `dist/` wie oben laden. Änderungen werden beim Speichern neu gebaut.

## Einstellungen

Über das Extension-Icon im Browser — jedes Feature einzeln ein-/ausschaltbar:

- **Copy-Buttons** – Storage, Formularfelder, Task-Logs
- **Tastaturkürzel** – Suche und VMID
- **Shell-Befehle** – qm/pct zum Kopieren
- **Gepinnte Gäste** – Favoriten in der Baumansicht
- **API-Insights** – Storage-Warnungen (Opt-in, nutzt bestehende Session)

Einstellungen werden per `chrome.storage.sync` gespeichert. Gepinnte Gäste liegen in `chrome.storage.local`.

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

- Weitere Copy-Kontexte (Firewall, Backup-Jobs)
- Console-Paste-Helper für noVNC
- Erweiterte API-Insights (Backup-Alter pro VM)

## Lizenz

MIT – siehe [LICENSE](LICENSE)
