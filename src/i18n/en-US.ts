/**
 * Highlight Pane – English (US) translations
 * Namespace: highlightPane.*
 */
export default {
  highlightPane: {
    enable:              'Enable',
    enableDesc:          'Enable or disable Split Pane highlighting',

    layout:              'Layout',
    paneMargin:          'Pane Margin (px)',
    paneMarginDesc:      'Padding around split-tab',
    paneRadius:          'Border Radius (px)',
    paneRadiusDesc:      'Pane border-radius',

    activePane:          'Active Pane',
    applyThemeColor:     'Apply Theme Color',
    applyThemeColorDesc:
      'Applies the color at the specified index from the terminal ' +
      'color palette to borders and glow based on dark/light mode. ',
    colorLabel:          'Color',
    colorIndex:          '',

    borderColor:         'Border Color',
    syncedWithToolbar:   'Synced with Toolbar',
    auto:                'Theme',
    borderWidth:         'Border Width (px)',

    innerGlowSize:       'Inner Glow Size (px)',
    innerGlowOpacity:    'Inner Glow Opacity',
    outerGlowSize:       'Outer Glow Size (px)',
    outerGlowOpacity:    'Outer Glow Opacity',

    activePaneOpacity:   'Active Pane Opacity',
    transitionSpeed:     'Transition Speed (ms)',

    inactivePane:        'Inactive Pane',
    inactivePaneOpacity: 'Inactive Pane Opacity',
    inactiveTransition:  'Inactive Transition (ms)',

    syncOnTitle:         'Click to use independent settings',
    syncOffTitle:        'Click to sync Active Pane with Toolbar',
    syncOnLabel:         'Active ↔ Toolbar Sync ON',
    syncOffLabel:        'Active ↔ Toolbar Independent',

    toolbar:             'Toolbar',
    toolbarHighlight:    'Toolbar Highlight',
    toolbarHighlightDesc:'Highlight the active pane toolbar',
    syncedWithActivePane:'Synced with Active Pane',
    toolbarBrightness:   'Toolbar Brightness',
    toolbarBrightnessDesc:'Adjusts brightness while keeping the original color',

    activeHeader:        'Active Header',
    headerSinglePane:    'Apply to non-split tabs',
    headerSinglePaneDesc:'Also apply the colors below to the header of tabs with a single pane',
    headerThemeDesc:
      'Index 0 keeps the default header color of the Tabby theme; 1–15 applies that color ' +
      'from the terminal color palette (switches with dark/light mode)',
    headerBgTheme:       'Header Background Theme Color',
    headerBgColor:       'Header Background',
    headerBgColorDesc:   'Header (toolbar) background color of the focused pane',
    headerBgOpacity:     'Header Background Opacity',
    headerFgTheme:       'Header Text & Icon Theme Color',
    headerFgColor:       'Header Text & Icon Color',
    headerFgColorDesc:   'Text and icon color in the header, to keep it readable on a custom background',
    headerHoverColor:    'Header Hover Color',
    headerHoverColorDesc:'Highlight color of header text and icons on mouse hover',
    tabbyDefault:        'Tabby default',
    headerPreview:       'Header Preview',
    headerPreviewDesc:
      'Hover over it to check the hover color. The actual header is shown on hover or when the toolbar is pinned',

    resetToDefaults:     'Reset to Defaults',
    resetToDefaultsDesc: 'Restore all options to defaults (applied when you click Save)',

    save:                'Save',
    cancel:              'Cancel',
    discard:             "Don't Save",
    unsavedChanges:      'Unsaved changes',
    leaveConfirmMessage: 'You have unsaved changes in Highlight Pane settings.',
    leaveConfirmDetail:  'Do you want to save your changes? Otherwise the last saved settings will be restored.',
  },
}

