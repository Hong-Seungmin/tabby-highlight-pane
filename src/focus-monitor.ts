import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'

/**
 * FocusMonitor: Tabby split-tab의 활성(focused) 상태 변화를 감지합니다.
 * MutationObserver를 사용하여 .focused 클래스 변경을 실시간으로 추적합니다.
 */
@Injectable()
export class FocusMonitor {
  private focusSubject = new Subject<HTMLElement | null>()
  private observer: MutationObserver | null = null
  private currentFocused: HTMLElement | null = null

  /**
   * MutationObserver를 시작합니다.
   * document 내 모든 split-tab 요소의 .focused 클래스 변화를 감시합니다.
   */
  startMonitoring (): void {
    if (this.observer) return

    this.observer = new MutationObserver(() => {
      this.updateFocusedElement()
    })

    // 모든 split-tab 요소 감시
    const splitTabs = document.querySelectorAll('split-tab')
    splitTabs.forEach(tab => {
      this.observer!.observe(tab, {
        attributes: true,
        attributeFilter: ['class'],  // class 속성만 감시 (성능 최적화)
        subtree: true,               // 하위 요소 전체 감시
      })
    })

    // split-tab이 아직 없는 경우 document body 감시 (동적 추가 대응)
    if (splitTabs.length === 0) {
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      })
    }

    // 초기 포커스 상태 설정
    this.updateFocusedElement()
  }

  /**
   * MutationObserver를 정지하고 리소스를 정리합니다.
   */
  stopMonitoring (): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.currentFocused = null
  }

  /**
   * 포커스 변경 Observable을 반환합니다.
   * 활성 pane이 변경될 때마다 새 HTMLElement 또는 null을 방출합니다.
   */
  onFocusChange (): Observable<HTMLElement | null> {
    return this.focusSubject.asObservable()
  }

  /**
   * 현재 활성 pane 요소를 쿼리하고, 변경이 있으면 Subject에 방출합니다.
   */
  private updateFocusedElement (): void {
    const focused = document.querySelector('split-tab > .child.focused') as HTMLElement

    if (focused !== this.currentFocused) {
      this.currentFocused = focused || null
      this.focusSubject.next(this.currentFocused)
    }
  }
}

