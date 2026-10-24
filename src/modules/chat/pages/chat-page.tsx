import { Loader2, MessagesSquare } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/core/components/ui/button'
import { useChat } from '../hooks/use-chat'
import { useChatName } from '../hooks/use-chat-name'
import { MessageComposer } from '../components/message-composer'
import { MessageList } from '../components/message-list'
import { NameGate } from '../components/name-gate'

/** Trang container của chat: chọn tên, hiển thị phòng chung, gửi tin. */
export default function ChatPage() {
  const { name, setName } = useChatName()
  const { messages, loading, error, sending, load, send } = useChat()

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            Trò chuyện
            <MessagesSquare aria-hidden className="size-5 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground">Phòng chung cho cả lớp.</p>
        </div>
        {name && (
          <p className="text-sm text-muted-foreground">
            Bạn là <span className="font-bold text-foreground">{name}</span> ·{' '}
            <button
              type="button"
              className="cursor-pointer font-semibold text-primary underline-offset-4 hover:underline"
              onClick={() => setName('')}
            >
              Đổi tên
            </button>
          </p>
        )}
      </header>

      {!name ? (
        <NameGate onEnter={setName} />
      ) : loading ? (
        <div
          role="status"
          className="flex items-center justify-center gap-2 py-16 text-muted-foreground"
        >
          <Loader2 className="size-4 animate-spin text-primary" />
          Đang tải tin nhắn…
        </div>
      ) : error ? (
        <div role="alert" className="rounded-xl bg-card p-8 text-center shadow-soft">
          <p className="mb-4 text-destructive">{error}</p>
          <Button variant="outline" onClick={() => void load()}>
            Thử lại
          </Button>
        </div>
      ) : (
        <section className="flex h-[62svh] min-h-[32rem] flex-col overflow-hidden rounded-xl bg-card shadow-soft">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <MessageList messages={messages} me={name} />
          </div>
          <div className="border-t border-border p-3 sm:px-6">
            <MessageComposer
              sending={sending}
              onSend={async (text) => {
                const result = await send(name, text)
                if (!result.ok) toast.error(result.error)
                return result.ok
              }}
            />
          </div>
        </section>
      )}
    </main>
  )
}
