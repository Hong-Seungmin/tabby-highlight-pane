A [Tabby](https://tabby.sh) plugin that visually highlights the **active split pane** with a customizable border glow and dims inactive panes — making it easy to tell at a glance which terminal you're working in.

---

## 📸 Screenshots

|               Active Pane Highlighting               |                   Plugin Settings UI                    |
|:----------------------------------------------------:|:-------------------------------------------------------:|
|     ![Highlight Demo](./.assets/Screenshot1.png)     |        ![Settings UI](./.assets/Screenshot2.png)        |
| *Active terminal pane with customizable glow effect* | *Comprehensive configuration options in Tabby settings* |

---

## ✨ Features

- **Active pane highlight** — configurable border color, width, and inner/outer glow effect
- **Inactive pane dimming** — smoothly lowers opacity of unfocused panes (only in split layouts)
- **Toolbar highlight** — brightens the toolbar of the focused pane with a matching border
- **Smooth transitions** — all visual changes animate with configurable duration
- **Rounded pane layout** — adds `border-radius` and optional spacing between panes
- **Built-in settings UI** — all 18 options are editable in Tabby's **Settings → Highlight Pane** panel
- **Session restore compatible** — CSS is injected at module load, not just on new tabs

## 🛠️ Development

### Prerequisites

- Node.js 16+
- Tabby installed (for testing)

### Build

``` bash
# Install dependencies
npm install

# Build once
npm run build
```

### Project structure

```
src/
├── index.ts                          # NgModule entry point + CSS injection
├── config.ts                         # HighlightConfig interface & defaults
├── style-generator.ts                # CSS string generator
├── decorator.ts                      # TerminalDecorator (focus monitor lifecycle)
├── focus-monitor.ts                  # MutationObserver-based focus tracker
├── highlightPaneSettingsTabProvider.ts  # Settings panel registration
├── api.ts                            # Public API exports
└── components/
    └── highlight-pane-settings.component.ts  # Settings UI component
```

### How it works

1. **CSS Injection** — On module load, a `<style id="highlight-pane-css">` element is inserted into `document.head` with generated CSS rules.
2. **Focus Detection** — `FocusMonitor` uses a `MutationObserver` to watch for `.focused` class changes on `split-tab > .child` elements.
3. **CSS Update** — `HighlightPaneDecorator` listens to focus changes and refreshes the CSS to reflect the current configuration.
4. **Settings** — `HighlightPaneSettingsTabProvider` registers a settings tab; changes trigger `configService.save()` and the CSS updates reactively.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to open an [issue](https://www.google.com/search?q=../../issues) or submit a pull request.