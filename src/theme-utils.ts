import { DEFAULT_CONFIG } from './config'

/**
 * 현재 Tabby 테마에 맞는 터미널 색상표에서 지정 인덱스의 색상을 반환합니다.
 *
 * 판별 우선순위:
 *  1. appearance.colorSchemeMode (Tabby 신버전)
 *     - 'light'  → terminal.lightColorScheme 사용
 *     - 'dark'   → terminal.colorScheme 사용
 *     - 'auto' / 없음 → 아래 2번으로 fallback
 *  2. ThemesService.findCurrentTheme().name (currentThemeName 인자로 전달)
 *     - 'Paper'  → terminal.lightColorScheme 사용  (Tabby 기본 라이트 테마)
 *     - 그 외    → terminal.colorScheme 사용
 *
 * @param store            configService.store 전체 객체
 * @param currentThemeName ThemesService.findCurrentTheme()?.name ?? ''
 * @param colorIndex       사용할 색상 인덱스 (0-15)
 */
export function getActiveThemeColor (
  store: any,
  currentThemeName: string,
  colorIndex: number,
): string {
  const colorSchemeMode: string | undefined = store?.appearance?.colorSchemeMode

  let isLight: boolean
  if (colorSchemeMode === 'light') {
    isLight = true
  } else if (colorSchemeMode === 'dark') {
    isLight = false
  } else {
    // colorSchemeMode 없음 또는 'auto' → ThemesService 현재 테마로 판별
    isLight = currentThemeName === 'Paper'
  }

  const scheme = isLight
    ? (store?.terminal?.lightColorScheme ?? store?.terminal?.colorScheme)
    : store?.terminal?.colorScheme

  const idx = Math.max(0, Math.min(15, colorIndex))
  return scheme?.colors?.[idx] ?? DEFAULT_CONFIG.borderColor
}

/**
 * CSS 색상("#rgb" / "#rrggbb" / "rgb(r, g, b)" / "rgba(r, g, b, a)")을 hex + alpha로 변환합니다.
 * @returns 변환 실패 시 null
 */
export function parseCssColor (value: string | null | undefined): { hex: string, alpha: number } | null {
  const hexMatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((value ?? '').trim())
  if (hexMatch) {
    const h = hexMatch[1].length === 3 ? hexMatch[1].replace(/./g, c => c + c) : hexMatch[1]
    return { hex: '#' + h.toUpperCase(), alpha: 1 }
  }
  const m = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)(?:[\s,/]+([\d.]+))?\s*\)$/i.exec((value ?? '').trim())
  if (!m) return null
  const hex = '#' + [m[1], m[2], m[3]]
    .map(v => ('0' + Math.max(0, Math.min(255, +v)).toString(16)).slice(-2))
    .join('')
  return { hex: hex.toUpperCase(), alpha: m[4] !== undefined ? +m[4] : 1 }
}

/**
 * 현재 Tabby 테마가 헤더(툴바)에 사용하는 기본 색상을 읽습니다.
 *   배경        : --bs-body-bg         (tab-body terminal-toolbar { background: var(--bs-body-bg) })
 *   글자·아이콘 : --bs-link-color      (헤더 버튼 .btn-link)
 *   마우스오버  : --bs-link-hover-color
 * 플러그인이 덮어쓰지 않는 테마 변수를 읽으므로 미리보기·전환 효과의 영향을 받지 않습니다.
 * 읽지 못한 항목은 null을 반환합니다.
 */
export function readTabbyHeaderColors (): { bg: string | null, fg: string | null, hover: string | null } {
  const style = getComputedStyle(document.querySelector('terminal-toolbar') ?? document.body)
  const read = (name: string) => parseCssColor(style.getPropertyValue(name))?.hex ?? null
  return {
    bg: read('--bs-body-bg'),
    fg: read('--bs-link-color'),
    hover: read('--bs-link-hover-color'),
  }
}
