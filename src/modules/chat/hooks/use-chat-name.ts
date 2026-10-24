import { useState } from 'react'

const KEY = 'gw-social.chat-name'

function read() {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

/** Tên hiển thị trong chat, nhớ trên trình duyệt này (ứng dụng chưa có đăng nhập). */
export function useChatName() {
  const [name, setName] = useState(read)

  const save = (value: string) => {
    setName(value)
    try {
      if (value) localStorage.setItem(KEY, value)
      else localStorage.removeItem(KEY)
    } catch {
      // Trình duyệt chặn lưu trữ: tên chỉ giữ trong phiên này.
    }
  }

  return { name, setName: save }
}
