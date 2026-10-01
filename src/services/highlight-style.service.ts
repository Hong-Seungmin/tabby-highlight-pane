import { Injectable } from '@angular/core'
import { ConfigService, ThemesService } from 'tabby-core'
import { DEFAULT_CONFIG, HighlightConfig } from '../config'
import { generateCSS } from '../style-generator'
import { getActiveThemeColor } from '../theme-utils'

const STYLE_ELEMENT_ID = 'highlight-pane-css'

/**
 * 설정값·테마 색상을 CSS로 변환해 style 요소에 주입하는 서비스
 *
 * 미리보기(preview):
 *   - 설정 화면에서 편집 중인 값은 setPreview()로 전달되어 저장 없이 화면에만 반영됨
 *   - preview가 있는 동안에는 config 변경·테마 전환 시에도 preview 값 기준으로 재생성
 *   - clearPreview() 호출 시 저장된 값(store) 기준으로 복원
 */
@Injectable({ providedIn: 'root' })
export class HighlightStyleService {
  private initialized = false
  private preview: Partial<HighlightConfig> | null = null

  constructor (
    private configService: ConfigService,
    private themesService: ThemesService,
  ) {}

  init (): void {
    if (this.initialized) return
    this.initialized = true

    // 즉시 적용 (기본값 사용)
    this.refresh()

    // 설정 파일 로드 완료 후 재적용
    this.configService.ready$.subscribe(() => this.refresh())

    // 설정(colorScheme, colorSchemeMode 등) 변경 시 재적용
    this.configService.changed$.subscribe(() => this.refresh())

    // Tabby 테마(Standard ↔ Paper 등) 전환 시 즉시 재적용
    this.themesService.themeChanged$.subscribe(() => this.refresh())
  }

  /** 편집 중인 설정을 저장하지 않고 화면에만 반영합니다 */
  setPreview (config: Partial<HighlightConfig>): void {
    this.preview = { ...config }
    this.refresh()
  }

  /** 미리보기를 해제하고 저장된 설정으로 되돌립니다 */
  clearPreview (): void {
    this.preview = null
    this.refresh()
  }

  /** 현재 테마의 터미널 색상표에서 지정 번호의 색상을 반환합니다 */
  getThemeColor (colorIndex: number): string {
    const currentThemeName = this.themesService.findCurrentTheme()?.name ?? ''
    return getActiveThemeColor(this.configService.store, currentThemeName, colorIndex)
  }

  refresh (): void {
    const userConfig = this.preview ?? this.configService.store?.highlightPane ?? {}
    const themeColor = this.getThemeColor(userConfig.themeColorIndex ?? DEFAULT_CONFIG.themeColorIndex)
    const isDynamic = userConfig.dynamicBorderColor !== false
    const config = Object.assign(
      {},
      DEFAULT_CONFIG,
      { borderColor: themeColor, toolbarBorderColor: themeColor },
      userConfig,
      // 동적 모드: 저장된 borderColor가 있어도 현재 테마 색상으로 덮어씀
      isDynamic ? { borderColor: themeColor, toolbarBorderColor: themeColor } : {},
    )

    let el = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = STYLE_ELEMENT_ID
      document.head.appendChild(el)
    }
    el.textContent = generateCSS(config)
  }
}
