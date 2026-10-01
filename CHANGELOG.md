# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-10-01

### Added
- **Active header highlight** ([#2](https://github.com/Hong-Seungmin/tabby-highlight-pane/issues/2))
  - Color the header (terminal toolbar) of the focused pane: background, opacity, text/icon and hover color
  - Works in split tabs and, optionally, non-split tabs (*Apply to non-split tabs*)
  - Configured like the border color: *Apply Theme Color* toggle + palette index
    - index `0` = Tabby theme default (no CSS override, follows the theme)
    - index `1`–`15` = terminal palette color (dark/light aware)
  - Hover color is configurable when the text/icon theme color is off; Tabby's hover highlight keeps working otherwise
  - Header preview chip in the settings (hover it to check the hover color)
- **Save / Cancel with live preview**
  - Changes are previewed instantly and only saved when you click **Save**
  - **Cancel** restores the last saved values; **Reset to Defaults** can be undone with Cancel
  - An "unsaved changes" indicator in a sticky action bar
  - Leaving the settings page with unsaved changes asks whether to save

### Changed
- "Auto Theme Color" is renamed to **"Apply Theme Color"** (en/ko), and the badge to "Theme"
- Color preview swatches have the same size as the color picker
- Theme color toggles are pinned to the right so controls don't shift when toggling
- CSS injection moved to `HighlightStyleService` (supports settings preview)

### Defaults
- New header options keep Tabby's own look: theme color on with index `0`, header background opacity `0.5`

## [1.0.3] - 2026-04-06

- Initial public release on npm: active split pane highlight, inactive pane dimming, toolbar highlight, auto theme color, settings UI (en/ko)

[1.1.0]: https://github.com/Hong-Seungmin/tabby-highlight-pane/compare/0b28243...v1.1.0
[1.0.3]: https://github.com/Hong-Seungmin/tabby-highlight-pane/tree/0b28243
