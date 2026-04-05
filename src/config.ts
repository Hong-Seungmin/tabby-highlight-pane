/**
 * 설정 항목 인터페이스
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

  // 툴바 (8개) — 활성구역과 동일한 항목 추가
  toolbarBrightness: number
  toolbarBorderColor: string
  toolbarBorderWidth: number
  toolbarInnerGlowSize: number   // 활성구역 innerGlowSize에 대응
  toolbarInnerGlowAlpha: number  // 활성구역 innerGlowAlpha에 대응
  toolbarOuterGlowSize: number   // 활성구역 outerGlowSize에 대응
  toolbarOuterGlowAlpha: number  // 활성구역 outerGlowAlpha에 대응
  highlightToolbar: boolean

  // 동기화 — 활성구역 ↔ 툴바 공통 설정 링크
  syncActiveToolbar: boolean

  // 색상 모드 — true: 테마 색상표 N번을 자동으로 사용 (다크/라이트 분기)
  //              false: borderColor / toolbarBorderColor 를 직접 지정
  dynamicBorderColor: boolean
  themeColorIndex: number    // 자동 적용 시 사용할 색상 번호 (1-15, 기본값 4)

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
  toolbarInnerGlowSize: 10,   // 활성구역과 동일 기본값 (syncActiveToolbar=true 기본)
  toolbarInnerGlowAlpha: 0.2,
  toolbarOuterGlowSize: 15,
  toolbarOuterGlowAlpha: 0.3,
  highlightToolbar: true,

  // 동기화 — 기본값 ON (활성구역 색상 기본값과 툴바 색상 기본값이 동일)
  syncActiveToolbar: true,

  // 색상 모드 — 기본값 ON: 테마 색상표 4번 색을 자동 적용
  dynamicBorderColor: true,
  themeColorIndex: 4,      // 기본값: 4번 (ANSI blue 계열)

  // 레이아웃
  paneMargin: 3,
  paneRadius: 6,
}

