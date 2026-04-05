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

        <div class="form-line">
          <div class="header"><div class="title">테두리 색상</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="color" class="form-control form-control-color"
              style="width:44px; height:32px; padding:2px; cursor:pointer"
              [(ngModel)]="config.borderColor" (ngModelChange)="save()">
            <span class="text-muted font-monospace">{{ config.borderColor }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">테두리 두께 (px)</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="5" step="1"
              style="width:120px"
              [(ngModel)]="config.borderWidth" (ngModelChange)="save()">
            <span class="text-muted">{{ config.borderWidth }}px</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header">
            <div class="title">내부 글로우 크기 (px)</div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="30" step="1"
              style="width:120px"
              [(ngModel)]="config.innerGlowSize" (ngModelChange)="save()">
            <span class="text-muted">{{ config.innerGlowSize }}px</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">내부 글로우 투명도</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1" step="0.05"
              style="width:120px"
              [(ngModel)]="config.innerGlowAlpha" (ngModelChange)="save()">
            <span class="text-muted">{{ config.innerGlowAlpha | number:'1.0-2' }}</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">외부 글로우 크기 (px)</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="50" step="1"
              style="width:120px"
              [(ngModel)]="config.outerGlowSize" (ngModelChange)="save()">
            <span class="text-muted">{{ config.outerGlowSize }}px</span>
          </div>
        </div>

        <div class="form-line">
          <div class="header"><div class="title">외부 글로우 투명도</div></div>
          <div class="d-flex align-items-center gap-2">
            <input type="range" class="form-range" min="0" max="1" step="0.05"
              style="width:120px"
              [(ngModel)]="config.outerGlowAlpha" (ngModelChange)="save()">
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

        <!-- ────── 툴바 ────── -->
        <h4 class="mt-4 mb-3" style="color:#85A4AE; font-size:1rem; text-transform:uppercase; letter-spacing:.05em">
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
          <div class="form-line">
            <div class="header"><div class="title">툴바 테두리 색상</div></div>
            <div class="d-flex align-items-center gap-2">
              <input type="color" class="form-control form-control-color"
                style="width:44px; height:32px; padding:2px; cursor:pointer"
                [(ngModel)]="config.toolbarBorderColor" (ngModelChange)="save()">
              <span class="text-muted font-monospace">{{ config.toolbarBorderColor }}</span>
            </div>
          </div>

          <div class="form-line">
            <div class="header"><div class="title">툴바 테두리 두께 (px)</div></div>
            <div class="d-flex align-items-center gap-2">
              <input type="range" class="form-range" min="0" max="5" step="1"
                style="width:120px"
                [(ngModel)]="config.toolbarBorderWidth" (ngModelChange)="save()">
              <span class="text-muted">{{ config.toolbarBorderWidth }}px</span>
            </div>
          </div>

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

  private loadConfig (): HighlightConfig {
    const u = this.configService.store?.highlightPane ?? {}
    return {
      enabled:            u.enabled            ?? DEFAULT_CONFIG.enabled,
      borderColor:        u.borderColor        ?? DEFAULT_CONFIG.borderColor,
      borderWidth:        u.borderWidth        ?? DEFAULT_CONFIG.borderWidth,
      borderStyle:        u.borderStyle        ?? DEFAULT_CONFIG.borderStyle,
      innerGlowSize:      u.innerGlowSize      ?? DEFAULT_CONFIG.innerGlowSize,
      innerGlowAlpha:     u.innerGlowAlpha     ?? DEFAULT_CONFIG.innerGlowAlpha,
      outerGlowSize:      u.outerGlowSize      ?? DEFAULT_CONFIG.outerGlowSize,
      outerGlowAlpha:     u.outerGlowAlpha     ?? DEFAULT_CONFIG.outerGlowAlpha,
      opacity:            u.opacity            ?? DEFAULT_CONFIG.opacity,
      transition:         u.transition         ?? DEFAULT_CONFIG.transition,
      inactiveOpacity:    u.inactiveOpacity    ?? DEFAULT_CONFIG.inactiveOpacity,
      inactiveTransition: u.inactiveTransition ?? DEFAULT_CONFIG.inactiveTransition,
      toolbarBrightness:  u.toolbarBrightness  ?? DEFAULT_CONFIG.toolbarBrightness,
      toolbarBorderColor: u.toolbarBorderColor ?? DEFAULT_CONFIG.toolbarBorderColor,
      toolbarBorderWidth: u.toolbarBorderWidth ?? DEFAULT_CONFIG.toolbarBorderWidth,
      highlightToolbar:   u.highlightToolbar   ?? DEFAULT_CONFIG.highlightToolbar,
      paneMargin:         u.paneMargin         ?? DEFAULT_CONFIG.paneMargin,
      paneRadius:         u.paneRadius         ?? DEFAULT_CONFIG.paneRadius,
    }
  }
}

