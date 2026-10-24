import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { DangerModal } from '@/core/components/action-modal'
import { Button } from '@/core/components/ui/button'
import { useShortcut } from '@/core/lib/use-shortcut'
import { usePosts } from '../hooks/use-posts'
import { PostForm } from '../components/post-form'
import { PostsToolbar } from '../components/posts-toolbar'
import { PostsTable } from '../components/posts-table'
import type { Post } from '../types/post'

/** Chuyển về chữ thường, bỏ dấu tiếng Việt: "Chào" và "chao" khớp nhau khi tìm kiếm. */
const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')

/**
 * Trang container: giữ trạng thái giao diện (đang mở form nào, đang xóa bài nào, từ khóa)
 * và nối các component với use case của `usePosts`. Trang không gọi API trực tiếp.
 */
export default function PostsPage() {
  const { posts, loading, error, busy, load, create, update, remove } = usePosts()
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<Post | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Post | null>(null)
  const [saveError, setSaveError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const editing = editor && editor !== 'new' ? editor : null
  const ready = !loading && !error && !busy

  const openCreate = () => {
    if (!ready) return
    setSaveError('')
    setEditor('new')
  }
  useShortcut('create', openCreate, { enabled: ready, ignoreWhenDialogOpen: true })

  const keyword = normalize(search.trim())
  const visible = posts.filter((p) => normalize(p.title + ' ' + p.content).includes(keyword))

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[110rem] flex-col gap-6 px-4 py-8 sm:px-8">
      <PostsToolbar search={search} busy={!ready} onSearch={setSearch} onCreate={openCreate} />

      {loading ? (
        <div
          role="status"
          className="flex items-center justify-center gap-2 py-16 text-muted-foreground"
        >
          <Loader2 className="size-4 animate-spin text-primary" />
          Đang tải bài viết…
        </div>
      ) : error ? (
        <div role="alert" className="rounded-xl bg-card p-8 text-center shadow-soft">
          <p className="mb-4 text-destructive">{error}</p>
          <Button variant="outline" onClick={() => void load()}>
            Thử lại
          </Button>
        </div>
      ) : (
        <PostsTable
          posts={visible}
          busy={busy}
          onEdit={(post) => {
            setSaveError('')
            setEditor(post)
          }}
          onDelete={(post) => {
            setDeleteError('')
            setDeleting(post)
          }}
        />
      )}

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {!loading && !error && `${visible.length} / ${posts.length} bài viết`}
      </p>

      <PostForm
        open={editor !== null}
        post={editing}
        busy={busy}
        error={saveError}
        onClose={() => setEditor(null)}
        onSave={async (input) => {
          const result = editing ? await update(editing.id, input) : await create(input)
          if (result.ok) {
            setEditor(null)
            toast.success(editing ? 'Đã cập nhật bài viết.' : 'Đã thêm bài viết.')
          } else {
            toast.error(result.error)
            setSaveError('Chưa lưu được bài viết. Nội dung vẫn được giữ lại để bạn thử lại.')
          }
        }}
      />

      <DangerModal
        open={deleting !== null}
        busy={busy}
        error={deleteError}
        title="Xóa bài viết?"
        description={`Bạn có chắc muốn xóa bài viết “${deleting?.title ?? ''}”?`}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return
          const result = await remove(deleting.id)
          if (result.ok) {
            setDeleting(null)
            toast.success('Đã xóa bài viết.')
          } else {
            toast.error(result.error)
            setDeleteError('Chưa xóa được bài viết. Vui lòng thử lại.')
          }
        }}
      />
    </main>
  )
}
