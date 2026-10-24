import * as yup from 'yup'

export const nameSchema = yup
  .string()
  .trim()
  .required('Nhập tên để vào phòng chat.')
  .max(40, 'Tên tối đa 40 ký tự.')

export const textSchema = yup
  .string()
  .trim()
  .required('Tin nhắn đang trống.')
  .max(500, 'Tin nhắn tối đa 500 ký tự.')

/** Lấy thông báo lỗi đầu tiên, hoặc chuỗi rỗng nếu hợp lệ. */
export function validateField(schema: yup.StringSchema, value: string) {
  try {
    schema.validateSync(value)
    return ''
  } catch (e) {
    return e instanceof yup.ValidationError ? e.message : 'Giá trị không hợp lệ.'
  }
}
