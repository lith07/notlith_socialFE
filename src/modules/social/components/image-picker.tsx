import { useRef, useState } from 'react'
import { ImagePlus, LoaderCircle, RefreshCw, X } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/core/components/ui/button'
import { resizeImage } from '@/core/lib/resize-image'

/** Chọn hoặc kéo-thả một ảnh, xem trước, đổi hoặc gỡ ảnh. Giá trị là data URL hoặc null. */
export function ImagePicker({
  id,
  value,
  disabled,
  error,
  onChange,
}: {
  id: string
  value: string | null | undefined
  disabled?: boolean
  error?: string
  onChange: (value: string | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)
  const [localError, setLocalError] = useState('')
  const locked = disabled || processing

  async function pick(file: File | undefined) {
    if (!file) return
    setLocalError('')
    setProcessing(true)
    try {
      onChange(await resizeImage(file))
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'Không đọc được ảnh.')
    } finally {
      setProcessing(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const message = localError || error

  return (
    <div className="grid gap-2">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={locked}
        onChange={(e) => void pick(e.target.files?.[0])}
      />

      {value ? (
        <div className="relative w-fit">
          <img
            src={value}
            alt="Ảnh đính kèm"
            className="max-h-56 rounded-lg border border-border object-contain"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="secondary"
              size="icon-sm"
              disabled={locked}
              aria-label="Đổi ảnh"
              onClick={() => inputRef.current?.click()}
            >
              <RefreshCw className="size-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              disabled={locked}
              aria-label="Gỡ ảnh"
              onClick={() => onChange(null)}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            if (!locked) void pick(e.dataTransfer.files?.[0])
          }}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-input bg-muted/40 px-4 py-6 text-center transition hover:border-primary hover:bg-secondary/40',
            locked && 'pointer-events-none opacity-60',
          )}
        >
          {processing ? (
            <LoaderCircle aria-hidden className="size-6 animate-spin text-primary" />
          ) : (
            <ImagePlus aria-hidden className="size-6 text-primary" />
          )}
          <span className="text-sm font-semibold">
            {processing ? 'Đang xử lý ảnh…' : 'Chọn ảnh hoặc kéo thả vào đây'}
          </span>
          <span className="text-xs text-muted-foreground">JPG, PNG, WEBP · tối đa 10 MB</span>
        </label>
      )}

      {message && (
        <p role="alert" className="text-xs text-destructive">
          {message}
        </p>
      )}
    </div>
  )
}
