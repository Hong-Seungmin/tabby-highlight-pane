import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FormsModule} from '@angular/forms'
import {TranslateModule} from '@ngx-translate/core'
import {ConfigProvider} from 'tabby-core'
import {SettingsTabProvider} from 'tabby-settings'
import {DEFAULT_CONFIG} from './config'
import {HighlightPaneSettingsComponent} from './components/highlight-pane-settings.component'
import {HighlightPaneSettingsTabProvider} from "./highlightPaneSettingsTabProvider";
import {PluginI18nService} from "./services/plugin-i18n.service";
import {HighlightStyleService} from "./services/highlight-style.service";

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
 *   - 설정 화면 편집 중에는 HighlightStyleService 미리보기로 저장 없이 반영
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
    private pluginI18n: PluginI18nService,    // 번역 리소스 등록 및 언어 활성화
    private highlightStyle: HighlightStyleService,  // 설정/테마 → CSS 주입
  ) {
    this.pluginI18n.init()
    this.highlightStyle.init()
  }
}
