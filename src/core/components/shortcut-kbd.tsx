import type { ShortcutAction } from '@/core/config/shortcuts'
import { Kbd } from '@/core/components/ui/kbd'
import { shortcutLabel } from '@/core/lib/use-shortcut'

/** Nhãn phím tắt đặt trong nút: `<Button>Lưu <ShortcutKbd action="save" /></Button>`. */
export function ShortcutKbd({ action, className }: { action: ShortcutAction; className?: string }) {
  return (
    <Kbd aria-hidden="true" className={className}>
      {shortcutLabel(action)}
    </Kbd>
  )
}
