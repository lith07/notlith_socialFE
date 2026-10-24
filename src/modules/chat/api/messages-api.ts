import { request } from '@/core/api/http-client'
import type { Message, MessageInput } from '../types/message'

/** Repository cho tin nhắn. JSON Server hỗ trợ lọc `id_gte`, nên chỉ cần tải phần tin mới. */
export const messagesApi = {
  /** 50 tin gần nhất, trả về theo thứ tự cũ → mới. */
  recent: async () =>
    (await request<Message[]>('/messages?_sort=id&_order=desc&_limit=50')).reverse(),
  /** Các tin có id lớn hơn `lastId` (dùng khi hỏi định kỳ). */
  after: (lastId: number) =>
    request<Message[]>(`/messages?id_gte=${lastId + 1}&_sort=id&_order=asc`),
  send: (input: MessageInput) =>
    request<Message>('/messages', { method: 'POST', body: JSON.stringify(input) }),
}
