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
  const t     = config.transition
  const ti    = config.inactiveTransition
  const tt    = config.toolbarTransition   // 툴바 전용 전환 속도 (활성구역과 독립 조절 가능)
  const paneTr     = `opacity ${t}ms ease-in-out, box-shadow ${t}ms ease-in-out, filter ${t}ms ease-in-out`
  // 포커스 이탈 시: opacity와 box-shadow 모두 비활성 전환 속도(ti) 사용
  const inactiveTr = `opacity ${ti}ms ease-in-out, box-shadow ${ti}ms ease-in-out`
  // 툴바 컨테이너: 테두리(box-shadow)만 전환 — filter는 자식 요소에서 별도 처리
  const toolbarTr     = `box-shadow ${tt}ms ease-in-out`
  // 툴바 자식(텍스트·아이콘): 밝기(filter)만 전환 — 테두리와 독립
  const toolbarChildTr = `filter ${tt}ms ease-in-out`

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
  transition: ${paneTr} !important;
  border-radius: ${config.paneRadius}px !important;
  overflow: hidden !important;
}

/* [highlight-pane] 비활성 pane 흐리게 (분할 시에만) */
${split} > .child:not(.focused) {
  opacity: ${config.inactiveOpacity} !important;
  transition: ${inactiveTr} !important;
}

/* [highlight-pane] 활성 pane 하이라이트 (분할 시에만) */
${split} > .child.focused {
  box-shadow:
    inset 0 0 0 ${config.borderWidth}px ${config.borderColor},
    inset 0 0 ${config.innerGlowSize}px ${innerGlow},
    0 0 ${config.outerGlowSize}px ${outerGlow} !important;
  opacity: ${config.opacity} !important;
  transition: ${paneTr} !important;
}

/* [highlight-pane] split-tab 내 모든 툴바 기본 스타일 */
split-tab terminal-toolbar {
  transition: ${toolbarTr} !important;
  box-shadow: inset 0 -1px 0 ${toolbarBase} !important;
  border-radius: ${config.paneRadius}px ${config.paneRadius}px 0 0 !important;
}

/* [highlight-pane] 툴바 내용(텍스트·아이콘) 밝기 전환 기반 설정 */
split-tab terminal-toolbar > * {
  transition: ${toolbarChildTr} !important;
}

/* [highlight-pane] 활성 pane 툴바 테두리·글로우 (분할 시에만) */
${split} > .child.focused terminal-toolbar {
  box-shadow:
    inset 0 ${bw}px 0 0 rgba(${tr}, ${tg}, ${tb}, 1),
    inset ${bw}px 0 0 0 rgba(${tr}, ${tg}, ${tb}, 1),
    inset -${bw}px 0 0 0 rgba(${tr}, ${tg}, ${tb}, 1),
    inset 0 0 ${config.toolbarInnerGlowSize}px ${toolbarInnerGlow},
    0 0 ${config.toolbarOuterGlowSize}px ${toolbarOuterGlow} !important;
}

/* [highlight-pane] 비활성 pane 툴바 이탈 전환 — 비활성 전환 속도(ti) 사용 */
${split} > .child:not(.focused) terminal-toolbar {
  transition: box-shadow ${ti}ms ease-in-out !important;
}

/* [highlight-pane] 비활성 pane 툴바 내용 이탈 전환 — 비활성 전환 속도(ti) 사용 */
${split} > .child:not(.focused) terminal-toolbar > * {
  transition: filter ${ti}ms ease-in-out !important;
}

/* [highlight-pane] 활성 pane 툴바 내용 밝기 강조 — 테두리와 독립 (분할 시에만) */
${split} > .child.focused terminal-toolbar > * {
  filter: brightness(${config.toolbarBrightness}) !important;
}
`.trim()
}

