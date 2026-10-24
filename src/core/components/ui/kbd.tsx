import type * as React from 'react'
import { cn } from 'cn'

/** Nhãn phím tắt. Tự ẩn trong nút trên màn hình nhỏ (không có bàn phím vật lý). */
function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/8 px-1.5 font-sans text-[1.1rem] font-semibold text-current/70 select-none max-sm:in-data-[slot=button]:hidden',
        className,
      )}
      {...props}
    />
  )
}

export { Kbd }
