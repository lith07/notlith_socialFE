import { MessagesSquare } from 'lucide-react'
import type { AppModule } from '@/core/types/module'

/** Module chat. Chỉ cần tạo file này, registry tự phát hiện và thêm route /chat. */
export default {
  id: 'chat',
  title: 'Trò chuyện',
  order: 20,
  icon: MessagesSquare,
  routes: [
    {
      path: '/chat',
      title: 'Trò chuyện',
      icon: MessagesSquare,
      load: () => import('./pages/chat-page'),
    },
  ],
} satisfies AppModule
