import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'
import {TranslateModule} from '@ngx-translate/core'
import {ConfigProvider, ConfigService, ThemesService} from 'tabby-core'
import {SettingsTabProvider} from 'tabby-settings'
import {DEFAULT_CONFIG} from './config'
import {generateCSS} from './style-generator'
import {HighlightPaneSettingsComponent} from './components/highlight-pane-settings.component'
import {HighlightPaneSettingsTabProvider} from "./highlightPaneSettingsTabProvider";
import {getActiveThemeColor} from "./theme-utils";
import {PluginI18nService} from "./services/plugin-i18n.service";

/** Tabby 설정 시스템에 기본값을 등록합니다 */
export class HighlightPaneConfigProvider extends ConfigProvider {
  defaults = {
    highlightPane: { ...DEFAULT_CONFIG },
  }
  platformDefaults = {}
}

/**
 * HighlightPaneModule
 *
 * CSS-first 구조:
 *   - JS는 설정값·테마 색상을 CSS로 변환해 style 요소에 1회 주입하는 역할만 수행
 *   - 분할 여부 판정은 CSS :has(> .child:nth-child(2)) 선택자가 담당
 *   - focus 상태는 DOM의 .focused 클래스를 CSS가 직접 처리
 *   - 설정/테마 변경 시에만 CSS 재생성 (focus 변경 시 재생성 없음)
 *
 * 공식 규칙: default export NgModule + package.json "tabby-plugin" 키워드
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule.forRoot(),   // 플러그인 전용 독립 TranslateService (tabby-core 1.x에 TranslateService 미포함)
  ],
  declarations: [
    HighlightPaneSettingsComponent,
  ],
  providers: [
    { provide: ConfigProvider, useClass: HighlightPaneConfigProvider, multi: true },
    { provide: SettingsTabProvider, useClass: HighlightPaneSettingsTabProvider, multi: true },
  ],
})
export default class HighlightPaneModule {
  constructor (
    private configService: ConfigService,
    private themesService: ThemesService,
    private pluginI18n: PluginI18nService,    // 번역 리소스 등록 및 언어 활성화
  ) {
    this.pluginI18n.init()
    this.initCSS()
  }

  private initCSS (): void {
    const applyCSS = () => {
      const userConfig = this.configService.store?.highlightPane ?? {}
      const colorIndex = userConfig.themeColorIndex ?? DEFAULT_CONFIG.themeColorIndex
      // ThemesService.findCurrentTheme()으로 현재 실제 테마 이름을 읽어 다크/라이트 판별
      const currentThemeName = this.themesService.findCurrentTheme()?.name ?? ''
      const themeColor = getActiveThemeColor(this.configService.store, currentThemeName, colorIndex)
      const isDynamic = userConfig.dynamicBorderColor !== false
      const config = Object.assign(
        {},
        DEFAULT_CONFIG,
        { borderColor: themeColor, toolbarBorderColor: themeColor },
        userConfig,
        // 동적 모드: 저장된 borderColor가 있어도 현재 테마 색상으로 덮어씀
        isDynamic ? { borderColor: themeColor, toolbarBorderColor: themeColor } : {},
      )

      let el = document.getElementById('highlight-pane-css') as HTMLStyleElement | null
      if (!el) {
        el = document.createElement('style')
        el.id = 'highlight-pane-css'
        document.head.appendChild(el)
      }
      el.textContent = generateCSS(config)
    }

    // 즉시 적용 (기본값 사용)
    applyCSS()

    // 설정 파일 로드 완료 후 재적용
    this.configService.ready$.subscribe(() => applyCSS())

    // 설정(colorScheme, colorSchemeMode 등) 변경 시 재적용
    this.configService.changed$.subscribe(() => applyCSS())

    // Tabby 테마(Standard ↔ Paper 등) 전환 시 즉시 재적용
    // ThemesService.themeChanged$는 테마가 실제로 바뀔 때마다 발생
    this.themesService.themeChanged$.subscribe(() => applyCSS())
  }
}
