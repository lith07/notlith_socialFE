import { Plus, Search, Sparkles } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { ShortcutKbd } from '@/core/components/shortcut-kbd'
import { shortcutAria } from '@/core/lib/use-shortcut'

/** Thanh công cụ: tiêu đề trang, ô tìm kiếm và nút thêm. Chỉ nhận props, không gọi API. */
export function PostsToolbar({
  search,
  busy,
  onSearch,
  onCreate,
}: {
  search: string
  busy: boolean
  onSearch: (value: string) => void
  onCreate: () => void
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          Bài viết
          <Sparkles aria-hidden className="size-5 text-primary" />
        </h1>
        <p className="text-sm text-muted-foreground">Góc nhỏ để cùng học hỏi và chia sẻ.</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-72">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            aria-label="Tìm kiếm bài viết"
            placeholder="Tìm tiêu đề, nội dung…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button disabled={busy} onClick={onCreate} aria-keyshortcuts={shortcutAria('create')}>
          <Plus aria-hidden className="size-4" />
          Thêm bài viết
          <ShortcutKbd action="create" />
        </Button>
      </div>
    </header>
  )
}
