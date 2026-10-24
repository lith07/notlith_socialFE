import { useEffect, type ReactNode } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AlertCircle, LoaderCircle, Save } from 'lucide-react'
import { cn } from 'cn'
import { FormModal } from '@/core/components/form-modal'
import { ShortcutKbd } from '@/core/components/shortcut-kbd'
import { Button } from '@/core/components/ui/button'
import { shortcutAria, useShortcut } from '@/core/lib/use-shortcut'
import { postSchema } from '../schema/post-schema'
import type { Post, PostInput } from '../types/post'
import { ImagePicker } from './image-picker'

const EMPTY: PostInput = { title: '', content: '', published: false, image: null }

function FormRow({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-bold">
        {label}
        {required && <span className="text-primary"> *</span>}
      </label>
      {children}
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="flex items-center gap-1 text-xs text-destructive">
      <AlertCircle aria-hidden className="size-3.5 shrink-0" />
      {message}
    </p>
  ) : null
}

const fieldClass = (invalid: boolean) =>
  cn(
    'w-full rounded-lg border bg-card px-4 text-sm transition outline-none placeholder:text-muted-foreground focus-visible:ring-3 disabled:opacity-50',
    invalid
      ? 'border-destructive focus-visible:ring-destructive/20'
      : 'border-input hover:border-primary/60 focus-visible:border-primary focus-visible:ring-ring/30',
  )

/** Form thêm/sửa. Kiểm tra dữ liệu bằng schema của tầng domain, rồi giao kết quả cho `onSave`. */
export function PostForm({
  open,
  post,
  busy,
  error,
  onClose,
  onSave,
}: {
  open: boolean
  post: Post | null
  busy: boolean
  error: string
  onClose: () => void
  onSave: (input: PostInput) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, submitCount },
  } = useForm<PostInput>({ resolver: yupResolver(postSchema), defaultValues: EMPTY })
  const published = useWatch({ control, name: 'published' })

  // Mỗi lần mở form: điền dữ liệu bài đang sửa, hoặc để trống nếu thêm mới.
  useEffect(() => {
    if (open)
      reset(
        post
          ? {
              title: post.title,
              content: post.content,
              published: post.published,
              image: post.image ?? null,
            }
          : EMPTY,
      )
  }, [open, post, reset])

  const close = () => {
    if (!busy) onClose()
  }
  const save = handleSubmit(async (values) => {
    if (!busy) await onSave(values)
  })
  useShortcut('cancel', close, { enabled: open })
  useShortcut('save', () => void save(), { enabled: open })

  const errorCount = Object.keys(errors).length

  return (
    <FormModal isOpen={open} busy={busy} onClose={close} labelledBy="post-form-title">
      <div className="flex max-h-[calc(100svh-3.2rem)] flex-col">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <h3 id="post-form-title" className="text-lg font-extrabold">
              {post ? 'Sửa bài viết' : 'Thêm bài viết'}
            </h3>
            {submitCount > 0 && errorCount > 0 && (
              <span aria-live="polite" className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="size-3.5" />
                {errorCount} lỗi cần kiểm tra
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={busy}
              onClick={close}
              aria-keyshortcuts={shortcutAria('cancel')}
            >
              Hủy
              <ShortcutKbd action="cancel" />
            </Button>
            <Button
              disabled={busy}
              onClick={() => void save()}
              aria-keyshortcuts={shortcutAria('save')}
            >
              {busy ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              {busy ? 'Đang lưu…' : 'Lưu'}
              {!busy && <ShortcutKbd action="save" />}
            </Button>
          </div>
        </header>

        {error && (
          <p
            role="alert"
            className="mx-6 mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <form
          noValidate
          onSubmit={save}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5"
        >
          <FormRow label="Tiêu đề" htmlFor="post-title" required>
            <input
              id="post-title"
              autoComplete="off"
              placeholder="Hôm nay mình học được…"
              disabled={busy}
              {...register('title')}
              aria-invalid={!!errors.title}
              aria-describedby="post-title-error"
              className={cn(fieldClass(!!errors.title), 'h-10')}
            />
            <FieldError id="post-title-error" message={errors.title?.message} />
          </FormRow>

          <FormRow label="Nội dung" htmlFor="post-content" required>
            <textarea
              id="post-content"
              rows={5}
              placeholder="Viết vài dòng chia sẻ với mọi người"
              disabled={busy}
              {...register('content')}
              aria-invalid={!!errors.content}
              aria-describedby="post-content-error"
              className={cn(fieldClass(!!errors.content), 'resize-y py-2.5 leading-relaxed')}
            />
            <FieldError id="post-content-error" message={errors.content?.message} />
          </FormRow>

          <FormRow label="Ảnh" htmlFor="post-image">
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ImagePicker
                  id="post-image"
                  value={field.value}
                  disabled={busy}
                  error={errors.image?.message}
                  onChange={field.onChange}
                />
              )}
            />
          </FormRow>

          <FormRow label="Xuất bản" htmlFor="post-published">
            <label
              htmlFor="post-published"
              className="inline-flex w-fit cursor-pointer items-center gap-3"
            >
              <span className="relative inline-flex">
                <input
                  type="checkbox"
                  id="post-published"
                  disabled={busy}
                  {...register('published')}
                  className="peer sr-only"
                />
                <span className="h-6 w-11 rounded-full bg-muted transition-colors peer-checked:bg-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40 peer-disabled:opacity-50" />
                <span className="absolute top-1 left-1 size-4 rounded-full bg-card shadow-soft transition-transform peer-checked:translate-x-5" />
              </span>
              <span className="text-sm font-semibold">
                {published ? 'Đã xuất bản' : 'Chưa xuất bản'}
              </span>
            </label>
          </FormRow>
        </form>
      </div>
    </FormModal>
  )
}
