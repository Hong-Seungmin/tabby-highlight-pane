import {SettingsTabProvider} from "tabby-settings";
import {HighlightPaneSettingsComponent} from "./components/highlight-pane-settings.component";

/**
 * Tabby 설정 패널에 "Highlight Pane" 메뉴 항목을 등록합니다.
 * SettingsTabProvider를 통해 설정 사이드바에 표시됩니다.
 */
export class HighlightPaneSettingsTabProvider extends SettingsTabProvider {
    id = 'highlight-pane'
    icon = 'fas fa-highlighter'
    title = 'Highlight Pane'
    weight = 50

    getComponentType() {
        return HighlightPaneSettingsComponent
    }
}