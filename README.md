# Januit JLPT Practice MVP

Januit là MVP nền tảng luyện đề tiếng Nhật/JLPT. Người học có thể chọn cấp độ, làm đề theo thời gian, đánh dấu câu cần xem lại, nộp bài và xem kết quả. Giáo viên có một workspace demo để xem tổng quan, quản lý đề và ngân hàng câu hỏi.

## Tính năng hiện có

### Học sinh

- Chọn cấp độ JLPT từ N5 đến N1.
- Chọn đề luyện theo cấp độ, độ khó và thời lượng.
- Làm các dạng câu hỏi:
  - Trắc nghiệm.
  - Nghe hiểu có audio mẫu.
  - Sắp xếp từ thành câu.
  - Điền vào ô trống.
- Đếm thời gian làm bài.
- Đánh dấu câu hỏi cần xem lại.
- Nộp bài, chấm điểm và xem đáp án/giải thích.
- Xem các đề đã hoàn thành trong phiên hiện tại.

### Giáo viên

- Dashboard tổng quan.
- Xem ngân hàng câu hỏi mẫu.
- Tìm kiếm và lọc đề theo cấp độ.
- Xem giao diện quản lý metadata đề thi.
- Xem giao diện import Excel/JSON và audio.
- Xem thống kê kết quả học sinh mẫu.

## Công nghệ

- React 19
- TypeScript
- Vite 6
- Lucide React
- CSS thuần

## Yêu cầu

- Node.js 18 trở lên.
- npm 9 trở lên.

## Chạy local

```bash
npm install
npm run dev
```

Sau đó mở URL Vite hiển thị trong terminal, thường là `http://localhost:5173`.

## Các lệnh khác

```bash
# Kiểm tra TypeScript và build production
npm run build

# Chạy thử bản build production
npm run preview
```

## Luồng demo

1. Mở ứng dụng và chọn `Practice`.
2. Chọn một cấp độ JLPT, sau đó chọn đề luyện.
3. Trả lời câu hỏi, thử đánh dấu câu cần xem lại và nộp bài.
4. Mở `Results` để xem kết quả.
5. Chọn `Sign In` hoặc `Sign Up`, rồi chuyển vai trò sang `Giáo viên` để xem teacher workspace.

Thông tin tài khoản hiển thị trong giao diện demo:

- Học sinh: `student@januit.demo` / `demo1234`
- Giáo viên: `teacher@januit.demo` / `demo1234`

> Đây chỉ là tài khoản mô phỏng. MVP chưa xác thực hoặc lưu tài khoản thật.

## Cấu trúc chính

```text
src/
├── App.tsx                         # Điều phối route/view và state phiên chạy
├── types.ts                        # Kiểu dữ liệu đề thi, câu hỏi, kết quả
├── data/exams.ts                   # Dữ liệu đề và cấp độ JLPT mẫu
├── utils/practice.ts               # Logic kiểm tra đáp án và loại câu hỏi
├── components/
│   ├── AuthPage.tsx                # Giao diện đăng nhập/đăng ký demo
│   ├── AppSidebar.tsx              # Thanh điều hướng
│   ├── TeacherWorkspace.tsx        # Workspace giáo viên
│   └── student/                    # Các view dành cho học sinh
├── assets/audio/                   # Audio mẫu cho câu nghe
└── styles.css                      # Style toàn bộ ứng dụng
```

## Giới hạn của MVP

- Chưa có backend, database hoặc API.
- Đăng nhập/đăng ký chỉ chuyển đổi state trên frontend.
- Dữ liệu đề thi đang hard-code trong `src/data/exams.ts`.
- Kết quả chỉ tồn tại trong phiên trình duyệt hiện tại.
- Các thao tác import, thêm, sửa, xóa và xuất đề trong teacher workspace mới là giao diện mô phỏng.
- Chưa có quản lý lớp học, bài giảng, flashcard, chatbot hoặc hệ thống LMS đầy đủ.

## Hướng phát triển tiếp theo

1. Thêm backend và xác thực người dùng thật.
2. Lưu đề, câu hỏi, audio và kết quả vào database.
3. Hoàn thiện import/export JSON, Excel và audio.
4. Thêm thống kê tiến độ theo học sinh, cấp độ và dạng bài.
5. Bổ sung quản lý lớp học và phân quyền giáo viên.
