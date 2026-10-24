import { useEffect, useRef } from 'react'
import { Sprout } from 'lucide-react'
import { cn } from 'cn'
import type { Message } from '../types/message'

const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

/** Danh sách tin nhắn dạng bong bóng. Tự cuộn xuống cuối khi có tin mới. */
export function MessageList({ messages, me }: { messages: Message[]; me: string }) {
  const endRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  if (messages.length === 0)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <div className="grid size-12 place-items-center rounded-full bg-secondary">
          <Sprout aria-hidden className="size-6 text-primary" />
        </div>
        <p className="text-sm font-semibold">Chưa có tin nhắn nào. Chào mọi người một câu nhé!</p>
      </div>
    )

  return (
    <ol aria-label="Danh sách tin nhắn" className="flex flex-col gap-1.5">
      {messages.map((message, index) => {
        const mine = message.author === me
        const showAuthor = !mine && messages[index - 1]?.author !== message.author
        return (
          <li key={message.id} className={cn('flex flex-col', mine ? 'items-end' : 'items-start')}>
            {showAuthor && (
              <span className="mt-2 px-3 text-xs font-bold text-muted-foreground">
                {message.author}
              </span>
            )}
            <div
              className={cn(
                'max-w-[75%] rounded-xl px-3.5 py-2 whitespace-pre-wrap wrap-anywhere',
                mine
                  ? 'rounded-br-sm bg-primary text-primary-foreground'
                  : 'rounded-bl-sm bg-muted text-foreground',
              )}
            >
              {message.text}
              <span className="ml-2 align-bottom text-[1.1rem] opacity-60">
                {timeOf(message.createdAt)}
              </span>
            </div>
          </li>
        )
      })}
      <li ref={endRef} aria-hidden />
    </ol>
  )
}
