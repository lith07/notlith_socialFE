import { Save, Trash2 } from 'lucide-react'
import { cn } from 'cn'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export type ActionModalProps = {
  open: boolean
  title: string
  description: string
  busy: boolean
  error?: string | null
  onCancel: () => void
  onConfirm: () => void
  cancelLabel?: string
  confirmLabel?: string
  busyLabel?: string
}

export function ConfirmModal(props: ActionModalProps) {
  return <ActionModal {...props} destructive={false} />
}

export function DangerModal(props: ActionModalProps) {
  return <ActionModal {...props} destructive />
}

/** Hộp thoại xác nhận. Không đóng khi bấm ra ngoài, và không đóng khi đang xử lý. */
function ActionModal({
  open,
  title,
  description,
  destructive,
  busy,
  error,
  onCancel,
  onConfirm,
  cancelLabel = 'Hủy',
  confirmLabel = 'Xác nhận',
  busyLabel = 'Đang xử lý…',
}: ActionModalProps & { destructive: boolean }) {
  const Icon = destructive ? Trash2 : Save
  return (
    <Dialog
      open={open}
      disablePointerDismissal
      onOpenChange={(next, details) => {
        if (busy) {
          details.cancel()
          return
        }
        if (!next) onCancel()
      }}
    >
      <DialogContent showCloseButton={false} className="text-center">
        <div
          className={cn(
            'mx-auto grid size-16 place-items-center rounded-full',
            destructive ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-primary',
          )}
        >
          <Icon aria-hidden="true" className="size-7" strokeWidth={1.75} />
        </div>
        <DialogHeader className="items-center text-center">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {error && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <DialogFooter className="mt-2 flex-row gap-3">
          <Button variant="secondary" className="flex-1" disabled={busy} onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            className={cn(
              'flex-1',
              destructive && 'bg-destructive text-white hover:bg-destructive/85',
            )}
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? busyLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
