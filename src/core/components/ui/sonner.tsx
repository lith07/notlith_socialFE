import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      theme="light"
      position="top-right"
      closeButton
      richColors
      toastOptions={{ style: { borderRadius: '16px', fontFamily: 'inherit' } }}
    />
  )
}
