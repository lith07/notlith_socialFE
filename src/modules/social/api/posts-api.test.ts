import { afterEach, describe, expect, it, vi } from 'vitest'
import { postsApi } from './posts-api'

afterEach(() => vi.unstubAllGlobals())

describe('postsApi', () => {
  it('gửi đúng URL, method và body khi tạo bài', async () => {
    const input = { title: 'A', content: 'B', published: false }
    const fetchMock = vi.fn<typeof fetch>(
      async () => ({ ok: true, json: async () => ({ ...input, id: 1 }) }) as Response,
    )
    vi.stubGlobal('fetch', fetchMock)
    await expect(postsApi.create(input)).resolves.toEqual({ ...input, id: 1 })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://127.0.0.1:3001/posts')
    expect(init?.method).toBe('POST')
    expect(JSON.parse(init?.body as string)).toEqual(input)
  })

  it('biến lỗi HTTP thành thông báo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(async () => ({ ok: false, status: 500 }) as Response),
    )
    await expect(postsApi.list()).rejects.toThrow('API trả về lỗi 500')
  })

  it('biến lỗi mạng thành thông báo kết nối', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )
    await expect(postsApi.list()).rejects.toThrow('Không kết nối được API')
  })
})
