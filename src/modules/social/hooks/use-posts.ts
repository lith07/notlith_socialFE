import { useCallback, useEffect, useRef, useState } from 'react'
import { postsApi } from '../api/posts-api'
import type { Post, PostInput } from '../types/post'

/** Kết quả của một thao tác thay đổi dữ liệu. Hook trả lỗi về, không tự hiện thông báo. */
export type MutationResult = { ok: true } | { ok: false; error: string }

const messageOf = (e: unknown, fallback: string) => (e instanceof Error ? e.message : fallback)

/**
 * Tầng application: các use case của bài viết (tải, thêm, sửa, xóa).
 * Chỉ biết `postsApi` và kiểu dữ liệu; không biết gì về giao diện hay toast.
 */
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  /** Khóa đồng bộ: chặn gửi lặp ngay cả trước khi React kịp render lại `busy`. */
  const locked = useRef(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setPosts(await postsApi.list())
    } catch (e) {
      setError(messageOf(e, 'Không thể tải bài viết.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  /** Chạy một thao tác; state chỉ được cập nhật sau khi API trả thành công. */
  async function run(action: () => Promise<void>): Promise<MutationResult> {
    if (locked.current) return { ok: false, error: 'Đang xử lý thao tác trước, vui lòng đợi.' }
    locked.current = true
    setBusy(true)
    try {
      await action()
      return { ok: true }
    } catch (e) {
      return { ok: false, error: messageOf(e, 'Không thể lưu thay đổi.') }
    } finally {
      locked.current = false
      setBusy(false)
    }
  }

  const create = (input: PostInput) =>
    run(async () => {
      const post = await postsApi.create(input)
      setPosts((old) => [post, ...old])
    })

  const update = (id: number, input: PostInput) =>
    run(async () => {
      const post = await postsApi.update(id, input)
      setPosts((old) => old.map((p) => (p.id === id ? post : p)))
    })

  const remove = (id: number) =>
    run(async () => {
      await postsApi.remove(id)
      setPosts((old) => old.filter((p) => p.id !== id))
    })

  return { posts, loading, error, busy, load, create, update, remove }
}
