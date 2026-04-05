/**
 * 18개 설정 항목 인터페이스
 */
export interface HighlightConfig {
  // 활성 Pane (10개)
  enabled: boolean
  borderColor: string
  borderWidth: number
  borderStyle: string
  innerGlowSize: number
  innerGlowAlpha: number
  outerGlowSize: number
  outerGlowAlpha: number
  opacity: number
  transition: number

  // 비활성 Pane (2개)
  inactiveOpacity: number
  inactiveTransition: number

  // 툴바 (4개)
  toolbarBrightness: number
  toolbarBorderColor: string
  toolbarBorderWidth: number
  highlightToolbar: boolean

  // 레이아웃 (2개)
  paneMargin: number   // split-tab 주변 여백 (px)
  paneRadius: number   // pane 모서리 둥글기 (px)
}

/**
 * 기본값 — 미설정 시 이 값이 사용됩니다.
 */
export const DEFAULT_CONFIG: HighlightConfig = {
  // 활성 Pane
  enabled: true,
  borderColor: '#85A4AE',
  borderWidth: 1,
  borderStyle: 'solid',
  innerGlowSize: 10,
  innerGlowAlpha: 0.2,
  outerGlowSize: 15,
  outerGlowAlpha: 0.3,
  opacity: 1.0,
  transition: 200,

  // 비활성 Pane
  inactiveOpacity: 0.9,
  inactiveTransition: 200,

  // 툴바
  toolbarBrightness: 1.3,
  toolbarBorderColor: '#85A4AE',
  toolbarBorderWidth: 1,
  highlightToolbar: true,

  // 레이아웃
  paneMargin: 3,
  paneRadius: 6,
}
