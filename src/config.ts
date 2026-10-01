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

  // 툴바 (9개) — 활성구역과 동일한 항목 추가
  toolbarBrightness: number
  toolbarBorderColor: string
  toolbarBorderWidth: number
  toolbarInnerGlowSize: number   // 활성구역 innerGlowSize에 대응
  toolbarInnerGlowAlpha: number  // 활성구역 innerGlowAlpha에 대응
  toolbarOuterGlowSize: number   // 활성구역 outerGlowSize에 대응
  toolbarOuterGlowAlpha: number  // 활성구역 outerGlowAlpha에 대응
  toolbarTransition: number      // 활성구역 transition에 대응
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

  // 활성 헤더 (9개) — 포커스된 pane의 툴바(헤더) 배경·글자 색상
  // 활성 구역과 동일한 구조: 테마 색상 적용(ON/OFF + 색상 번호) / 직접 지정 색상
  //   ThemeIndex 0 = Tabby 기본 (테마가 칠한 툴바 색상을 그대로 사용, CSS 덮어쓰기 없음)
  //   ThemeIndex 1-15 = 터미널 색상표 N번 (다크/라이트 분기)
  headerSinglePane: boolean     // 분할하지 않은 탭의 헤더에도 적용
  headerBgTheme: boolean        // 배경색: 테마 색상 적용
  headerBgThemeIndex: number    // 배경색: 테마 색상 번호 (0 = Tabby 기본, 1-15)
  headerBgColor: string         // 배경색 직접 지정 (hex)
  headerBgAlpha: number         // 배경 불투명도 (0-1)
  headerFgTheme: boolean        // 글자·아이콘 색상: 테마 색상 적용
  headerFgThemeIndex: number    // 글자·아이콘 색상: 테마 색상 번호 (0 = Tabby 기본, 1-15)
  headerFgColor: string         // 글자·아이콘 색상 직접 지정 (hex)
  headerHoverColor: string      // 마우스오버 색상 (글자·아이콘 테마 색상 적용 OFF일 때)
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
  toolbarTransition: 200,     // 활성구역과 동일 기본값 (syncActiveToolbar=true 기본)
  highlightToolbar: true,

  // 동기화 — 기본값 ON (활성구역 색상 기본값과 툴바 색상 기본값이 동일)
  syncActiveToolbar: true,

  // 색상 모드 — 기본값 ON: 테마 색상표 4번 색을 자동 적용
  dynamicBorderColor: true,
  themeColorIndex: 4,      // 기본값: 4번 (ANSI blue 계열)

  // 레이아웃
  paneMargin: 3,
  paneRadius: 6,

  // 활성 헤더 — 기본값은 Tabby 기본 툴바 스타일을 그대로 사용 (테마 색상 적용 ON + 0번)
  //   Tabby 테마: tab-body terminal-toolbar { background: var(--bs-body-bg) }
  //   헤더 버튼(.btn-link): 글자 var(--bs-link-color), 마우스오버 var(--bs-link-hover-color)
  //   Color 값은 테마 색상 적용을 끌 때 렌더링된 색상을 읽지 못한 경우의 초기값
  headerSinglePane: true,
  headerBgTheme: true,
  headerBgThemeIndex: 0,
  headerBgColor: '#000000',
  headerBgAlpha: 1,
  headerFgTheme: true,
  headerFgThemeIndex: 0,
  headerFgColor: '#ffffff',
  headerHoverColor: '#ffffff',
}

