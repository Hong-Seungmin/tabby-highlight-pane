import { Component, OnInit } from '@angular/core'
import { ConfigService, ThemesService } from 'tabby-core'
import { DEFAULT_CONFIG, HighlightConfig } from '../config'
import { getActiveThemeColor } from '../theme-utils'

/**
 * Highlight Pane 설정 화면 컴포넌트
 * Tabby 설정 → "Highlight Pane" 메뉴에서 접근합니다.
 *
 * 다국어 지원: @ngx-translate/core TranslateService 기반
 *  - PluginI18nService.init() 에서 번역 등록 및 언어 활성화
 *  - 템플릿에서 | translate 파이프 사용
 */
@Component({
  selector: 'highlight-pane-settings',
  template: `
    <div class="container-fluid" style="padding-bottom: 2rem">
      <h3>
        <i class="fas fa-highlighter me-2" style="color:#85A4AE"></i>
        Highlight Pane
      </h3>

      <!-- Enable toggle -->
      <div class="form-line">
        <div class="header">
          <div class="title">{{ 'highlightPane.enable' | translate }}</div>
          <div class="description">{{ 'highlightPane.enableDesc' | translate }}</div>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="hp-enabled"
            [(ngModel)]="config.enabled" (ngModelChange)="save()">
          <label class="form-check-label" for="hp-enabled"></label>
        </div>
      </div>

      <ng-container *ngIf="config.enabled">

        <!-- ────── Layout ────── -->
        <h4 class="mt-4 mb-3" style="color:#85A4AE; font-size:1rem; text-transform:uppercase; letter-spacing:.05em">
          {{ 'highlightPane.layout' | translate }}
        </h4>

        <div class="form-line">
          <div class="header">
            <div class="title">{{ 'highlightPane.paneMargin' | translate }}</div>
            <div class="description">{{ 'highlightPane.paneMarginDesc' | translate }}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="10" step="1"
              style="width:120px"
              [(ngModel)]="config.paneMargin" (ngModelChange)="save()">
            <span class="text-muted">{{ config.paneMargin }}px</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header">
            <div class="title">{{ 'highlightPane.paneRadius' | translate }}</div>
            <div class="description">{{ 'highlightPane.paneRadiusDesc' | translate }}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="20" step="1"
              style="width:120px"
              [(ngModel)]="config.paneRadius" (ngModelChange)="save()">
            <span class="text-muted">{{ config.paneRadius }}px</span>
          </div>
        </div>

        <!-- ────── Active Pane ────── -->
        <h4 class="mt-4 mb-3" style="color:#85A4AE; font-size:1rem; text-transform:uppercase; letter-spacing:.05em">
          {{ 'highlightPane.activePane' | translate }}
        </h4>

        <!-- Auto Theme Color -->
        <div class="form-line">
          <div class="header">
            <div class="title">{{ 'highlightPane.autoThemeColor' | translate }}</div>
            <div class="description">{{ 'highlightPane.autoThemeColorDesc' | translate }}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <!-- ON/OFF toggle -->
            <div class="form-check form-switch mb-0">
              <input class="form-check-input" type="checkbox" id="hp-dynamic-color"
                [(ngModel)]="config.dynamicBorderColor" (ngModelChange)="onDynamicColorChange($event)">
              <label class="form-check-label" for="hp-dynamic-color"></label>
            </div>
            <!-- Color index (visible only when dynamic mode is ON) -->
            <ng-container *ngIf="config.dynamicBorderColor">
              <span class="text-muted" style="font-size:0.85rem">{{ 'highlightPane.colorLabel' | translate }}</span>
              <input type="number" class="form-control form-control-sm"
                style="width:58px; text-align:center; padding:2px 6px"
                min="1" max="15" step="1"
                [(ngModel)]="config.themeColorIndex"
                (ngModelChange)="onThemeColorIndexChange($event)">
              <!-- colorIndex: '번'(ko) or ''(en) — only renders when non-empty -->
              <span *ngIf="('highlightPane.colorIndex' | translate)" class="text-muted" style="font-size:0.85rem">
                {{ 'highlightPane.colorIndex' | translate }}
              </span>
              <!-- Theme color preview -->
              <div [style.background]="getThemeColor()"
                style="width:22px; height:22px; border-radius:4px; border:1px solid rgba(128,128,128,0.35); flex-shrink:0"
                [title]="getThemeColor()"></div>
            </ng-container>
          </div>
        </div>

        <!-- Border Color (common — linkable with toolbar) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              {{ 'highlightPane.borderColor' | translate }}
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em"
                [title]="'highlightPane.syncedWithToolbar' | translate"></i>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="color" class="form-control form-control-color"
              style="width:44px; height:32px; padding:2px"
              [style.cursor]="config.dynamicBorderColor ? 'not-allowed' : 'pointer'"
              [style.opacity]="config.dynamicBorderColor ? '0.55' : '1'"
              [style.pointerEvents]="config.dynamicBorderColor ? 'none' : 'auto'"
              [(ngModel)]="config.borderColor"
              (ngModelChange)="onActivePaneCommon('borderColor', 'toolbarBorderColor', $event)">
            <span class="text-muted font-monospace">{{ config.borderColor }}</span>
            <span *ngIf="config.dynamicBorderColor"
              style="font-size:0.72rem; padding:1px 7px; border-radius:10px; background:rgba(133,164,174,0.15); color:#85A4AE">
              {{ 'highlightPane.auto' | translate }}
            </span>
          </div>
        </div>

        <!-- Border Width (common — linkable with toolbar) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              {{ 'highlightPane.borderWidth' | translate }}
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em"
                [title]="'highlightPane.syncedWithToolbar' | translate"></i>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="5" step="1"
              style="width:120px"
              [(ngModel)]="config.borderWidth"
              (ngModelChange)="onActivePaneCommon('borderWidth', 'toolbarBorderWidth', $event)">
            <span class="text-muted">{{ config.borderWidth }}px</span>
          </div>
        </div>

        <!-- Inner Glow Size (common — linkable with toolbar) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              {{ 'highlightPane.innerGlowSize' | translate }}
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em"
                [title]="'highlightPane.syncedWithToolbar' | translate"></i>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="30" step="1"
              style="width:120px"
              [(ngModel)]="config.innerGlowSize"
              (ngModelChange)="onActivePaneCommon('innerGlowSize', 'toolbarInnerGlowSize', $event)">
            <span class="text-muted">{{ config.innerGlowSize }}px</span>
          </div>
        </div>

        <!-- Inner Glow Opacity (common — linkable with toolbar) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              {{ 'highlightPane.innerGlowOpacity' | translate }}
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em"
                [title]="'highlightPane.syncedWithToolbar' | translate"></i>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1" step="0.05"
              style="width:120px"
              [(ngModel)]="config.innerGlowAlpha"
              (ngModelChange)="onActivePaneCommon('innerGlowAlpha', 'toolbarInnerGlowAlpha', $event)">
            <span class="text-muted">{{ config.innerGlowAlpha | number:'1.0-2' }}</span>
          </div>
        </div>

        <!-- Outer Glow Size (common — linkable with toolbar) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              {{ 'highlightPane.outerGlowSize' | translate }}
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em"
                [title]="'highlightPane.syncedWithToolbar' | translate"></i>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="50" step="1"
              style="width:120px"
              [(ngModel)]="config.outerGlowSize"
              (ngModelChange)="onActivePaneCommon('outerGlowSize', 'toolbarOuterGlowSize', $event)">
            <span class="text-muted">{{ config.outerGlowSize }}px</span>
          </div>
        </div>

        <!-- Outer Glow Opacity (common — linkable with toolbar) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              {{ 'highlightPane.outerGlowOpacity' | translate }}
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em"
                [title]="'highlightPane.syncedWithToolbar' | translate"></i>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1" step="0.05"
              style="width:120px"
              [(ngModel)]="config.outerGlowAlpha"
              (ngModelChange)="onActivePaneCommon('outerGlowAlpha', 'toolbarOuterGlowAlpha', $event)">
            <span class="text-muted">{{ config.outerGlowAlpha | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">{{ 'highlightPane.activePaneOpacity' | translate }}</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0.5" max="1" step="0.05"
              style="width:120px"
              [(ngModel)]="config.opacity" (ngModelChange)="save()">
            <span class="text-muted">{{ config.opacity | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">{{ 'highlightPane.transitionSpeed' | translate }}</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1000" step="50"
              style="width:120px"
              [(ngModel)]="config.transition" (ngModelChange)="save()">
            <span class="text-muted">{{ config.transition }}ms</span>
          </div>
        </div>

        <!-- ────── Inactive Pane ────── -->
        <h4 class="mt-4 mb-3" style="color:#85A4AE; font-size:1rem; text-transform:uppercase; letter-spacing:.05em">
          {{ 'highlightPane.inactivePane' | translate }}
        </h4>

        <div class="form-line">
          <div class="header"><div class="title">{{ 'highlightPane.inactivePaneOpacity' | translate }}</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0.1" max="1" step="0.05"
              style="width:120px"
              [(ngModel)]="config.inactiveOpacity" (ngModelChange)="save()">
            <span class="text-muted">{{ config.inactiveOpacity | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">{{ 'highlightPane.inactiveTransition' | translate }}</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1000" step="50"
              style="width:120px"
              [(ngModel)]="config.inactiveTransition" (ngModelChange)="save()">
            <span class="text-muted">{{ config.inactiveTransition }}ms</span>
          </div>
        </div>

        <!-- ────── Sync toggle (Active Pane ↔ Toolbar) ────── -->
        <div class="d-flex align-items-center gap-3 mt-4" style="user-select:none">
          <div style="flex:1; height:1px; background:rgba(133,164,174,0.25)"></div>
          <button class="btn btn-sm px-3 py-1"
            style="border-radius:20px; font-size:0.8rem; transition:all 200ms"
            [style.color]="config.syncActiveToolbar ? '#85A4AE' : '#888'"
            [style.border]="config.syncActiveToolbar ? '1px solid #85A4AE' : '1px solid #555'"
            [style.background]="config.syncActiveToolbar ? 'rgba(133,164,174,0.12)' : 'transparent'"
            (click)="toggleSync()"
            [title]="(config.syncActiveToolbar ? 'highlightPane.syncOnTitle' : 'highlightPane.syncOffTitle') | translate">
            <i class="me-1" [ngClass]="config.syncActiveToolbar ? 'fas fa-link' : 'fas fa-unlink'"></i>
            {{ (config.syncActiveToolbar ? 'highlightPane.syncOnLabel' : 'highlightPane.syncOffLabel') | translate }}
          </button>
          <div style="flex:1; height:1px; background:rgba(133,164,174,0.25)"></div>
        </div>

        <!-- ────── Toolbar ────── -->
        <h4 class="mt-3 mb-3" style="color:#85A4AE; font-size:1rem; text-transform:uppercase; letter-spacing:.05em">
          {{ 'highlightPane.toolbar' | translate }}
        </h4>

        <div class="form-line">
          <div class="header">
            <div class="title">{{ 'highlightPane.toolbarHighlight' | translate }}</div>
            <div class="description">{{ 'highlightPane.toolbarHighlightDesc' | translate }}</div>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="hp-toolbar"
              [(ngModel)]="config.highlightToolbar" (ngModelChange)="save()">
            <label class="form-check-label" for="hp-toolbar"></label>
          </div>
        </div>

        <ng-container *ngIf="config.highlightToolbar">

          <!-- Toolbar Border Color (common — linkable with active pane) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                {{ 'highlightPane.borderColor' | translate }}
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em"
                  [title]="'highlightPane.syncedWithActivePane' | translate"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                {{ 'highlightPane.syncedWithActivePane' | translate }}
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="color" class="form-control form-control-color"
                style="width:44px; height:32px; padding:2px"
                [style.cursor]="config.dynamicBorderColor ? 'not-allowed' : 'pointer'"
                [style.opacity]="config.dynamicBorderColor ? '0.55' : '1'"
                [style.pointerEvents]="config.dynamicBorderColor ? 'none' : 'auto'"
                [(ngModel)]="config.toolbarBorderColor"
                (ngModelChange)="onToolbarCommon('borderColor', 'toolbarBorderColor', $event)">
              <span class="text-muted font-monospace">{{ config.toolbarBorderColor }}</span>
              <span *ngIf="config.dynamicBorderColor"
                style="font-size:0.72rem; padding:1px 7px; border-radius:10px; background:rgba(133,164,174,0.15); color:#85A4AE">
                {{ 'highlightPane.auto' | translate }}
              </span>
            </div>
          </div>

          <!-- Toolbar Border Width (common — linkable with active pane) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                {{ 'highlightPane.borderWidth' | translate }}
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em"
                  [title]="'highlightPane.syncedWithActivePane' | translate"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                {{ 'highlightPane.syncedWithActivePane' | translate }}
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="range" class="form-range" min="0" max="5" step="1"
                style="width:120px"
                [(ngModel)]="config.toolbarBorderWidth"
                (ngModelChange)="onToolbarCommon('borderWidth', 'toolbarBorderWidth', $event)">
              <span class="text-muted">{{ config.toolbarBorderWidth }}px</span>
            </div>
          </div>

          <!-- Toolbar Inner Glow Size (common — linkable with active pane) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                {{ 'highlightPane.innerGlowSize' | translate }}
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em"
                  [title]="'highlightPane.syncedWithActivePane' | translate"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                {{ 'highlightPane.syncedWithActivePane' | translate }}
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="range" class="form-range" min="0" max="30" step="1"
                style="width:120px"
                [(ngModel)]="config.toolbarInnerGlowSize"
                (ngModelChange)="onToolbarCommon('innerGlowSize', 'toolbarInnerGlowSize', $event)">
              <span class="text-muted">{{ config.toolbarInnerGlowSize }}px</span>
            </div>
          </div>

          <!-- Toolbar Inner Glow Opacity (common — linkable with active pane) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                {{ 'highlightPane.innerGlowOpacity' | translate }}
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em"
                  [title]="'highlightPane.syncedWithActivePane' | translate"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                {{ 'highlightPane.syncedWithActivePane' | translate }}
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="range" class="form-range" min="0" max="1" step="0.05"
                style="width:120px"
                [(ngModel)]="config.toolbarInnerGlowAlpha"
                (ngModelChange)="onToolbarCommon('innerGlowAlpha', 'toolbarInnerGlowAlpha', $event)">
              <span class="text-muted">{{ config.toolbarInnerGlowAlpha | number:'1.0-2' }}</span>
            </div>
          </div>

          <!-- Toolbar Outer Glow Size (common — linkable with active pane) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                {{ 'highlightPane.outerGlowSize' | translate }}
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em"
                  [title]="'highlightPane.syncedWithActivePane' | translate"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                {{ 'highlightPane.syncedWithActivePane' | translate }}
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="range" class="form-range" min="0" max="50" step="1"
                style="width:120px"
                [(ngModel)]="config.toolbarOuterGlowSize"
                (ngModelChange)="onToolbarCommon('outerGlowSize', 'toolbarOuterGlowSize', $event)">
              <span class="text-muted">{{ config.toolbarOuterGlowSize }}px</span>
            </div>
          </div>

          <!-- Toolbar Outer Glow Opacity (common — linkable with active pane) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                {{ 'highlightPane.outerGlowOpacity' | translate }}
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em"
                  [title]="'highlightPane.syncedWithActivePane' | translate"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                {{ 'highlightPane.syncedWithActivePane' | translate }}
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="range" class="form-range" min="0" max="1" step="0.05"
                style="width:120px"
                [(ngModel)]="config.toolbarOuterGlowAlpha"
                (ngModelChange)="onToolbarCommon('outerGlowAlpha', 'toolbarOuterGlowAlpha', $event)">
              <span class="text-muted">{{ config.toolbarOuterGlowAlpha | number:'1.0-2' }}</span>
            </div>
          </div>

          <!-- Toolbar Brightness (toolbar only) -->
          <div class="form-line">
            <div class="header">
              <div class="title">{{ 'highlightPane.toolbarBrightness' | translate }}</div>
              <div class="description">{{ 'highlightPane.toolbarBrightnessDesc' | translate }}</div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="range" class="form-range" min="1" max="2" step="0.05"
                style="width:120px"
                [(ngModel)]="config.toolbarBrightness" (ngModelChange)="save()">
              <span class="text-muted">{{ config.toolbarBrightness | number:'1.0-2' }}x</span>
            </div>
          </div>

        </ng-container>

        <!-- Reset button -->
        <div class="mt-4">
          <button class="btn btn-secondary btn-sm" (click)="reset()">
            <i class="fas fa-undo me-1"></i> {{ 'highlightPane.resetToDefaults' | translate }}
          </button>
        </div>

      </ng-container>
    </div>
  `,
})
export class HighlightPaneSettingsComponent implements OnInit {
  config: HighlightConfig = { ...DEFAULT_CONFIG }

  constructor (public configService: ConfigService, private themesService: ThemesService) {}

  ngOnInit (): void {
    this.config = this.loadConfig()
  }

  save (): void {
    if (!this.configService.store.highlightPane) {
      this.configService.store.highlightPane = {}
    }
    Object.assign(this.configService.store.highlightPane, this.config)
    // 동적 색상 모드에서는 borderColor 를 config 에 저장하지 않음
    // → 항상 현재 테마(다크/라이트)의 colorScheme.colors[4] 를 동적으로 읽도록 유지
    if (this.config.dynamicBorderColor) {
      delete this.configService.store.highlightPane.borderColor
      delete this.configService.store.highlightPane.toolbarBorderColor
    }
    this.configService.save()
  }

  reset (): void {
    this.config = { ...DEFAULT_CONFIG }   // themeColorIndex = 4 포함
    const themeColor = this.getThemeColor()  // 현재 테마 색상으로 즉시 적용
    this.config.borderColor = themeColor
    this.config.toolbarBorderColor = themeColor
    this.save()
  }

  /**
   * 테마 색상 자동 적용 토글 핸들러
   * ON 으로 전환 시 현재 테마 색상으로 즉시 UI 갱신
   */
  onDynamicColorChange (dynamic: boolean): void {
    if (dynamic) {
      const themeColor = this.getThemeColor()
      this.config.borderColor = themeColor
      this.config.toolbarBorderColor = themeColor
    }
    this.save()
  }

  /**
   * 테마 색상 번호 변경 핸들러 (1-15 범위 제한)
   */
  onThemeColorIndexChange (value: number): void {
    const clamped = Math.max(1, Math.min(15, Math.round(+value) || DEFAULT_CONFIG.themeColorIndex))
    this.config.themeColorIndex = clamped
    if (this.config.dynamicBorderColor) {
      const themeColor = this.getThemeColor()
      this.config.borderColor = themeColor
      this.config.toolbarBorderColor = themeColor
    }
    this.save()
  }

  /**
   * 활성 구역의 공통 설정 변경 핸들러
   * 동기화 ON 시 해당 툴바 설정도 동일하게 적용
   */
  onActivePaneCommon (activeKey: keyof HighlightConfig, toolbarKey: keyof HighlightConfig, value: any): void {
    if (this.config.syncActiveToolbar) {
      (this.config as any)[toolbarKey] = value
    }
    this.save()
  }

  /**
   * 툴바의 공통 설정 변경 핸들러
   * 동기화 ON 시 해당 활성 구역 설정도 동일하게 적용
   */
  onToolbarCommon (activeKey: keyof HighlightConfig, toolbarKey: keyof HighlightConfig, value: any): void {
    if (this.config.syncActiveToolbar) {
      (this.config as any)[activeKey] = value
    }
    this.save()
  }

  /**
   * 동기화 토글
   * ON으로 전환 시 활성 구역 값을 기준으로 툴바 공통 설정 일괄 동기화
   */
  toggleSync (): void {
    this.config.syncActiveToolbar = !this.config.syncActiveToolbar
    if (this.config.syncActiveToolbar) {
      this.config.toolbarBorderColor   = this.config.borderColor
      this.config.toolbarBorderWidth   = this.config.borderWidth
      this.config.toolbarInnerGlowSize  = this.config.innerGlowSize
      this.config.toolbarInnerGlowAlpha = this.config.innerGlowAlpha
      this.config.toolbarOuterGlowSize  = this.config.outerGlowSize
      this.config.toolbarOuterGlowAlpha = this.config.outerGlowAlpha
    }
    this.save()
  }

  /**
   * 현재 Tabby 테마(다크/라이트)에 맞는 색상표에서 themeColorIndex 번 색상을 반환합니다.
   * ThemesService.findCurrentTheme().name으로 실제 활성 테마를 정확히 판별합니다.
   * 템플릿 색상 미리보기에서도 사용됩니다 (public).
   */
  getThemeColor (): string {
    const idx = this.config?.themeColorIndex ?? DEFAULT_CONFIG.themeColorIndex
    const currentThemeName = this.themesService.findCurrentTheme()?.name ?? ''
    return getActiveThemeColor(this.configService.store, currentThemeName, idx)
  }

  private loadConfig (): HighlightConfig {
    const u = this.configService.store?.highlightPane ?? {}
    // dynamicBorderColor 기본값: true (명시적으로 false 저장 시에만 수동 모드)
    const isDynamic = u.dynamicBorderColor !== false
    const colorIndex = u.themeColorIndex ?? DEFAULT_CONFIG.themeColorIndex
    // ThemesService로 현재 실제 테마 이름 읽기 → 다크/라이트 정확히 판별
    const currentThemeName = this.themesService.findCurrentTheme()?.name ?? ''
    const themeColor = getActiveThemeColor(this.configService.store, currentThemeName, colorIndex)
    return {
      enabled:               u.enabled               ?? DEFAULT_CONFIG.enabled,
      // 동적 모드: 저장된 색상 무시하고 항상 현재 테마 색상 사용
      borderColor:           isDynamic ? themeColor : (u.borderColor        ?? themeColor),
      borderWidth:           u.borderWidth           ?? DEFAULT_CONFIG.borderWidth,
      borderStyle:           u.borderStyle           ?? DEFAULT_CONFIG.borderStyle,
      innerGlowSize:         u.innerGlowSize         ?? DEFAULT_CONFIG.innerGlowSize,
      innerGlowAlpha:        u.innerGlowAlpha        ?? DEFAULT_CONFIG.innerGlowAlpha,
      outerGlowSize:         u.outerGlowSize         ?? DEFAULT_CONFIG.outerGlowSize,
      outerGlowAlpha:        u.outerGlowAlpha        ?? DEFAULT_CONFIG.outerGlowAlpha,
      opacity:               u.opacity               ?? DEFAULT_CONFIG.opacity,
      transition:            u.transition            ?? DEFAULT_CONFIG.transition,
      inactiveOpacity:       u.inactiveOpacity       ?? DEFAULT_CONFIG.inactiveOpacity,
      inactiveTransition:    u.inactiveTransition    ?? DEFAULT_CONFIG.inactiveTransition,
      toolbarBrightness:     u.toolbarBrightness     ?? DEFAULT_CONFIG.toolbarBrightness,
      toolbarBorderColor:    isDynamic ? themeColor : (u.toolbarBorderColor ?? themeColor),
      toolbarBorderWidth:    u.toolbarBorderWidth    ?? DEFAULT_CONFIG.toolbarBorderWidth,
      toolbarInnerGlowSize:  u.toolbarInnerGlowSize  ?? DEFAULT_CONFIG.toolbarInnerGlowSize,
      toolbarInnerGlowAlpha: u.toolbarInnerGlowAlpha ?? DEFAULT_CONFIG.toolbarInnerGlowAlpha,
      toolbarOuterGlowSize:  u.toolbarOuterGlowSize  ?? DEFAULT_CONFIG.toolbarOuterGlowSize,
      toolbarOuterGlowAlpha: u.toolbarOuterGlowAlpha ?? DEFAULT_CONFIG.toolbarOuterGlowAlpha,
      highlightToolbar:      u.highlightToolbar      ?? DEFAULT_CONFIG.highlightToolbar,
      syncActiveToolbar:     u.syncActiveToolbar     ?? DEFAULT_CONFIG.syncActiveToolbar,
      dynamicBorderColor:    isDynamic,
      themeColorIndex:       colorIndex,
      paneMargin:            u.paneMargin            ?? DEFAULT_CONFIG.paneMargin,
      paneRadius:            u.paneRadius            ?? DEFAULT_CONFIG.paneRadius,
    }
  }
}
