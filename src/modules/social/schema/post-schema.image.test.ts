import { describe, expect, it } from 'vitest'
import { MAX_IMAGE_CHARS, postSchema } from './post-schema'

const base = { title: 'Tiêu đề', content: 'Nội dung', published: true }

describe('Ảnh đính kèm bài viết', () => {
  it('cho phép không có ảnh hoặc ảnh null', async () => {
    await expect(postSchema.validate(base)).resolves.toEqual(base)
    await expect(postSchema.validate({ ...base, image: null })).resolves.toEqual({
      ...base,
      image: null,
    })
  })

  it('nhận ảnh dạng data URL', async () => {
    const image = 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
    await expect(postSchema.validate({ ...base, image })).resolves.toMatchObject({ image })
  })

  it.each([
    'https://example.com/a.jpg',
    'data:text/plain;base64,SGVsbG8=',
    'data:image/jpeg;base64,' + 'a'.repeat(MAX_IMAGE_CHARS),
  ])('từ chối ảnh không hợp lệ hoặc quá lớn', async (image) => {
    await expect(postSchema.validate({ ...base, image })).rejects.toThrow()
  })
})
