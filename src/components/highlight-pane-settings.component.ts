import { Component, OnInit } from '@angular/core'
import { ConfigService, ThemesService } from 'tabby-core'
import { DEFAULT_CONFIG, HighlightConfig } from '../config'
import { getActiveThemeColor } from '../theme-utils'

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

        <!-- 테마 색상 자동 적용 -->
        <div class="form-line">
          <div class="header">
            <div class="title">테마 색상 자동 적용</div>
            <div class="description">
              다크/라이트 모드에 따라 터미널 색상표의 지정 번호 색상을 테두리·글로우에 자동 적용합니다.
              (Standard 테마 = 다크 색상표, Paper 테마 = 라이트 색상표)
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <!-- ON/OFF 토글 -->
            <div class="form-check form-switch mb-0">
              <input class="form-check-input" type="checkbox" id="hp-dynamic-color"
                [(ngModel)]="config.dynamicBorderColor" (ngModelChange)="onDynamicColorChange($event)">
              <label class="form-check-label" for="hp-dynamic-color"></label>
            </div>
            <!-- 색상 번호 선택 (동적 모드 ON 시에만 표시) -->
            <ng-container *ngIf="config.dynamicBorderColor">
              <span class="text-muted" style="font-size:0.85rem">색상</span>
              <input type="number" class="form-control form-control-sm"
                style="width:58px; text-align:center; padding:2px 6px"
                min="1" max="15" step="1"
                [(ngModel)]="config.themeColorIndex"
                (ngModelChange)="onThemeColorIndexChange($event)">
              <span class="text-muted" style="font-size:0.85rem">번</span>
              <!-- 현재 선택된 테마 색상 미리보기 -->
              <div [style.background]="getThemeColor()"
                style="width:22px; height:22px; border-radius:4px; border:1px solid rgba(128,128,128,0.35); flex-shrink:0"
                [title]="getThemeColor()"></div>
            </ng-container>
          </div>
        </div>

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
              style="width:44px; height:32px; padding:2px"
              [style.cursor]="config.dynamicBorderColor ? 'not-allowed' : 'pointer'"
              [style.opacity]="config.dynamicBorderColor ? '0.55' : '1'"
              [style.pointerEvents]="config.dynamicBorderColor ? 'none' : 'auto'"
              [(ngModel)]="config.borderColor"
              (ngModelChange)="onActivePaneCommon('borderColor', 'toolbarBorderColor', $event)">
            <span class="text-muted font-monospace">{{ config.borderColor }}</span>
            <span *ngIf="config.dynamicBorderColor"
              style="font-size:0.72rem; padding:1px 7px; border-radius:10px; background:rgba(133,164,174,0.15); color:#85A4AE">자동</span>
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
                style="width:44px; height:32px; padding:2px"
                [style.cursor]="config.dynamicBorderColor ? 'not-allowed' : 'pointer'"
                [style.opacity]="config.dynamicBorderColor ? '0.55' : '1'"
                [style.pointerEvents]="config.dynamicBorderColor ? 'none' : 'auto'"
                [(ngModel)]="config.toolbarBorderColor"
                (ngModelChange)="onToolbarCommon('borderColor', 'toolbarBorderColor', $event)">
              <span class="text-muted font-monospace">{{ config.toolbarBorderColor }}</span>
              <span *ngIf="config.dynamicBorderColor"
                style="font-size:0.72rem; padding:1px 7px; border-radius:10px; background:rgba(133,164,174,0.15); color:#85A4AE">자동</span>
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

