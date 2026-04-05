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
