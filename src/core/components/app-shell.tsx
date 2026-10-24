import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from 'cn'

export type NavItem = { title: string; href: string; icon: LucideIcon }

/** Khung chung: thanh trên cùng với tên app và menu, nội dung trang ở dưới. */
export function AppShell({ items, children }: { items: NavItem[]; children: ReactNode }) {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[110rem] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <span className="flex items-center gap-2 text-base font-extrabold">
            <span aria-hidden className="size-3 rounded-full bg-primary" />
            Greenwich Social
          </span>
          <nav aria-label="Chính">
            <ul className="flex gap-1 rounded-full bg-muted p-1">
              {items.map(({ title, href, icon: Icon }) => (
                <li key={href}>
                  <NavLink
                    to={href}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition',
                        isActive
                          ? 'bg-card text-foreground shadow-soft'
                          : 'text-muted-foreground hover:text-foreground',
                      )
                    }
                  >
                    <Icon aria-hidden className="size-4" />
                    {title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[110rem] px-4 py-8 sm:px-8">{children}</div>
    </div>
  )
}
