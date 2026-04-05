import { Component, OnInit } from '@angular/core'
import { ConfigService } from 'tabby-core'
import { DEFAULT_CONFIG, HighlightConfig } from '../config'

/**
 * Highlight Pane 설정 화면 컴포넌트
 * Tabby 설정 → "Highlight Pane" 메뉴에서 접근합니다.
 */
@Component({
  selector: 'highlight-pane-settings',
  template: `
    <div class="container-fluid" style="padding-bottom: 2rem">
      <h3>
        <i class="fas fa-highlighter me-2" style="color:#85A4AE"></i>
        Highlight Pane
      </h3>

      <!-- 활성화 토글 -->
      <div class="form-line">
        <div class="header">
          <div class="title">활성화</div>
          <div class="description">Split Pane 하이라이팅 기능을 켜거나 끕니다</div>
        </div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" id="hp-enabled"
            [(ngModel)]="config.enabled" (ngModelChange)="save()">
          <label class="form-check-label" for="hp-enabled"></label>
        </div>
      </div>

      <ng-container *ngIf="config.enabled">

        <!-- ────── 레이아웃 ────── -->
        <h4 class="mt-4 mb-3" style="color:#85A4AE; font-size:1rem; text-transform:uppercase; letter-spacing:.05em">
          레이아웃
        </h4>

        <div class="form-line">
          <div class="header">
            <div class="title">Pane 여백 (px)</div>
            <div class="description">split-tab 주변 여백</div>
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
            <div class="title">모서리 둥글기 (px)</div>
            <div class="description">Pane 테두리 border-radius</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="20" step="1"
              style="width:120px"
              [(ngModel)]="config.paneRadius" (ngModelChange)="save()">
            <span class="text-muted">{{ config.paneRadius }}px</span>
          </div>
        </div>

        <!-- ────── 활성 구역 ────── -->
        <h4 class="mt-4 mb-3" style="color:#85A4AE; font-size:1rem; text-transform:uppercase; letter-spacing:.05em">
          활성 구역
        </h4>

        <!-- 테두리 색상 (공통 — 툴바와 링크 가능) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              테두리 색상
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em" title="툴바와 동기화됨"></i>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="color" class="form-control form-control-color"
              style="width:44px; height:32px; padding:2px; cursor:pointer"
              [(ngModel)]="config.borderColor"
              (ngModelChange)="onActivePaneCommon('borderColor', 'toolbarBorderColor', $event)">
            <span class="text-muted font-monospace">{{ config.borderColor }}</span>
          </div>
        </div>

        <!-- 테두리 두께 (공통 — 툴바와 링크 가능) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              테두리 두께 (px)
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em" title="툴바와 동기화됨"></i>
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

        <!-- 내부 글로우 크기 (공통 — 툴바와 링크 가능) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              내부 글로우 크기 (px)
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em" title="툴바와 동기화됨"></i>
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

        <!-- 내부 글로우 투명도 (공통 — 툴바와 링크 가능) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              내부 글로우 투명도
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em" title="툴바와 동기화됨"></i>
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

        <!-- 외부 글로우 크기 (공통 — 툴바와 링크 가능) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              외부 글로우 크기 (px)
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em" title="툴바와 동기화됨"></i>
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

        <!-- 외부 글로우 투명도 (공통 — 툴바와 링크 가능) -->
        <div class="form-line">
          <div class="header">
            <div class="title">
              외부 글로우 투명도
              <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                style="color:#85A4AE; font-size:0.75em" title="툴바와 동기화됨"></i>
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
          <div class="header"><div class="title">활성 구역 불투명도</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0.5" max="1" step="0.05"
              style="width:120px"
              [(ngModel)]="config.opacity" (ngModelChange)="save()">
            <span class="text-muted">{{ config.opacity | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">전환 속도 (ms)</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1000" step="50"
              style="width:120px"
              [(ngModel)]="config.transition" (ngModelChange)="save()">
            <span class="text-muted">{{ config.transition }}ms</span>
          </div>
        </div>

        <!-- ────── 비활성 구역 ────── -->
        <h4 class="mt-4 mb-3" style="color:#85A4AE; font-size:1rem; text-transform:uppercase; letter-spacing:.05em">
          비활성 구역
        </h4>

        <div class="form-line">
          <div class="header"><div class="title">비활성 구역 불투명도</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0.1" max="1" step="0.05"
              style="width:120px"
              [(ngModel)]="config.inactiveOpacity" (ngModelChange)="save()">
            <span class="text-muted">{{ config.inactiveOpacity | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">비활성 전환 속도 (ms)</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1000" step="50"
              style="width:120px"
              [(ngModel)]="config.inactiveTransition" (ngModelChange)="save()">
            <span class="text-muted">{{ config.inactiveTransition }}ms</span>
          </div>
        </div>

        <!-- ────── 동기화 토글 (활성 구역 ↔ 툴바) ────── -->
        <div class="d-flex align-items-center gap-3 mt-4" style="user-select:none">
          <div style="flex:1; height:1px; background:rgba(133,164,174,0.25)"></div>
          <button class="btn btn-sm px-3 py-1"
            style="border-radius:20px; font-size:0.8rem; transition:all 200ms"
            [style.color]="config.syncActiveToolbar ? '#85A4AE' : '#888'"
            [style.border]="config.syncActiveToolbar ? '1px solid #85A4AE' : '1px solid #555'"
            [style.background]="config.syncActiveToolbar ? 'rgba(133,164,174,0.12)' : 'transparent'"
            (click)="toggleSync()"
            [title]="config.syncActiveToolbar ? '클릭하여 독립 설정으로 전환' : '클릭하여 활성구역과 툴바를 동기화'">
            <i class="me-1" [ngClass]="config.syncActiveToolbar ? 'fas fa-link' : 'fas fa-unlink'"></i>
            {{ config.syncActiveToolbar ? '활성구역 ↔ 툴바 동기화 ON' : '활성구역 ↔ 툴바 독립 설정' }}
          </button>
          <div style="flex:1; height:1px; background:rgba(133,164,174,0.25)"></div>
        </div>

        <!-- ────── 툴바 ────── -->
        <h4 class="mt-3 mb-3" style="color:#85A4AE; font-size:1rem; text-transform:uppercase; letter-spacing:.05em">
          툴바
        </h4>

        <div class="form-line">
          <div class="header">
            <div class="title">툴바 하이라이트</div>
            <div class="description">활성 구역 툴바를 강조 표시합니다</div>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="hp-toolbar"
              [(ngModel)]="config.highlightToolbar" (ngModelChange)="save()">
            <label class="form-check-label" for="hp-toolbar"></label>
          </div>
        </div>

        <ng-container *ngIf="config.highlightToolbar">

          <!-- 툴바 테두리 색상 (공통 — 활성구역과 링크 가능) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                테두리 색상
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em" title="활성 구역과 동기화됨"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                활성 구역과 동기화됨
              </div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="color" class="form-control form-control-color"
                style="width:44px; height:32px; padding:2px; cursor:pointer"
                [(ngModel)]="config.toolbarBorderColor"
                (ngModelChange)="onToolbarCommon('borderColor', 'toolbarBorderColor', $event)">
              <span class="text-muted font-monospace">{{ config.toolbarBorderColor }}</span>
            </div>
          </div>

          <!-- 툴바 테두리 두께 (공통 — 활성구역과 링크 가능) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                테두리 두께 (px)
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em" title="활성 구역과 동기화됨"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                활성 구역과 동기화됨
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

          <!-- 툴바 내부 글로우 크기 (공통 — 활성구역과 링크 가능) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                내부 글로우 크기 (px)
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em" title="활성 구역과 동기화됨"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                활성 구역과 동기화됨
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

          <!-- 툴바 내부 글로우 투명도 (공통 — 활성구역과 링크 가능) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                내부 글로우 투명도
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em" title="활성 구역과 동기화됨"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                활성 구역과 동기화됨
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

          <!-- 툴바 외부 글로우 크기 (공통 — 활성구역과 링크 가능) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                외부 글로우 크기 (px)
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em" title="활성 구역과 동기화됨"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                활성 구역과 동기화됨
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

          <!-- 툴바 외부 글로우 투명도 (공통 — 활성구역과 링크 가능) -->
          <div class="form-line">
            <div class="header">
              <div class="title">
                외부 글로우 투명도
                <i *ngIf="config.syncActiveToolbar" class="fas fa-link ms-1"
                  style="color:#85A4AE; font-size:0.75em" title="활성 구역과 동기화됨"></i>
              </div>
              <div *ngIf="config.syncActiveToolbar" class="description" style="font-size:0.78rem; color:#85A4AE">
                활성 구역과 동기화됨
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

          <!-- 툴바 밝기 (툴바 전용) -->
          <div class="form-line">
            <div class="header">
              <div class="title">툴바 밝기</div>
              <div class="description">기존 색상을 유지하며 밝기만 조절합니다</div>
            </div>
            <div class="d-flex align-items-center gap-2">
              <input type="range" class="form-range" min="1" max="2" step="0.05"
                style="width:120px"
                [(ngModel)]="config.toolbarBrightness" (ngModelChange)="save()">
              <span class="text-muted">{{ config.toolbarBrightness | number:'1.0-2' }}x</span>
            </div>
          </div>

        </ng-container>

        <!-- 초기화 버튼 -->
        <div class="mt-4">
          <button class="btn btn-secondary btn-sm" (click)="reset()">
            <i class="fas fa-undo me-1"></i> 기본값으로 초기화
          </button>
        </div>

      </ng-container>
    </div>
  `,
})
export class HighlightPaneSettingsComponent implements OnInit {
  config: HighlightConfig = { ...DEFAULT_CONFIG }

  constructor (public configService: ConfigService) {}

  ngOnInit (): void {
    this.config = this.loadConfig()
  }

  save (): void {
    if (!this.configService.store.highlightPane) {
      this.configService.store.highlightPane = {}
    }
    Object.assign(this.configService.store.highlightPane, this.config)
    this.configService.save()
  }

  reset (): void {
    this.config = { ...DEFAULT_CONFIG }
    this.save()
  }

  /**
   * 활성 구역의 공통 설정 변경 핸들러
   * 동기화 ON 시 해당 툴바 설정도 동일하게 적용
   */
  onActivePaneCommon (activeKey: keyof HighlightConfig, toolbarKey: keyof HighlightConfig, value: any): void {
    // ngModel이 activeKey 값을 이미 설정한 상태로 호출됨
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
    // ngModel이 toolbarKey 값을 이미 설정한 상태로 호출됨
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
      // 활성 구역 값을 기준으로 툴바 공통 설정 동기화
      this.config.toolbarBorderColor   = this.config.borderColor
      this.config.toolbarBorderWidth   = this.config.borderWidth
      this.config.toolbarInnerGlowSize  = this.config.innerGlowSize
      this.config.toolbarInnerGlowAlpha = this.config.innerGlowAlpha
      this.config.toolbarOuterGlowSize  = this.config.outerGlowSize
      this.config.toolbarOuterGlowAlpha = this.config.outerGlowAlpha
    }
    this.save()
  }

  private loadConfig (): HighlightConfig {
    const u = this.configService.store?.highlightPane ?? {}
    return {
      enabled:               u.enabled               ?? DEFAULT_CONFIG.enabled,
      borderColor:           u.borderColor           ?? DEFAULT_CONFIG.borderColor,
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
      toolbarBorderColor:    u.toolbarBorderColor    ?? DEFAULT_CONFIG.toolbarBorderColor,
      toolbarBorderWidth:    u.toolbarBorderWidth    ?? DEFAULT_CONFIG.toolbarBorderWidth,
      toolbarInnerGlowSize:  u.toolbarInnerGlowSize  ?? DEFAULT_CONFIG.toolbarInnerGlowSize,
      toolbarInnerGlowAlpha: u.toolbarInnerGlowAlpha ?? DEFAULT_CONFIG.toolbarInnerGlowAlpha,
      toolbarOuterGlowSize:  u.toolbarOuterGlowSize  ?? DEFAULT_CONFIG.toolbarOuterGlowSize,
      toolbarOuterGlowAlpha: u.toolbarOuterGlowAlpha ?? DEFAULT_CONFIG.toolbarOuterGlowAlpha,
      highlightToolbar:      u.highlightToolbar      ?? DEFAULT_CONFIG.highlightToolbar,
      syncActiveToolbar:     u.syncActiveToolbar     ?? DEFAULT_CONFIG.syncActiveToolbar,
      paneMargin:            u.paneMargin            ?? DEFAULT_CONFIG.paneMargin,
      paneRadius:            u.paneRadius            ?? DEFAULT_CONFIG.paneRadius,
    }
  }
}

