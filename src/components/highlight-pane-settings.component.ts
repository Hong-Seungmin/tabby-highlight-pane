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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.paneMargin" (ngModelChange)="save()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.paneMargin }}px</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header">
            <div class="title">{{ 'highlightPane.paneRadius' | translate }}</div>
            <div class="description">{{ 'highlightPane.paneRadiusDesc' | translate }}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="20" step="1"
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.paneRadius" (ngModelChange)="save()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.paneRadius }}px</span>
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
            <input type="text" class="form-control form-control-sm font-monospace"
              style="width:90px; padding:2px 4px"
              [(ngModel)]="config.borderColor"
              [attr.readonly]="config.dynamicBorderColor ? '' : null"
              (change)="onHexInput('borderColor')">
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.borderWidth"
              (ngModelChange)="onActivePaneCommon('borderWidth', 'toolbarBorderWidth', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.borderWidth }}px</span>
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.innerGlowSize"
              (ngModelChange)="onActivePaneCommon('innerGlowSize', 'toolbarInnerGlowSize', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.innerGlowSize }}px</span>
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.innerGlowAlpha"
              (ngModelChange)="onActivePaneCommon('innerGlowAlpha', 'toolbarInnerGlowAlpha', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.innerGlowAlpha | number:'1.0-2' }}</span>
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.outerGlowSize"
              (ngModelChange)="onActivePaneCommon('outerGlowSize', 'toolbarOuterGlowSize', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.outerGlowSize }}px</span>
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.outerGlowAlpha"
              (ngModelChange)="onActivePaneCommon('outerGlowAlpha', 'toolbarOuterGlowAlpha', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.outerGlowAlpha | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">{{ 'highlightPane.activePaneOpacity' | translate }}</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0.5" max="1" step="0.05"
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.opacity" (ngModelChange)="save()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.opacity | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">{{ 'highlightPane.transitionSpeed' | translate }}</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1000" step="50"
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.transition" (ngModelChange)="save()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.transition }}ms</span>
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.inactiveOpacity" (ngModelChange)="save()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.inactiveOpacity | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">{{ 'highlightPane.inactiveTransition' | translate }}</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1000" step="50"
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.inactiveTransition" (ngModelChange)="save()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.inactiveTransition }}ms</span>
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
            <input type="text" class="form-control form-control-sm font-monospace"
              style="width:90px; padding:2px 4px"
              [(ngModel)]="config.toolbarBorderColor"
              [attr.readonly]="config.dynamicBorderColor ? '' : null"
              (change)="onHexInput('toolbarBorderColor')">
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.toolbarBorderWidth"
              (ngModelChange)="onToolbarCommon('borderWidth', 'toolbarBorderWidth', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.toolbarBorderWidth }}px</span>
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.toolbarInnerGlowSize"
              (ngModelChange)="onToolbarCommon('innerGlowSize', 'toolbarInnerGlowSize', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.toolbarInnerGlowSize }}px</span>
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.toolbarInnerGlowAlpha"
              (ngModelChange)="onToolbarCommon('innerGlowAlpha', 'toolbarInnerGlowAlpha', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.toolbarInnerGlowAlpha | number:'1.0-2' }}</span>
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.toolbarOuterGlowSize"
              (ngModelChange)="onToolbarCommon('outerGlowSize', 'toolbarOuterGlowSize', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.toolbarOuterGlowSize }}px</span>
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.toolbarOuterGlowAlpha"
              (ngModelChange)="onToolbarCommon('outerGlowAlpha', 'toolbarOuterGlowAlpha', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.toolbarOuterGlowAlpha | number:'1.0-2' }}</span>
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
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.toolbarBrightness" (ngModelChange)="save()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.toolbarBrightness | number:'1.0-2' }}x</span>
          </div>
        </div>

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
    if (this.config.dynamicBorderColor) {
      delete this.configService.store.highlightPane.borderColor
      delete this.configService.store.highlightPane.toolbarBorderColor
    }
    this.configService.save()
  }

  reset (): void {
    this.config = { ...DEFAULT_CONFIG }
    const themeColor = this.getThemeColor()
    this.config.borderColor = themeColor
    this.config.toolbarBorderColor = themeColor
    this.save()
  }

  onDynamicColorChange (dynamic: boolean): void {
    if (dynamic) {
      const themeColor = this.getThemeColor()
      this.config.borderColor = themeColor
      this.config.toolbarBorderColor = themeColor
    }
    this.save()
  }

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

  onActivePaneCommon (activeKey: keyof HighlightConfig, toolbarKey: keyof HighlightConfig, value: any): void {
    if (this.config.syncActiveToolbar) {
      (this.config as any)[toolbarKey] = value
    }
    this.save()
  }

  onToolbarCommon (activeKey: keyof HighlightConfig, toolbarKey: keyof HighlightConfig, value: any): void {
    if (this.config.syncActiveToolbar) {
      (this.config as any)[activeKey] = value
    }
    this.save()
  }

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
   * 색상 hex 텍스트 입력 처리 (복사/붙여넣기 지원)
   * 유효한 6자리 hex 값인 경우에만 저장합니다.
   */
  onHexInput (model: 'borderColor' | 'toolbarBorderColor'): void {
    const value = ((this.config as any)[model] as string).trim()
    if (!/^#[0-9A-Fa-f]{6}$/i.test(value)) {
      // 유효하지 않은 값은 기존 값으로 되돌리기
      this.config = { ...this.config }
      return
    }
    ;(this.config as any)[model] = value
    if (model === 'borderColor') {
      this.onActivePaneCommon('borderColor', 'toolbarBorderColor', value)
    } else {
      this.onToolbarCommon('borderColor', 'toolbarBorderColor', value)
    }
  }

  getThemeColor (): string {
    const idx = this.config?.themeColorIndex ?? DEFAULT_CONFIG.themeColorIndex
    const currentThemeName = this.themesService.findCurrentTheme()?.name ?? ''
    return getActiveThemeColor(this.configService.store, currentThemeName, idx)
  }

  private loadConfig (): HighlightConfig {
    const u = this.configService.store?.highlightPane ?? {}
    const isDynamic = u.dynamicBorderColor !== false
    const colorIndex = u.themeColorIndex ?? DEFAULT_CONFIG.themeColorIndex
    const currentThemeName = this.themesService.findCurrentTheme()?.name ?? ''
    const themeColor = getActiveThemeColor(this.configService.store, currentThemeName, colorIndex)
    return {
      enabled:               u.enabled               ?? DEFAULT_CONFIG.enabled,
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
      highlightToolbar:      true,
      syncActiveToolbar:     u.syncActiveToolbar     ?? DEFAULT_CONFIG.syncActiveToolbar,
      dynamicBorderColor:    isDynamic,
      themeColorIndex:       colorIndex,
      paneMargin:            u.paneMargin            ?? DEFAULT_CONFIG.paneMargin,
      paneRadius:            u.paneRadius            ?? DEFAULT_CONFIG.paneRadius,
    }
  }
}
