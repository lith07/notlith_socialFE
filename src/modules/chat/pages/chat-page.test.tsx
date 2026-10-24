import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatPage from './chat-page'
import type { Message } from '../types/message'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  localStorage.clear()
})

describe('Chat', () => {
  it('hỏi tên, gửi tin và hiển thị tin vừa gửi', async () => {
    const sent: Message[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, options?: RequestInit) => {
        if (options?.method === 'POST') {
          const message = { ...JSON.parse(options.body as string), id: sent.length + 1 }
          sent.push(message)
          return { ok: true, json: async () => message }
        }
        return { ok: true, json: async () => [] }
      }),
    )
    const user = userEvent.setup()
    render(<ChatPage />)

    await user.click(screen.getByRole('button', { name: 'Vào phòng' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Nhập tên để vào phòng chat.')

    await user.type(screen.getByLabelText('Tên của bạn'), '  Mân ')
    await user.click(screen.getByRole('button', { name: 'Vào phòng' }))
    expect(
      await screen.findByText('Chưa có tin nhắn nào. Chào mọi người một câu nhé!'),
    ).toBeVisible()
    expect(localStorage.getItem('gw-social.chat-name')).toBe('Mân')

    await user.type(screen.getByLabelText('Tin nhắn'), 'Xin chào cả lớp{Enter}')
    expect(await screen.findByText('Xin chào cả lớp')).toBeInTheDocument()
    expect(sent).toHaveLength(1)
    expect(sent[0]).toMatchObject({ author: 'Mân', text: 'Xin chào cả lớp' })
    await waitFor(() => expect(screen.getByLabelText('Tin nhắn')).toHaveValue(''))
  })
})
