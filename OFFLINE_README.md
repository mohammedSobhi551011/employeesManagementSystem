Attendance App — Offline Usage

How to use

1. Copy the `attendance-dist-offline.zip` file to the offline PC and extract it somewhere.
2. Open the extracted `dist/index.html` in a modern browser (double-click or `file://.../dist/index.html`).
3. Navigation uses hash routing (URLs look like `index.html#/attendance`) so no server is required.
4. Data persistence uses `localStorage`, which works when running from `file://` in most modern browsers.

Notes and troubleshooting

- If assets don't load, ensure you opened `dist/index.html` (not the built `index.html` inside another path). The build uses relative paths.
- For best compatibility, use Chrome, Edge, or Firefox.
- To clear app data, open DevTools > Application > Local Storage and remove the app entries.

Contact

If you want, I can also produce a single self-contained HTML (all assets inlined) or an Electron bundle for distribution.
