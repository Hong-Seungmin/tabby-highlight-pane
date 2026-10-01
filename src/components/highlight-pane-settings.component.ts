import { Component, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ConfigService, PlatformService } from 'tabby-core'
import { DEFAULT_CONFIG, HighlightConfig } from '../config'
import { HighlightStyleService } from '../services/highlight-style.service'
import { hexToRgb } from '../style-generator'
import { readTabbyToolbarColors } from '../theme-utils'

/**
 * Highlight Pane 설정 화면 컴포넌트
 * Tabby 설정 → "Highlight Pane" 메뉴에서 접근합니다.
 *
 * 다국어 지원: @ngx-translate/core TranslateService 기반
 *  - PluginI18nService.init() 에서 번역 등록 및 언어 활성화
 *  - 템플릿에서 | translate 파이프 사용
 *
 * 저장 방식: 편집 값은 미리보기로만 반영되고, [저장] 버튼을 눌러야 설정 파일에 기록됩니다.
 *  - [취소]: 마지막으로 저장된 값으로 복원
 *  - 저장하지 않고 화면을 떠나면 확인창으로 저장 여부를 묻습니다
 */
@Component({
  selector: 'highlight-pane-settings',
  template: `
    <div class="container-fluid">
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
            [(ngModel)]="config.enabled" (ngModelChange)="onChange()">
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
              [(ngModel)]="config.paneMargin" (ngModelChange)="onChange()">
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
              [(ngModel)]="config.paneRadius" (ngModelChange)="onChange()">
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
              [(ngModel)]="config.opacity" (ngModelChange)="onChange()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.opacity | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header">
            <div class="title">
              {{ 'highlightPane.transitionSpeed' | translate }}
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em"
                [title]="'highlightPane.syncedWithToolbar' | translate"></i>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1000" step="50"
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.transition"
              (ngModelChange)="onActivePaneCommon('transition', 'toolbarTransition', $event)">
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
              [(ngModel)]="config.inactiveOpacity" (ngModelChange)="onChange()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.inactiveOpacity | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">{{ 'highlightPane.inactiveTransition' | translate }}</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1000" step="50"
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.inactiveTransition" (ngModelChange)="onChange()">
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

        <!-- Toolbar Transition Speed (common — linkable with active pane) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              {{ 'highlightPane.transitionSpeed' | translate }}
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em"
                [title]="'highlightPane.syncedWithActivePane' | translate"></i>
            </div>
            <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
              {{ 'highlightPane.syncedWithActivePane' | translate }}
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1000" step="50"
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.toolbarTransition"
              (ngModelChange)="onToolbarCommon('transition', 'toolbarTransition', $event)">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.toolbarTransition }}ms</span>
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
              [(ngModel)]="config.toolbarBrightness" (ngModelChange)="onChange()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.toolbarBrightness | number:'1.0-2' }}x</span>
          </div>
        </div>

        <!-- ────── Active Header ────── -->
        <h4 class="mt-4 mb-3" style="color:#85A4AE; font-size:1rem; text-transform:uppercase; letter-spacing:.05em">
          {{ 'highlightPane.activeHeader' | translate }}
        </h4>

        <!-- Apply to non-split tabs -->
        <div class="form-line">
          <div class="header">
            <div class="title">{{ 'highlightPane.headerSinglePane' | translate }}</div>
            <div class="description">{{ 'highlightPane.headerSinglePaneDesc' | translate }}</div>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="hp-header-single"
              [(ngModel)]="config.headerSinglePane" (ngModelChange)="onChange()">
            <label class="form-check-label" for="hp-header-single"></label>
          </div>
        </div>

        <!-- Header background color -->
        <div class="form-line">
          <div class="header">
            <div class="title">{{ 'highlightPane.headerBgColor' | translate }}</div>
            <div class="description">{{ 'highlightPane.headerBgColorDesc' | translate }}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <div class="form-check form-switch mb-0" [title]="'highlightPane.tabbyDefaultDesc' | translate">
              <input class="form-check-input" type="checkbox" id="hp-header-bg-auto"
                [(ngModel)]="config.headerBgAuto" (ngModelChange)="onHeaderAutoChange('bg', $event)">
              <label class="form-check-label text-muted" for="hp-header-bg-auto" style="font-size:0.85rem">
                {{ 'highlightPane.tabbyDefault' | translate }}
              </label>
            </div>
            <input type="color" class="form-control form-control-color"
              style="width:44px; height:32px; padding:2px"
              [style.opacity]="config.headerBgAuto ? '0.55' : '1'"
              [style.pointerEvents]="config.headerBgAuto ? 'none' : 'auto'"
              [(ngModel)]="config.headerBgColor" (ngModelChange)="onChange()">
            <input type="text" class="form-control form-control-sm font-monospace"
              style="width:90px; padding:2px 4px"
              [(ngModel)]="config.headerBgColor"
              [attr.readonly]="config.headerBgAuto ? '' : null"
              (change)="onHexInput('headerBgColor')">
          </div>
        </div>

        <div class="form-line" *ngIf="!config.headerBgAuto">
          <div class="header"><div class="title">{{ 'highlightPane.headerBgOpacity' | translate }}</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1" step="0.05"
              style="width:140px; flex-shrink:0"
              [(ngModel)]="config.headerBgAlpha" (ngModelChange)="onChange()">
            <span class="text-muted" style="display:inline-block; width:52px; text-align:right">{{ config.headerBgAlpha | number:'1.0-2' }}</span>
          </div>
        </div>

        <!-- Header text / icon color -->
        <div class="form-line">
          <div class="header">
            <div class="title">{{ 'highlightPane.headerFgColor' | translate }}</div>
            <div class="description">{{ 'highlightPane.headerFgColorDesc' | translate }}</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <div class="form-check form-switch mb-0" [title]="'highlightPane.tabbyDefaultDesc' | translate">
              <input class="form-check-input" type="checkbox" id="hp-header-fg-auto"
                [(ngModel)]="config.headerFgAuto" (ngModelChange)="onHeaderAutoChange('fg', $event)">
              <label class="form-check-label text-muted" for="hp-header-fg-auto" style="font-size:0.85rem">
                {{ 'highlightPane.tabbyDefault' | translate }}
              </label>
            </div>
            <input type="color" class="form-control form-control-color"
              style="width:44px; height:32px; padding:2px"
              [style.opacity]="config.headerFgAuto ? '0.55' : '1'"
              [style.pointerEvents]="config.headerFgAuto ? 'none' : 'auto'"
              [(ngModel)]="config.headerFgColor" (ngModelChange)="onChange()">
            <input type="text" class="form-control form-control-sm font-monospace"
              style="width:90px; padding:2px 4px"
              [(ngModel)]="config.headerFgColor"
              [attr.readonly]="config.headerFgAuto ? '' : null"
              (change)="onHexInput('headerFgColor')">
          </div>
        </div>

        <!-- Header preview chip -->
        <div class="form-line">
          <div class="header">
            <div class="title">{{ 'highlightPane.headerPreview' | translate }}</div>
            <div class="description">{{ 'highlightPane.headerPreviewDesc' | translate }}</div>
          </div>
          <div class="d-flex align-items-center gap-2 px-3"
            style="height:32px; min-width:180px; border-radius:6px; border:1px solid rgba(128,128,128,0.35)"
            [style.background]="getHeaderPreviewBg()"
            [style.color]="config.headerFgAuto ? null : config.headerFgColor">
            <i class="fas fa-terminal"></i>
            <span style="font-size:0.85rem">user&#64;host: ~</span>
          </div>
        </div>

      </ng-container>

      <!-- ────── Action bar (Reset / Cancel / Save) ────── -->
      <div class="hp-action-bar d-flex align-items-center gap-2 mt-4">
        <button class="btn btn-secondary btn-sm" (click)="reset()"
          [title]="'highlightPane.resetToDefaultsDesc' | translate">
          <i class="fas fa-undo me-1"></i> {{ 'highlightPane.resetToDefaults' | translate }}
        </button>
        <div class="flex-grow-1"></div>
        <span *ngIf="isDirty" class="text-warning" style="font-size:0.8rem">
          <i class="fas fa-circle me-1" style="font-size:0.5rem; vertical-align:middle"></i>
          {{ 'highlightPane.unsavedChanges' | translate }}
        </span>
        <button class="btn btn-secondary btn-sm" [disabled]="!isDirty" (click)="cancel()">
          <i class="fas fa-times me-1"></i> {{ 'highlightPane.cancel' | translate }}
        </button>
        <button class="btn btn-primary btn-sm" [disabled]="!isDirty" (click)="save()">
          <i class="fas fa-check me-1"></i> {{ 'highlightPane.save' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .hp-action-bar {
      position: sticky;
      bottom: 0;
      z-index: 10;
      padding: 0.75rem 0;
      background: var(--bs-body-bg, var(--theme-bg, inherit));
      border-top: 1px solid rgba(133, 164, 174, 0.25);
    }
  `],
})
export class HighlightPaneSettingsComponent implements OnInit, OnDestroy {
  config: HighlightConfig = { ...DEFAULT_CONFIG }
  /** 마지막으로 저장된 상태 (변경 여부 판별용) */
  private savedSnapshot = ''

  constructor (
    public configService: ConfigService,
    private highlightStyle: HighlightStyleService,
    private platform: PlatformService,
    private translate: TranslateService,
  ) {}

  ngOnInit (): void {
    this.config = this.loadConfig()
    this.savedSnapshot = this.snapshot()
  }

  /**
   * 저장하지 않은 변경사항을 남긴 채 화면을 떠나면 확인창을 띄웁니다.
   * 응답 전까지는 편집 중인 값(미리보기)이 그대로 유지됩니다.
   */
  ngOnDestroy (): void {
    if (!this.isDirty) {
      this.highlightStyle.clearPreview()
      return
    }
    const t = (key: string) => this.translate.instant(`highlightPane.${key}`)
    this.platform.showMessageBox({
      type: 'warning',
      message: t('leaveConfirmMessage'),
      detail: t('leaveConfirmDetail'),
      buttons: [t('save'), t('discard')],
      defaultId: 0,
      cancelId: 1,
    }).then(result => {
      if (result.response === 0) {
        this.save()
      } else {
        this.highlightStyle.clearPreview()
      }
    }).catch(() => this.highlightStyle.clearPreview())
  }

  get isDirty (): boolean {
    return this.snapshot() !== this.savedSnapshot
  }

  /** 편집 값 변경 시 호출 — 저장하지 않고 미리보기만 반영합니다 */
  onChange (): void {
    this.highlightStyle.setPreview(this.config)
  }

  /** 편집 중인 값을 설정 파일에 저장합니다 */
  save (): void {
    if (!this.configService.store.highlightPane) {
      this.configService.store.highlightPane = {}
    }
    // dynamicBorderColor=true 일 때는 borderColor/toolbarBorderColor를 기본값으로 설정.
    // ConfigProxy.__setValue는 값이 기본값과 같으면 _store에서 자동 삭제하므로
    // YAML에 불필요한 색상값이 남지 않는다.
    // 주의: ConfigProxy 프로퍼티는 configurable:false 이므로 delete 연산은
    //       strict mode에서 TypeError를 발생시켜 save() 전체를 중단시킨다.
    const toSave = this.config.dynamicBorderColor
      ? { ...this.config, borderColor: DEFAULT_CONFIG.borderColor, toolbarBorderColor: DEFAULT_CONFIG.toolbarBorderColor }
      : { ...this.config }
    Object.assign(this.configService.store.highlightPane, toSave)
    this.savedSnapshot = this.snapshot()
    this.highlightStyle.clearPreview()
    this.configService.save()
  }

  /** 편집 중인 값을 버리고 마지막으로 저장된 값으로 되돌립니다 */
  cancel (): void {
    this.config = this.loadConfig()
    this.savedSnapshot = this.snapshot()
    this.highlightStyle.clearPreview()
  }

  reset (): void {
    this.config = { ...DEFAULT_CONFIG }
    const themeColor = this.getThemeColor()
    this.config.borderColor = themeColor
    this.config.toolbarBorderColor = themeColor
    this.onChange()
  }

  onDynamicColorChange (dynamic: boolean): void {
    if (dynamic) {
      const themeColor = this.getThemeColor()
      this.config.borderColor = themeColor
      this.config.toolbarBorderColor = themeColor
    }
    this.onChange()
  }

  onThemeColorIndexChange (value: number): void {
    const clamped = Math.max(1, Math.min(15, Math.round(+value) || DEFAULT_CONFIG.themeColorIndex))
    this.config.themeColorIndex = clamped
    if (this.config.dynamicBorderColor) {
      const themeColor = this.getThemeColor()
      this.config.borderColor = themeColor
      this.config.toolbarBorderColor = themeColor
    }
    this.onChange()
  }

  onActivePaneCommon (activeKey: keyof HighlightConfig, toolbarKey: keyof HighlightConfig, value: any): void {
    if (this.config.syncActiveToolbar) {
      (this.config as any)[toolbarKey] = value
    }
    this.onChange()
  }

  onToolbarCommon (activeKey: keyof HighlightConfig, toolbarKey: keyof HighlightConfig, value: any): void {
    if (this.config.syncActiveToolbar) {
      (this.config as any)[activeKey] = value
    }
    this.onChange()
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
      this.config.toolbarTransition     = this.config.transition
    }
    this.onChange()
  }

  /**
   * 색상 hex 텍스트 입력 처리 (복사/붙여넣기 지원)
   * 유효한 6자리 hex 값인 경우에만 저장합니다.
   */
  onHexInput (model: 'borderColor' | 'toolbarBorderColor' | 'headerBgColor' | 'headerFgColor'): void {
    const value = ((this.config as any)[model] as string).trim()
    if (!/^#[0-9A-Fa-f]{6}$/i.test(value)) {
      // 유효하지 않은 값은 기존 값으로 되돌리기
      this.config = { ...this.config }
      return
    }
    ;(this.config as any)[model] = value
    if (model === 'borderColor') {
      this.onActivePaneCommon('borderColor', 'toolbarBorderColor', value)
    } else if (model === 'toolbarBorderColor') {
      this.onToolbarCommon('borderColor', 'toolbarBorderColor', value)
    } else {
      this.onChange()
    }
  }

  /**
   * 활성 헤더 "Tabby 기본값" 토글 처리
   * 기본값을 끌 때 색상이 아직 기본값이면, 현재 렌더링된 Tabby 툴바 색상으로 시작합니다.
   */
  onHeaderAutoChange (target: 'bg' | 'fg', auto: boolean): void {
    if (!auto) {
      const tabby = readTabbyToolbarColors()
      if (target === 'bg' && tabby.bg
        && this.config.headerBgColor === DEFAULT_CONFIG.headerBgColor
        && this.config.headerBgAlpha === DEFAULT_CONFIG.headerBgAlpha) {
        this.config.headerBgColor = tabby.bg.hex
        this.config.headerBgAlpha = Math.round(tabby.bg.alpha * 100) / 100
      }
      if (target === 'fg' && tabby.fg && this.config.headerFgColor === DEFAULT_CONFIG.headerFgColor) {
        this.config.headerFgColor = tabby.fg
      }
    }
    this.onChange()
  }

  /** 미리보기 칩 배경 — 기본값 사용 시 Tabby 기본 배경 */
  getHeaderPreviewBg (): string {
    const auto = this.config.headerBgAuto
    const [r, g, b] = hexToRgb(auto ? DEFAULT_CONFIG.headerBgColor : this.config.headerBgColor)
    return `rgba(${r}, ${g}, ${b}, ${auto ? DEFAULT_CONFIG.headerBgAlpha : this.config.headerBgAlpha})`
  }

  getThemeColor (): string {
    return this.highlightStyle.getThemeColor(this.config?.themeColorIndex ?? DEFAULT_CONFIG.themeColorIndex)
  }

  private snapshot (): string {
    return JSON.stringify(this.config)
  }

  private loadConfig (): HighlightConfig {
    const u = this.configService.store?.highlightPane ?? {}
    const isDynamic = u.dynamicBorderColor !== false
    const colorIndex = u.themeColorIndex ?? DEFAULT_CONFIG.themeColorIndex
    const themeColor = this.highlightStyle.getThemeColor(colorIndex)
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
      toolbarTransition:     u.toolbarTransition     ?? DEFAULT_CONFIG.toolbarTransition,
      highlightToolbar:      true,
      syncActiveToolbar:     u.syncActiveToolbar     ?? DEFAULT_CONFIG.syncActiveToolbar,
      dynamicBorderColor:    isDynamic,
      themeColorIndex:       colorIndex,
      paneMargin:            u.paneMargin            ?? DEFAULT_CONFIG.paneMargin,
      paneRadius:            u.paneRadius            ?? DEFAULT_CONFIG.paneRadius,
      headerSinglePane:      u.headerSinglePane      ?? DEFAULT_CONFIG.headerSinglePane,
      headerBgAuto:          u.headerBgAuto          ?? DEFAULT_CONFIG.headerBgAuto,
      headerBgColor:         u.headerBgColor         ?? DEFAULT_CONFIG.headerBgColor,
      headerBgAlpha:         u.headerBgAlpha         ?? DEFAULT_CONFIG.headerBgAlpha,
      headerFgAuto:          u.headerFgAuto          ?? DEFAULT_CONFIG.headerFgAuto,
      headerFgColor:         u.headerFgColor         ?? DEFAULT_CONFIG.headerFgColor,
    }
  }
}
