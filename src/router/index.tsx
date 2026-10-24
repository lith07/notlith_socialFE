import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageLoading } from '@/core/components/page-loading'
import { availableModules, defaultPath } from './registry'

// lazy(): code của mỗi trang chỉ được tải khi người dùng vào trang đó.
const routes = availableModules.flatMap((module) =>
  module.routes.map((route) => ({ ...route, Page: lazy(route.load) })),
)

export function AppRouter() {
  const home = defaultPath ?? '/posts'
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Navigate to={home} replace />} />
        {routes.map(({ path, title, Page }) => (
          <Route key={path} path={path} element={<Page title={title} />} />
        ))}
        <Route path="*" element={<Navigate to={home} replace />} />
      </Routes>
    </Suspense>
  )
}
