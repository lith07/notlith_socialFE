import { useState } from 'react'
import { LoaderCircle, SendHorizontal } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { textSchema, validateField } from '../schema/message-schema'

/** Ô soạn tin. Enter để gửi; chỉ xóa nội dung sau khi gửi thành công. */
export function MessageComposer({
  sending,
  onSend,
}: {
  sending: boolean
  onSend: (text: string) => Promise<boolean>
}) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault()
        const message = validateField(textSchema, text)
        setError(message)
        if (message || sending) return
        if (await onSend(text.trim())) setText('')
      }}
      className="grid gap-1"
    >
      <div className="flex items-center gap-2">
        <label htmlFor="chat-text" className="sr-only">
          Tin nhắn
        </label>
        <Input
          id="chat-text"
          autoComplete="off"
          placeholder="Nhắn gì đó…"
          value={text}
          aria-invalid={!!error}
          onChange={(e) => {
            setText(e.target.value)
            if (error) setError('')
          }}
        />
        <Button type="submit" size="icon-sm" className="size-9" disabled={sending} aria-label="Gửi">
          {sending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <SendHorizontal className="size-4" />
          )}
        </Button>
      </div>
      {error && (
        <p role="alert" className="px-4 text-xs text-destructive">
          {error}
        </p>
      )}
    </form>
  )
}
