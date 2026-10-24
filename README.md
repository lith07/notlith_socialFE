# Greenwich Social — bản dựng lại

Ứng dụng quản lý bài viết (xem, tìm kiếm, thêm, sửa, xóa, xuất bản) bằng React 19 + TypeScript, API giả lập bằng JSON Server. Giao diện theme **Peach and navy**: dễ thương, tối giản.

## Chạy

```powershell
npm ci
Copy-Item .env.example .env   # nếu chưa có .env
npm start                     # web: http://127.0.0.1:5173  ·  API: http://127.0.0.1:3001/posts
```

| Lệnh            | Ý nghĩa                                                     |
| --------------- | ----------------------------------------------------------- |
| `npm test`      | Chạy toàn bộ test (schema, tầng API, luồng CRUD trên trang) |
| `npm run lint`  | Kiểm tra code bằng ESLint                                   |
| `npm run build` | Kiểm tra kiểu TypeScript rồi build vào `dist/`              |

## Kiến trúc (clean architecture)

Phụ thuộc chỉ đi từ trên xuống; tầng dưới không biết tầng trên.

| Tầng          | File                                                  | Vai trò                                                                             |
| ------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Composition   | `main.tsx`, `router/`, `modules/social/module.ts`     | Lắp ráp ứng dụng, tự phát hiện module, lazy loading                                 |
| Presentation  | `modules/social/pages/`, `modules/social/components/` | Trang container giữ trạng thái giao diện; component chỉ nhận props                  |
| Application   | `modules/social/hooks/use-posts.ts`                   | Use case: tải, thêm, sửa, xóa; khóa chống gửi lặp; trả lỗi về cho giao diện         |
| Data          | `modules/social/api/`                                 | `config` (địa chỉ) → `http-client` (fetch, timeout, lỗi) → `posts-api` (repository) |
| Domain        | `modules/social/types/`, `modules/social/schema/`     | Kiểu `Post`/`PostInput` và quy tắc dữ liệu (Yup)                                    |
| Shared kernel | `core/`                                               | Bộ UI, hộp thoại, phím tắt; không biết gì về bài viết                               |

Khác với bản gốc:

- Trang không import `postsApi`; mọi lời gọi API đi qua `usePosts` (`create`, `update`, `remove`).
- `usePosts` không gọi `toast`; hook trả `{ ok, error }` và trang quyết định cách hiển thị.
- Màu, bo góc và font chỉ khai báo trong `src/index.css`; component dùng token (`bg-primary`, `text-muted-foreground`…) nên đổi theme chỉ cần sửa một file.

## Phím tắt

| Phím | Chức năng        |
| ---- | ---------------- |
| F4   | Mở form thêm bài |
| F2   | Lưu form         |
| Esc  | Đóng form        |
