/**
 * Thu nhỏ ảnh ngay trên trình duyệt rồi trả về data URL JPEG.
 * Ảnh điện thoại 4–8 MB còn khoảng 150–300 KB, đủ nhỏ để lưu thẳng vào JSON Server.
 */
export async function resizeImage(file: File, maxSize = 1200, quality = 0.82): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Chỉ chọn được file ảnh.')
  if (file.size > 10 * 1024 * 1024) throw new Error('Ảnh tối đa 10 MB.')

  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Trình duyệt không xử lý được ảnh này.')
  context.fillStyle = '#ffffff' // nền trắng cho ảnh PNG trong suốt
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  return canvas.toDataURL('image/jpeg', quality)
}
