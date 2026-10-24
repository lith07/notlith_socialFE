import { useEffect, useRef } from 'react'
import { SHORTCUTS, type ShortcutAction } from '@/core/config/shortcuts'

/** Nhãn hiển thị của phím tắt. */
export function shortcutLabel(action: ShortcutAction) {
  return SHORTCUTS[action].label
}

/** Giá trị cho thuộc tính `aria-keyshortcuts` (trình đọc màn hình đọc được phím tắt). */
export function shortcutAria(action: ShortcutAction) {
  return SHORTCUTS[action].key
}

type KeyLike = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>

export function matchesShortcut(event: KeyLike, action: ShortcutAction) {
  if (event.key?.toLowerCase() !== SHORTCUTS[action].key.toLowerCase()) return false
  return !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey
}

interface ShortcutOptions {
  enabled?: boolean
  /** Bỏ qua khi đang có dialog mở (dùng cho phím cấp trang như F4). */
  ignoreWhenDialogOpen?: boolean
}

/**
 * Bắt phím tắt trên toàn trang. Giữ phím (repeat) hoặc đang gõ bộ gõ tiếng Việt (IME)
 * thì không kích hoạt lại thao tác.
 */
export function useShortcut(
  action: ShortcutAction,
  handler: () => void,
  { enabled = true, ignoreWhenDialogOpen = false }: ShortcutOptions = {},
) {
  // Giữ handler mới nhất trong ref để không phải gắn lại listener mỗi lần render.
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing || !matchesShortcut(event, action)) return
      if (ignoreWhenDialogOpen && document.querySelector('[role="dialog"], [role="alertdialog"]'))
        return
      event.preventDefault()
      if (!event.repeat) handlerRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [action, enabled, ignoreWhenDialogOpen])
}
