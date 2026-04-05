// tabby-settings의 SettingsTabProvider 타입 선언 (Tabby 실제 API 기준)
declare module 'tabby-settings' {
  export abstract class SettingsTabProvider {
    id: string
    title: string
    icon: string
    weight?: number
    getComponentType(): any
  }
}

