/**
 * Cấu hình phím tắt dùng chung. Muốn đổi phím chỉ sửa ở đây:
 * bộ bắt phím (`useShortcut`), nhãn trên nút (`ShortcutKbd`) và `aria-keyshortcuts` đều đọc từ file này.
 */
export interface ShortcutDefinition {
  /** Giá trị `KeyboardEvent.key` (không phân biệt hoa thường). */
  key: string
  /** Nhãn hiển thị trên nút. */
  label: string
}

export const SHORTCUTS = {
  /** Thêm mới trên trang danh sách. */
  create: { key: 'F4', label: 'F4' },
  /** Lưu trong form. */
  save: { key: 'F2', label: 'F2' },
  /** Hủy/đóng form. */
  cancel: { key: 'Escape', label: 'Esc' },
} satisfies Record<string, ShortcutDefinition>

export type ShortcutAction = keyof typeof SHORTCUTS
