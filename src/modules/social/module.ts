import { FileText } from 'lucide-react'
import type { AppModule } from '@/core/types/module'

/** Khai báo module. Router tự tìm file này, không cần import thủ công ở đâu cả. */
export default {
  id: 'social',
  title: 'Bài viết',
  order: 10,
  icon: FileText,
  routes: [
    { path: '/posts', title: 'Bài viết', icon: FileText, load: () => import('./pages/posts-page') },
  ],
} satisfies AppModule
