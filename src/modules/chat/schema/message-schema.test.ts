import { describe, expect, it } from 'vitest'
import { nameSchema, textSchema, validateField } from './message-schema'

describe('Quy tắc chat', () => {
  it('trim tên và tin nhắn', () => {
    expect(nameSchema.validateSync('  Mân  ')).toBe('Mân')
    expect(textSchema.validateSync(' Xin chào ')).toBe('Xin chào')
  })

  it('báo lỗi khi trống hoặc quá dài', () => {
    expect(validateField(nameSchema, '   ')).toBe('Nhập tên để vào phòng chat.')
    expect(validateField(nameSchema, 'a'.repeat(41))).toBe('Tên tối đa 40 ký tự.')
    expect(validateField(textSchema, '')).toBe('Tin nhắn đang trống.')
    expect(validateField(textSchema, 'a'.repeat(501))).toBe('Tin nhắn tối đa 500 ký tự.')
    expect(validateField(textSchema, 'ok')).toBe('')
  })
})
