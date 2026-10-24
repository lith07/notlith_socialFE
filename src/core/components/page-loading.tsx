import { LoaderCircle } from 'lucide-react'

export function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[40rem] flex-col items-center justify-center gap-3 text-center"
    >
      <div className="grid size-12 place-items-center rounded-full bg-secondary">
        <LoaderCircle
          aria-hidden="true"
          className="size-6 animate-spin text-primary motion-reduce:animate-none"
        />
      </div>
      <p className="text-sm font-semibold text-muted-foreground">Đang tải nội dung</p>
    </div>
  )
}
