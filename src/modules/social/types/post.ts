export type PostInput = {
  title: string
  content: string
  published: boolean
  /** Ảnh đính kèm dạng data URL (đã thu nhỏ ở trình duyệt). `null` = không có ảnh. */
  image?: string | null
}
export type Post = PostInput & { id: number }
