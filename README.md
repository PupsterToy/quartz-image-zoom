# image-zoom

> Quartz v5 component plugin — click any content image to open a full-screen lightbox with scroll-zoom, drag-pan, double-click reset, and Esc to close.

[Quartz](https://quartz.jzhao.xyz/) v5 plugin · TypeScript · zero runtime dependencies

## Features

- **Click to zoom** — clicking any `<img>` in the article body opens a full-screen lightbox
- **Scroll-wheel zoom** — scale from 0.2× to 8×
- **Drag to pan** — pointer-events based, works on mouse and touch
- **Double-click reset** — instantly returns to 1× scale and centered position
- **Esc / click backdrop to close**
- **SPA-aware** — survives Quartz's client-side navigation (`nav` / `render` events rebuild the overlay)
- **Zero dependencies** — pure vanilla JS, no jQuery, no Photoswipe, nothing

Images in the header, sidebar explorer, and icons/logos are automatically excluded.

## How it works

This is a **component-type** Quartz plugin. It doesn't render visible layout content — instead it injects:

1. **Global CSS** (`.img-zoom-overlay`, `.img-zoom-img`, `.img-zoom-hint`) via `component.css`
2. **Client-side JS** via `component.afterDOMLoaded` that:
   - Creates the lightbox overlay DOM on `init()`
   - Listens for `click` events on `<img>` elements (event delegation on `document`, so it works after SPA navigation)
   - Rebuilds the overlay on `nav` / `render` events (Quartz's SPA router replaces `document.body` children, destroying the overlay)
   - Handles wheel-zoom, pointer-drag-pan, double-click-reset, and Esc-close

The overlay and document-level listeners are created once and reused; only the overlay DOM is rebuilt on page transitions.

## Installation

### Option A — GitHub source (recommended)

```yaml
# quartz.config.yaml
plugins:
  - source: "git+https://github.com/mgxhkefate/image-zoom.git"
    enabled: true
```

### Option B — local path

```yaml
plugins:
  - source: "./custom-plugins/image-zoom"
    enabled: true
```

> **Windows note:** local-path sources use symbolic links. If your terminal lacks symlink permission, either enable Developer Mode or use the GitHub source instead.

## Configuration

No options. Just enable it.

### Excluding images

The plugin automatically skips images inside `<header>`, `.explorer`, `[data-component="explorer"]`, and images with `icon` or `logo` in their class name. If you need to exclude additional areas, modify the `ensureDocListeners` function in `components.ts`.

## Compatibility

- Quartz v5 (`@quartz-community/types`)
- Node.js ≥ 18
- Works with `enableSPA: true` (the default)

## License

MIT
