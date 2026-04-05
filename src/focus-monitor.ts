import { Injectable } from '@angular/core'
import { Subject, Observable } from 'rxjs'

/**
 * FocusMonitor: Tabby split-tab의 활성(focused) 상태 변화와 분할 상태를 감지합니다.
 *
 * 분할 판정 방식:
 *   - split-tab 내 직접 자식 .child 요소 개수 >= 2 → hp-split 클래스 부여
 *   - 개수 < 2 → hp-single 클래스 부여 (하이라이팅 비활성)
 *
 * CSS는 split-tab.hp-split 선택자로만 하이라이트를 적용하므로
 * 단일 pane 상태에서는 절대 하이라이트가 나타나지 않습니다.
 */
@Injectable()
export class FocusMonitor {
  private focusSubject = new Subject<HTMLElement | null>()
  private observer: MutationObserver | null = null
  private currentFocused: HTMLElement | null = null

  /**
   * MutationObserver를 시작합니다.
   * document.body 전체를 감시하여 아래 변화를 모두 감지합니다:
   *   - .child 요소의 class 변화 (focused 추가/제거)
   *   - split-tab 내 자식 추가/제거 (분할/합치기)
   *   - 새 split-tab 요소 동적 추가
   */
  startMonitoring (): void {
    if (this.observer) return

    this.observer = new MutationObserver(() => {
      this.updateSplitClasses()
      this.updateFocusedElement()
    })

    // body 전체를 단일 observer로 감시 (class 변화 + 자식 추가/제거 모두 포함)
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    })

    // 초기 상태 즉시 설정
    this.updateSplitClasses()
    this.updateFocusedElement()
  }

  /**
   * MutationObserver를 정지하고 리소스를 정리합니다.
   * hp-split / hp-single 클래스도 모두 제거합니다.
   */
  stopMonitoring (): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    this.currentFocused = null
    document.querySelectorAll('split-tab').forEach(tab => {
      tab.classList.remove('hp-split', 'hp-single')
    })
  }

  /**
   * 포커스 변경 Observable을 반환합니다.
   */
  onFocusChange (): Observable<HTMLElement | null> {
    return this.focusSubject.asObservable()
  }

  /**
   * 모든 split-tab에 hp-split / hp-single 클래스를 토글합니다.
   *   직접 자식 .child 개수 >= 2 → hp-split (하이라이팅 활성)
   *   직접 자식 .child 개수  < 2 → hp-single (하이라이팅 비활성)
   */
  private updateSplitClasses (): void {
    document.querySelectorAll('split-tab').forEach(tab => {
      const paneCount = tab.querySelectorAll(':scope > .child').length
      const isSplit = paneCount >= 2
      tab.classList.toggle('hp-split', isSplit)
      tab.classList.toggle('hp-single', !isSplit)
    })
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
