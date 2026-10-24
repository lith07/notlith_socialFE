# Greenwich Social — bản dựng lại

Ứng dụng mạng xã hội nhỏ bằng React 19 + TypeScript, API giả lập bằng JSON Server. Giao diện theme **Peach and navy**: dễ thương, tối giản.

- **Bài viết** (`/posts`): xem, tìm kiếm (không phân biệt dấu), thêm, sửa, xóa, xuất bản, **đính kèm ảnh**.
- **Trò chuyện** (`/chat`): phòng chat chung, chọn tên hiển thị, tin mới tự hiện sau vài giây.

## Chạy

```powershell
npm ci
Copy-Item .env.example .env   # nếu chưa có .env
npm start                     # web: http://127.0.0.1:5173  ·  API: http://127.0.0.1:3001
```

| Lệnh            | Ý nghĩa                                                          |
| --------------- | ---------------------------------------------------------------- |
| `npm test`      | Chạy toàn bộ test (schema, tầng API, trang bài viết, trang chat) |
| `npm run lint`  | Kiểm tra code bằng ESLint                                        |
| `npm run build` | Kiểm tra kiểu TypeScript rồi build vào `dist/`                   |

Nếu báo `EADDRINUSE ... 3001`: đang có một JSON Server khác chạy, hãy tắt cửa sổ đó rồi chạy lại.

## Kiến trúc (clean architecture)

Phụ thuộc chỉ đi từ trên xuống; tầng dưới không biết tầng trên. Mỗi module (`social`, `chat`) có đủ các tầng riêng và không import lẫn nhau.

| Tầng          | File                                         | Vai trò                                                                      |
| ------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| Composition   | `main.tsx`, `router/`, `modules/*/module.ts` | Lắp ráp ứng dụng, tự phát hiện module, sinh menu, lazy loading               |
| Presentation  | `modules/*/pages/`, `modules/*/components/`  | Trang container giữ trạng thái giao diện; component chỉ nhận props           |
| Application   | `modules/*/hooks/`                           | Use case: tải, thêm, sửa, xóa, gửi tin, polling; trả lỗi về cho giao diện    |
| Data          | `modules/*/api/` → `core/api/http-client.ts` | Repository của từng module, dùng chung một HTTP client (fetch, timeout, lỗi) |
| Domain        | `modules/*/types/`, `modules/*/schema/`      | Kiểu dữ liệu và quy tắc kiểm tra (Yup)                                       |
| Shared kernel | `core/`                                      | Bộ UI, khung trang, HTTP client, xử lý ảnh, phím tắt; không biết nghiệp vụ   |

Ghi chú thiết kế:

- **Thêm module không sửa router:** module chat chỉ là thư mục `modules/chat/` có `module.ts`; registry tự thêm route `/chat` và mục menu.
- **Ảnh:** trình duyệt thu nhỏ ảnh (tối đa 1200px, JPEG) bằng `core/lib/resize-image.ts`, rồi lưu dạng data URL trong trường `image` của bài viết. JSON Server không có API upload file, nên đây là cách đơn giản nhất; dự án thật sẽ đưa ảnh lên kho lưu trữ và chỉ lưu đường dẫn.
- **Chat:** JSON Server không có WebSocket, nên `useChat` hỏi tin mới mỗi 2,5 giây bằng `id_gte` (chỉ tải phần tin mới) và tạm dừng khi tab bị ẩn.
- Trang không gọi API trực tiếp; hook không gọi `toast`. Màu, bo góc và font chỉ khai báo trong `src/index.css`.
- `vite.config.ts` bỏ qua thư mục `server/`, để trang không tự tải lại mỗi khi JSON Server ghi `db.json`.

## Phím tắt (trang bài viết)

| Phím | Chức năng        |
| ---- | ---------------- |
| F4   | Mở form thêm bài |
| F2   | Lưu form         |
| Esc  | Đóng form        |
