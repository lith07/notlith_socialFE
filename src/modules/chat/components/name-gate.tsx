import { useState } from 'react'
import { MessageCircleHeart } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { nameSchema, validateField } from '../schema/message-schema'

/** Hỏi tên trước khi vào phòng chat. */
export function NameGate({ onEnter }: { onEnter: (name: string) => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        const message = validateField(nameSchema, value)
        setError(message)
        if (!message) onEnter(value.trim())
      }}
      className="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-xl bg-card p-8 text-center shadow-soft"
    >
      <div className="grid size-16 place-items-center rounded-full bg-secondary">
        <MessageCircleHeart aria-hidden className="size-8 text-primary" />
      </div>
      <div>
        <h2 className="text-lg font-extrabold">Bạn tên gì nhỉ?</h2>
        <p className="text-sm text-muted-foreground">Tên này hiện bên cạnh tin nhắn của bạn.</p>
      </div>
      <div className="grid w-full gap-1.5 text-left">
        <label htmlFor="chat-name" className="sr-only">
          Tên của bạn
        </label>
        <Input
          id="chat-name"
          autoFocus
          autoComplete="nickname"
          placeholder="Ví dụ: Mân"
          value={value}
          aria-invalid={!!error}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError('')
          }}
        />
        {error && (
          <p role="alert" className="px-2 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full">
        Vào phòng
      </Button>
    </form>
  )
}
