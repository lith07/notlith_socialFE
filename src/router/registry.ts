import type { AppModule } from '@/core/types/module'
import type { NavItem } from '@/core/components/app-shell'

// Vite quét các file modules/*/module.ts lúc build. Router không import cụ thể module nào,
// nên thêm module mới chỉ cần tạo thư mục mới (nguyên tắc open/closed).
const discovered = import.meta.glob<AppModule>('../modules/*/module.ts', {
  eager: true,
  import: 'default',
})

export const availableModules = Object.values(discovered)
  .filter((module) => module.enabled !== false)
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))

// Kiểm tra cấu hình ngay khi khởi động: báo lỗi sớm thay vì để route trùng âm thầm ghi đè nhau.
const ids = new Set<string>()
const paths = new Set<string>()
for (const module of availableModules) {
  if (ids.has(module.id)) throw new Error(`Duplicate module ID: ${module.id}`)
  ids.add(module.id)
  for (const route of module.routes) {
    if (!route.path.startsWith('/') || route.path === '/' || route.path === '*')
      throw new Error(`Invalid module route: ${route.path}`)
    if (paths.has(route.path)) throw new Error(`Duplicate route: ${route.path}`)
    paths.add(route.path)
  }
}

/** Các mục menu, sinh tự động từ module và route được phép hiện trong điều hướng. */
export const navigation: NavItem[] = availableModules
  .filter((module) => module.navigation !== false)
  .flatMap((module) => module.routes.filter((route) => route.navigation !== false))
  .map((route) => ({ title: route.title, href: route.path, icon: route.icon }))

/** Trang mặc định: mục menu đầu tiên. */
export const defaultPath = navigation[0]?.href ?? null
