# Kế Hoạch Phát Triển - Hệ Thống Gia Phả Họ Văn Phú

> **Cập nhật:** 2026-08-13  
> **Phiên bản hiện tại:** v1.0.0 (MVP hoàn chỉnh)  
> **Mục tiêu:** v2.0.0 (hệ thống đầy đủ, hoàn thiện)

---

## Tổng Quan Tiến Độ

```
Phase 0: Foundation Setup         [✅ HOÀN THÀNH]
Phase 1: Backend API Core         [✅ HOÀN THÀNH]
Phase 2: Frontend MVP             [✅ HOÀN THÀNH]
Phase 2B: Design System v2        [✅ HOÀN THÀNH]
Phase 3: D3.js Tree Visualization [✅ HOÀN THÀNH]
Phase 4: PDF Export               [✅ HOÀN THÀNH]
Phase 5: Testing & Deployment     [🔄 ĐANG THỰC HIỆN]
Phase 6: Nâng Cấp Dữ Liệu       [⏳ KẾ HOẠCH]
Phase 7: Tính Năng Nâng Cao      [⏳ KẾ HOẠCH]
Phase 8: Tối Ưu & Hoàn Thiện    [⏳ KẾ HOẠCH]
```

---

## Phase 0: Foundation Setup ✅

**Mục tiêu:** Thiết lập cơ sở hạ tầng ban đầu

| Bước | Công việc | Trạng thái |
|------|-----------|-----------|
| 0.1 | Tạo cấu trúc thư mục dự án | ✅ Done |
| 0.2 | Cài đặt Python dependencies (`requirements.txt`) | ✅ Done |
| 0.3 | Cấu hình Git & `.gitignore` | ✅ Done |
| 0.4 | Chuẩn bị file Excel nguồn dữ liệu (`GiaPha_VanPhu.xlsx`) | ✅ Done |

---

## Phase 1: Backend API Core ✅

**Mục tiêu:** Xây dựng REST API hoàn chỉnh với FastAPI + SQLAlchemy

| Bước | Công việc | File | Trạng thái |
|------|-----------|------|-----------|
| 1.1 | Thiết kế database schema (SQLAlchemy ORM) | `models.py` | ✅ Done |
| 1.2 | Cấu hình database engine (SQLite/PostgreSQL) | `database.py` | ✅ Done |
| 1.3 | Xây dựng Pydantic schemas request/response | `schemas.py` | ✅ Done |
| 1.4 | Implement CRUD operations | `crud.py` | ✅ Done |
| 1.5 | Implement WITH RECURSIVE CTE query | `crud.py` | ✅ Done |
| 1.6 | Script seed dữ liệu từ Excel | `seed.py` | ✅ Done |
| 1.7 | Thiết lập FastAPI routes (7 endpoints) | `main.py` | ✅ Done |
| 1.8 | Cấu hình CORS & static file serving | `main.py` | ✅ Done |
| 1.9 | Auto-seed khi database trống | `main.py` | ✅ Done |

---

## Phase 2: Frontend MVP ✅

**Mục tiêu:** Giao diện người dùng với theme Vintage Classic

| Bước | Công việc | File | Trạng thái |
|------|-----------|------|-----------|
| 2.1 | Thiết kế HTML layout cơ bản | `index.html` | ✅ Done |
| 2.2 | Import Google Fonts (Cinzel, Playfair, Merriweather) | `index.html` | ✅ Done |
| 2.3 | Xây dựng Vintage Dark CSS theme | `style.css` | ✅ Done |
| 2.4 | Header với search bar & action buttons | `index.html` | ✅ Done |
| 2.5 | Canvas viewport (>= 85%) | `index.html` | ✅ Done |
| 2.6 | Side panel slide-in (desktop + mobile) | `index.html` | ✅ Done |
| 2.7 | Loading spinner vintage style | `index.html` | ✅ Done |
| 2.8 | Legend bar (Nam/Nữ/Thuỷ Tổ) | `index.html` | ✅ Done |

---

## Phase 2B: Design System v2 ✅

**Mục tiêu:** Nâng cấp UI/UX theo hướng tài liệu lưu trữ, chuyên nghiệp (bỏ glow/blur, dùng Noto Serif, IBM Plex Mono, màu Đen ấm/Giấy cũ)

| Bước | Công việc | File | Trạng thái |
|------|-----------|------|-----------|
| 2B.1 | Cập nhật CSS Variables (Màu sắc, Fonts, Shadows) | `style.css` | ✅ Done |
| 2B.2 | Đổi link Google Fonts | `index.html` | ✅ Done |
| 2B.3 | Cập nhật style nút bấm và badges (Nam/Nữ) | `style.css`, `index.html`, `app.js` | ✅ Done |
| 2B.4 | Tối ưu style D3.js Nodes (Bỏ drop-shadow, sửa viền) | `tree_visualizer.js`, `style.css` | ✅ Done |
| 2B.5 | Thêm dấu triện (Signature seal) cho Thuỷ Tổ | `tree_visualizer.js` | ✅ Done |

---

## Phase 3: D3.js Tree Visualization ✅

**Mục tiêu:** Cây gia phả tương tác đẹp và mượt mà

| Bước | Công việc | File | Trạng thái |
|------|-----------|------|-----------|
| 3.1 | Khởi tạo D3.js v7 SVG container | `tree_visualizer.js` | ✅ Done |
| 3.2 | Implement Zoom & Pan behavior | `tree_visualizer.js` | ✅ Done |
| 3.3 | Render node cards với D3 hierarchy | `tree_visualizer.js` | ✅ Done |
| 3.4 | Cubic Bezier link paths | `tree_visualizer.js` | ✅ Done |
| 3.5 | Node click handler (side panel) | `tree_visualizer.js` | ✅ Done |
| 3.6 | Expand/Collapse nodes animation | `tree_visualizer.js` | ✅ Done |
| 3.7 | Expand All / Collapse All | `tree_visualizer.js` | ✅ Done |
| 3.8 | Focus & highlight node (từ search) | `tree_visualizer.js` | ✅ Done |
| 3.9 | Default collapse đời >= 3 khi load | `tree_visualizer.js` | ✅ Done |

---

## Phase 4: PDF Export ✅

**Mục tiêu:** Xuất sơ đồ gia phả ra file PDF độ phân giải cao

| Bước | Công việc | File | Trạng thái |
|------|-----------|------|-----------|
| 4.1 | Implement html2canvas capture | `pdf_export.js` | ✅ Done |
| 4.2 | Tạo PDF A4 Landscape bằng jsPDF | `pdf_export.js` | ✅ Done |
| 4.3 | Thêm header/footer gold text vào PDF | `pdf_export.js` | ✅ Done |
| 4.4 | Loading feedback khi đang xuất | `pdf_export.js` | ✅ Done |

---

## Phase 5: Testing & Deployment 🔄

**Mục tiêu:** Kiểm thử đầy đủ và deploy lên production

| Bước | Công việc | File | Trạng thái |
|------|-----------|------|-----------|
| 5.1 | Viết pytest cho hierarchy query | `test_hierarchy.py` | ✅ Done |
| 5.2 | Test toàn bộ CRUD API endpoints | `test_hierarchy.py` | 🔄 Cần bổ sung |
| 5.3 | Test seed data integrity (106 members) | - | 🔄 Cần bổ sung |
| 5.4 | Test mobile responsive layout | - | ⏳ Chưa làm |
| 5.5 | Tạo Supabase PostgreSQL project | - | ⏳ Chưa làm |
| 5.6 | Migrate data SQLite → PostgreSQL | - | ⏳ Chưa làm |
| 5.7 | Upload code lên GitHub | - | ⏳ Chưa làm |
| 5.8 | Deploy lên Vercel + cấu hình env vars | - | ⏳ Chưa làm |
| 5.9 | Test production endpoint | - | ⏳ Chưa làm |
| 5.10 | Viết tài liệu hướng dẫn sử dụng | `README.md` | 🔄 Cần cập nhật |

---

## Phase 6: Nâng Cấp Dữ Liệu ⏳

**Mục tiêu:** Hoàn thiện và làm phong phú dữ liệu gia phả

| Bước | Công việc | Ưu tiên | Trạng thái |
|------|-----------|---------|-----------|
| 6.1 | Bổ sung cột `birth_date`, `death_date` vào Excel | Cao | ⏳ Chưa làm |
| 6.2 | Bổ sung ngày giỗ âm lịch cho các cụ đã mất | Cao | ⏳ Chưa làm |
| 6.3 | Bổ sung địa chỉ mộ phần chi tiết | Trung bình | ⏳ Chưa làm |
| 6.4 | Bổ sung địa chỉ hiện tại từng thành viên | Trung bình | ⏳ Chưa làm |
| 6.5 | Migrate cột `status` thành cột riêng (không phụ thuộc notes) | Cao | ⏳ Chưa làm |
| 6.6 | Cập nhật seed.py cho schema mới | Cao | ⏳ Chưa làm |
| 6.7 | Viết migration script (Alembic) | Trung bình | ⏳ Chưa làm |
| 6.8 | Kiểm tra và sửa liên kết cha-con (parent_id) | Cao | ⏳ Chưa làm |

---

## Phase 7: Tính Năng Nâng Cao ⏳

**Mục tiêu:** Mở rộng chức năng hệ thống

| Bước | Công việc | Ưu tiên | Trạng thái |
|------|-----------|---------|-----------|
| 7.1 | **Trang Admin CRUD** - Thêm/sửa/xóa thành viên qua UI | Cao | ⏳ Chưa làm |
| 7.2 | **Upload ảnh đại diện** thành viên | Trung bình | ⏳ Chưa làm |
| 7.3 | **Bộ lọc theo nhánh/đời** trong cây | Trung bình | ⏳ Chưa làm |
| 7.4 | **Timeline view** - Hiển thị dòng thời gian | Thấp | ⏳ Chưa làm |
| 7.5 | **Bản đồ mộ phần** (Google Maps embed) | Thấp | ⏳ Chưa làm |
| 7.6 | **Nhắc nhở ngày giỗ** (email/notification) | Thấp | ⏳ Chưa làm |
| 7.7 | **Import từ Excel** qua giao diện web (không cần CLI) | Trung bình | ⏳ Chưa làm |
| 7.8 | **Export Excel** danh sách thành viên | Thấp | ⏳ Chưa làm |
| 7.9 | **Tìm kiếm nâng cao** (lọc theo năm sinh, nhánh, đời...) | Trung bình | ⏳ Chưa làm |
| 7.10 | **Thống kê tổng hợp** (số thành viên theo đời, giới tính...) | Thấp | ⏳ Chưa làm |

---

## Phase 8: Tối Ưu & Hoàn Thiện ⏳

**Mục tiêu:** Tối ưu hiệu năng và trải nghiệm người dùng

| Bước | Công việc | Ưu tiên | Trạng thái |
|------|-----------|---------|-----------|
| 8.1 | Tối ưu rendering D3.js cho cây >200 nodes | Trung bình | ⏳ Chưa làm |
| 8.2 | Thêm caching API (Redis / in-memory) | Thấp | ⏳ Chưa làm |
| 8.3 | Lazy loading cho ảnh đại diện | Trung bình | ⏳ Chưa làm |
| 8.4 | SEO meta tags & Open Graph | Thấp | ⏳ Chưa làm |
| 8.5 | Chế độ in (Print CSS) tối ưu | Thấp | ⏳ Chưa làm |
| 8.6 | Kiểm thử cross-browser (Chrome, Firefox, Safari) | Cao | ⏳ Chưa làm |
| 8.7 | Kiểm thử Mobile (iOS Safari, Android Chrome) | Cao | ⏳ Chưa làm |
| 8.8 | Performance audit (Lighthouse) | Trung bình | ⏳ Chưa làm |
| 8.9 | Bảo mật: Rate limiting API | Thấp | ⏳ Chưa làm |
| 8.10 | Error monitoring (Sentry hoặc tương đương) | Thấp | ⏳ Chưa làm |

---

## Lịch Trình Phát Triển Đề Xuất

```
Tuần 1-2:   Phase 5 (Testing + Deploy lên Vercel/Supabase)
Tuần 3-4:   Phase 6 (Nâng cấp dữ liệu Excel, migration)
Tuần 5-6:   Phase 7.1 - 7.4 (Admin UI, Upload ảnh, Bộ lọc)
Tuần 7-8:   Phase 7.5 - 7.10 (Tính năng nâng cao còn lại)
Tuần 9-10:  Phase 8 (Tối ưu, kiểm thử hoàn chỉnh)
```

---

## Phụ Lục: Quy Tắc Phát Triển

1. **Không đoán mò** — Nếu package version hay quyết định kiến trúc chưa rõ, hỏi trước khi code
2. **Từng bước** — Phát triển theo từng Phase, không nhảy cóc
3. **Modular** — File nhỏ, tách biệt rõ ràng (DB / routing / business logic)
4. **Comment code** — Đặc biệt ở logic D3.js phức tạp và CTE SQL
5. **Test trước khi done** — Viết pytest trước khi mark task là hoàn thành
6. **Không ghi đè blind** — Chỉ output diff khi cập nhật file lớn
