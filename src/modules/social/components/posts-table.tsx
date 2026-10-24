import { Pencil, Sprout, Trash2 } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/core/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/core/components/ui/table'
import type { Post } from '../types/post'

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        published ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'size-1.5 rounded-full',
          published ? 'bg-success-foreground' : 'border border-muted-foreground',
        )}
      />
      {published ? 'Đã xuất bản' : 'Chưa xuất bản'}
    </span>
  )
}

/** Danh sách bài viết. Chỉ hiển thị và báo sự kiện sửa/xóa lên trên; không biết API. */
export function PostsTable({
  posts,
  busy,
  onEdit,
  onDelete,
}: {
  posts: Post[]
  busy: boolean
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-soft">
      <Table className="min-w-[70rem] table-fixed">
        <colgroup>
          <col className="w-14" />
          <col className="w-[32%]" />
          <col />
          <col className="w-40" />
          <col className="w-28" />
        </colgroup>
        <TableHeader className="bg-secondary/60">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-center">#</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="py-14">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="grid size-12 place-items-center rounded-full bg-secondary">
                    <Sprout aria-hidden className="size-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold">Không có bài viết phù hợp.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post, index) => (
              <TableRow key={post.id}>
                <TableCell className="text-center text-muted-foreground tabular-nums">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-3">
                    {post.image && (
                      <img
                        src={post.image}
                        alt=""
                        loading="lazy"
                        className="size-12 shrink-0 rounded-lg border border-border object-cover"
                      />
                    )}
                    <span className="font-bold wrap-anywhere">{post.title}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-pre-wrap text-muted-foreground wrap-anywhere">
                  {post.content}
                </TableCell>
                <TableCell>
                  <StatusBadge published={post.published} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={busy}
                      aria-label={`Sửa ${post.title}`}
                      onClick={() => onEdit(post)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      disabled={busy}
                      aria-label={`Xóa ${post.title}`}
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => onDelete(post)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
