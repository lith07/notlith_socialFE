import { useCallback, useEffect, useRef, useState } from 'react'
import { messagesApi } from '../api/messages-api'
import type { Message } from '../types/message'

export type SendResult = { ok: true } | { ok: false; error: string }

/**
 * Tầng application của chat: tải tin gần nhất, hỏi tin mới định kỳ (polling) và gửi tin.
 * JSON Server không có WebSocket, nên "thời gian thực" ở đây là hỏi lại mỗi vài giây.
 */
export function useChat(pollMs = 2500) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const lastId = useRef(0)
  const polling = useRef(false)

  /** Gộp tin mới vào danh sách, bỏ trùng theo id (tin vừa gửi có thể về lại qua polling). */
  const merge = useCallback((incoming: Message[]) => {
    if (incoming.length === 0) return
    lastId.current = Math.max(lastId.current, ...incoming.map((m) => m.id))
    setMessages((old) => {
      const known = new Set(old.map((m) => m.id))
      const fresh = incoming.filter((m) => !known.has(m.id))
      return fresh.length ? [...old, ...fresh].sort((a, b) => a.id - b.id) : old
    })
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const recent = await messagesApi.recent()
      lastId.current = 0
      setMessages([])
      merge(recent)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được tin nhắn.')
    } finally {
      setLoading(false)
    }
  }, [merge])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (loading || error) return
    const timer = setInterval(async () => {
      if (polling.current || document.hidden) return
      polling.current = true
      try {
        merge(await messagesApi.after(lastId.current))
      } catch {
        // Lỗi mạng tạm thời: bỏ qua, lần hỏi sau sẽ thử lại.
      } finally {
        polling.current = false
      }
    }, pollMs)
    return () => clearInterval(timer)
  }, [loading, error, pollMs, merge])

  async function send(author: string, text: string): Promise<SendResult> {
    if (sending) return { ok: false, error: 'Đang gửi tin trước.' }
    setSending(true)
    try {
      merge([await messagesApi.send({ author, text, createdAt: new Date().toISOString() })])
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'Chưa gửi được tin nhắn.' }
    } finally {
      setSending(false)
    }
  }

  return { messages, loading, error, sending, load, send }
}
