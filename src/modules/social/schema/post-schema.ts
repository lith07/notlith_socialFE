import * as yup from 'yup'

/** Giới hạn độ dài data URL của ảnh (~1,1 MB ảnh thật), để db.json không phình quá lớn. */
export const MAX_IMAGE_CHARS = 1_500_000
const IMAGE_DATA_URL = /^data:image\/(png|jpe?g|webp|gif);base64,/

export const postSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Nhập tiêu đề bài viết.')
    .max(120, 'Tiêu đề tối đa 120 ký tự.'),
  content: yup
    .string()
    .trim()
    .required('Nhập nội dung bài viết.')
    .max(2000, 'Nội dung tối đa 2.000 ký tự.'),
  published: yup
    .boolean()
    .typeError('Chọn trạng thái xuất bản.')
    .defined('Chọn trạng thái xuất bản.'),
  image: yup
    .string()
    .nullable()
    .optional()
    .max(MAX_IMAGE_CHARS, 'Ảnh quá lớn, hãy chọn ảnh khác.')
    .test('image-format', 'File đính kèm không phải ảnh hợp lệ.', (value) =>
      value == null ? true : IMAGE_DATA_URL.test(value),
    ),
})
