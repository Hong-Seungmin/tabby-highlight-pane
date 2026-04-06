import { HighlightConfig } from './config'

/**
 * hex 색상 문자열을 RGB 숫자 배열로 변환합니다.
 * @param hex - "#85A4AE" 형태의 hex 문자열
 * @returns [R, G, B] 숫자 배열 (변환 실패 시 기본색 #85A4AE → [133, 164, 174])
 */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [133, 164, 174]
}

/**
 * 사용자 참고 CSS 기반으로 생성합니다.
 * - border-radius, overflow: hidden → 시각적 pane 구분을 명확하게 함
 * - split-tab margin → pane 간 여백 제공
 * - 모든 툴바 기본 스타일 + 활성 툴바 강조
 */
export function generateCSS(config: HighlightConfig): string {
  if (!config.enabled) return ''

  const [r, g, b] = hexToRgb(config.borderColor)
  const [tr, tg, tb] = hexToRgb(config.toolbarBorderColor)
  const innerGlow = `rgba(${r}, ${g}, ${b}, ${config.innerGlowAlpha})`
  const outerGlow = `rgba(${r}, ${g}, ${b}, ${config.outerGlowAlpha})`
  const toolbarBase = `rgba(${tr}, ${tg}, ${tb}, 0.1)`
  const bw = config.toolbarBorderWidth
  const toolbarInnerGlow = `rgba(${tr}, ${tg}, ${tb}, ${config.toolbarInnerGlowAlpha})`
  const toolbarOuterGlow = `rgba(${tr}, ${tg}, ${tb}, ${config.toolbarOuterGlowAlpha})`

  // transition: all 대신 실제로 변하는 속성만 명시하여 드래그/애니메이션 충돌 방지
  const t = config.transition
  const ti = config.inactiveTransition
  const paneTr     = `opacity ${t}ms ease-in-out, box-shadow ${t}ms ease-in-out, filter ${t}ms ease-in-out`
  const inactiveTr = `opacity ${ti}ms ease-in-out`
  const toolbarTr  = `filter ${t}ms ease-in-out, box-shadow ${t}ms ease-in-out`

  // 분할 여부는 CSS :has(> .child:nth-child(2)) 선택자로 판정합니다.
  // JS MutationObserver / hp-split 클래스 주입이 불필요합니다.
  const split = `split-tab:has(> .child:nth-child(2))`

  return `
/* [highlight-pane] split-tab 여백 */
split-tab {
  margin: 0 ${config.paneMargin}px ${config.paneMargin}px ${config.paneMargin}px !important;
}

/* [highlight-pane] 기본 pane 스타일: 전환효과 + 둥근 모서리 */
split-tab > .child {
  transition: ${paneTr};
  border-radius: ${config.paneRadius}px !important;
  overflow: hidden !important;
}

/* [highlight-pane] 비활성 pane 흐리게 (분할 시에만) */
${split} > .child:not(.focused) {
  opacity: ${config.inactiveOpacity} !important;
  transition: ${inactiveTr};
}

/* [highlight-pane] 활성 pane 하이라이트 (분할 시에만) */
${split} > .child.focused {
  box-shadow:
    inset 0 0 0 ${config.borderWidth}px ${config.borderColor},
    inset 0 0 ${config.innerGlowSize}px ${innerGlow},
    0 0 ${config.outerGlowSize}px ${outerGlow} !important;
  opacity: ${config.opacity} !important;
  transition: ${paneTr};
}

/* [highlight-pane] split-tab 내 모든 툴바 기본 스타일 */
split-tab terminal-toolbar {
  transition: ${toolbarTr};
  box-shadow: inset 0 -1px 0 ${toolbarBase} !important;
  border-radius: ${config.paneRadius}px ${config.paneRadius}px 0 0 !important;
}

/* [highlight-pane] 활성 pane 툴바 강조 (분할 시에만) */
${split} > .child.focused terminal-toolbar {
  filter: brightness(${config.toolbarBrightness}) !important;
  box-shadow:
    inset 0 ${bw}px 0 0 rgba(${tr}, ${tg}, ${tb}, 1),
    inset ${bw}px 0 0 0 rgba(${tr}, ${tg}, ${tb}, 1),
    inset -${bw}px 0 0 0 rgba(${tr}, ${tg}, ${tb}, 1),
    inset 0 0 ${config.toolbarInnerGlowSize}px ${toolbarInnerGlow},
    0 0 ${config.toolbarOuterGlowSize}px ${toolbarOuterGlow} !important;
  transition: ${toolbarTr};
}
`.trim()
}

