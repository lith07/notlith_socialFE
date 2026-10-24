import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface ModulePageProps {
  title: string
}

export interface ModuleRoute {
  path: string
  title: string
  icon: LucideIcon
  navigation?: boolean
  /** Trang được tải khi cần (lazy loading), nên trả về một Promise chứa default export. */
  load: () => Promise<{ default: ComponentType<ModulePageProps> }>
}

/** Hợp đồng mà mỗi module nghiệp vụ phải tuân theo để router tự phát hiện. */
export interface AppModule {
  id: string
  title: string
  order: number
  icon: LucideIcon
  enabled?: boolean
  navigation?: boolean
  routes: ModuleRoute[]
}
