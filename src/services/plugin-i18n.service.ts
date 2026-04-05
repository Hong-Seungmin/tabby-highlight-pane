import { Injectable, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ConfigService } from 'tabby-core'
import { Subscription } from 'rxjs'

import enUS from '../i18n/en-US'
import ko   from '../i18n/ko'

/**
 * Highlight Pane 플러그인 전용 i18n 초기화 서비스
 *
 * 언어 감지 전략:
 *  1순위: ConfigService.store.language
 *         — Tabby가 설정 YAML에 직접 저장하는 UI 언어 (예: 'ko-KR', 'en-US')
 *         — 가장 신뢰할 수 있는 소스. Tabby 설정에서 언어를 바꾸면 즉시 반영됨.
 *
 *  2순위: Intl.DateTimeFormat().resolvedOptions().locale
 *         — Tabby 언어 설정이 비어 있을 때의 폴백 (최초 실행 등)
 *
 *  ko / ko-KR / ko-* / ko_* → 'ko'  |  그 외 → 'en-US' (fallback)
 *
 * Tabby 설정 변경 시 (configService.changed$) 자동 재적용됩니다.
 */
@Injectable({ providedIn: 'root' })
export class PluginI18nService implements OnDestroy {
  private initialized = false
  private sub: Subscription | null = null

  constructor (
    private translate: TranslateService,
    private configService: ConfigService,
  ) {}

  init (): void {
    if (this.initialized) return
    this.initialized = true

    // 1. 번역 리소스 등록 (merge 모드)
    this.translate.setTranslation('en-US', enUS, true)
    this.translate.setTranslation('ko',    ko,    true)

    // 2. fallback 언어
    this.translate.setDefaultLang('en-US')

    // 3. 현재 언어 적용
    this.applyLanguage()

    // 4. Tabby 설정 변경 시 재적용 (언어 변경 포함)
    this.sub = this.configService.changed$.subscribe(() => this.applyLanguage())
  }

  ngOnDestroy (): void {
    this.sub?.unsubscribe()
  }

  // ────────────────────────────────────────────────────────────────────────────

  private applyLanguage (): void {
    this.translate.use(this.resolveLocale())
  }

  private resolveLocale (): 'ko' | 'en-US' {
    // 1순위: Tabby 설정에 저장된 UI 언어
    const tabbyLang: string = this.configService.store?.language ?? ''
    if (tabbyLang) {
      return this.normalizeLang(tabbyLang)
    }

    // 2순위: Intl API (Tabby 언어 설정이 비어 있을 때 폴백)
    try {
      const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale
      if (intlLocale) return this.normalizeLang(intlLocale)
    } catch { /* ignore */ }

    return 'en-US'
  }

  private normalizeLang (lang: string): 'ko' | 'en-US' {
    const lower = (lang || '').toLowerCase().trim()
    return (lower === 'ko' || lower.startsWith('ko-') || lower.startsWith('ko_'))
      ? 'ko'
      : 'en-US'
  }
}
