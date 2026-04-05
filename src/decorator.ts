import { Injectable } from '@angular/core'
import { Subscription } from 'rxjs'
import { ConfigService, ThemesService } from 'tabby-core'
import { TerminalDecorator, BaseTerminalTabComponent } from 'tabby-terminal'
import { DEFAULT_CONFIG } from './config'
import { generateCSS } from './style-generator'
import { FocusMonitor } from './focus-monitor'
import { getActiveThemeColor } from './theme-utils'

/**
 * HighlightPaneDecorator: 탭 열림/닫힘 시 CSS 업데이트를 담당합니다.
 * CSS 초기 주입은 NgModule 생성자에서 처리합니다.
 */
@Injectable()
export class HighlightPaneDecorator extends TerminalDecorator {
  private attachCount = 0
  private focusSubscription: Subscription | null = null

  constructor (
    private configService: ConfigService,
    private focusMonitor: FocusMonitor,
    private themesService: ThemesService,
  ) {
    super()
  }

  attach (tab: BaseTerminalTabComponent<any>): void {
    this.attachCount++

    if (this.attachCount === 1) {
      // CSS 재적용 (탭이 열릴 때 혹시 style 요소가 없으면 재생성)
      this.ensureCSS()
      this.focusMonitor.startMonitoring()

      this.focusSubscription = this.focusMonitor.onFocusChange().subscribe(() => {
        this.ensureCSS()
      })
    }
  }

  detach (tab: BaseTerminalTabComponent<any>): void {
    this.attachCount = Math.max(0, this.attachCount - 1)

    if (this.attachCount === 0) {
      this.focusMonitor.stopMonitoring()
      if (this.focusSubscription) {
        this.focusSubscription.unsubscribe()
        this.focusSubscription = null
      }
    }
  }

  private ensureCSS (): void {
    let el = document.getElementById('highlight-pane-css') as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = 'highlight-pane-css'
      document.head.appendChild(el)
    }
    const userConfig = this.configService.store?.highlightPane ?? {}
    const colorIndex = userConfig.themeColorIndex ?? DEFAULT_CONFIG.themeColorIndex
    const currentThemeName = this.themesService.findCurrentTheme()?.name ?? ''
    const themeColor = getActiveThemeColor(this.configService.store, currentThemeName, colorIndex)
    const isDynamic = userConfig.dynamicBorderColor !== false
    const config = Object.assign(
      {},
      DEFAULT_CONFIG,
      { borderColor: themeColor, toolbarBorderColor: themeColor },
      userConfig,
      isDynamic ? { borderColor: themeColor, toolbarBorderColor: themeColor } : {},
    )
    el.textContent = generateCSS(config)
  }
}
