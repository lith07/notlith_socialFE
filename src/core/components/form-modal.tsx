import type { ReactNode } from 'react'
import { Dialog, DialogContent } from '@/core/components/ui/dialog'

interface FormModalProps {
  isOpen: boolean
  busy: boolean
  labelledBy: string
  onClose: () => void
  children: ReactNode
}

/** Khung hộp thoại cho form. Khi đang lưu (`busy`) thì không cho đóng. */
export function FormModal({ isOpen, busy, labelledBy, onClose, children }: FormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open, details) => {
        if (busy) {
          details.cancel()
          return
        }
        if (!open) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        aria-labelledby={labelledBy}
        className="gap-0 overflow-hidden p-0 sm:max-w-[60rem]"
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}
