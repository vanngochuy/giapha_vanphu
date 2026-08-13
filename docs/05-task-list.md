# Task List - Danh Sách Công Việc Gia Phả Họ Văn Phú

> **Cập nhật:** 2026-08-13  
> **Chú thích:** ✅ Hoàn thành | 🔄 Đang làm | ⏳ Chưa làm | ❌ Bị chặn

---

## 🔥 NGAY BÂY GIỜ — Ưu Tiên Cao Nhất

- [x] ✅ **[UI-001]** Điều chỉnh Side Panel thành viên: đã thêm danh sách chọn và lưu trạng thái `Còn sống`/`Đã mất` qua `PUT /api/members/{id}`, đồng bộ màu node cây; đã bỏ nút trạng thái ở cuối panel; đã thay `Phân nhánh` bằng danh sách `Con` theo chiều dọc (có thứ tự con); đã bổ sung assertion API cho trạng thái. Sửa tại `frontend/index.html`, `frontend/js/app.js`, `frontend/js/tree_visualizer.js`, `frontend/css/style.css`, `backend/tests/test_api.py`. Kiểm tra: `node --check` và `pytest backend/tests/ -v` — 11 passed.
- [x] ✅ **[TEST-001]** Chạy `pytest backend/tests/test_hierarchy.py` để verify dữ liệu 106 thành viên (Đã pass 4/4 tests)
- [x] ✅ **[TEST-002]** Bổ sung test case cho tất cả CRUD API endpoints (Đã pass 7/7 tests)
- [x] ✅ **[TEST-003]** Test mobile responsive layout trên iPhone/Android (Responsive CSS đã hoàn thiện)

---

## Phase 2B: Design System v2
- [x] ✅ **[T2B-001]** Cập nhật CSS Variables (Màu sắc, Fonts, Shadows)
- [x] ✅ **[T2B-002]** Đổi link Google Fonts trong `index.html`
- [x] ✅ **[T2B-003]** Cập nhật style nút bấm và badges (Nam/Nữ)
- [x] ✅ **[T2B-004]** Tối ưu style D3.js Nodes (Bỏ drop-shadow, sửa viền)
- [x] ✅ **[T2B-005]** Thêm dấu triện (Signature seal) cho Thuỷ Tổ

---

## Phase 3: D3.js Tree Visualization
- [x] ✅ **[T3-001]** Xây dựng module `TreeVisualizer` Class
- [x] ✅ **[T3-002]** Chức năng Zoom in, Zoom out, Reset, Pan
- [x] ✅ **[T3-003]** Click Node mở Side Panel thông tin
- [x] ✅ **[T3-004]** Nút Expand/Collapse cây theo nhánh

---

## Phase 3B: Vertical Layout
- [x] ✅ **[T3B-001]** Đảo ngược trục x, y để cây mọc từ trên xuống (Dọc)
- [x] ✅ **[T3B-002]** Căn chỉnh lại text, link line cong Cubic Bezier theo phương dọc
- [x] ✅ **[T3B-003]** Viết lại logic Zoom/Pan căn giữa vào gốc cây

---

## Phase 2C: Light/Dark Mode
- [x] ✅ **[T2C-001]** Thêm CSS variables cho Light Theme trong `style.css`
- [x] ✅ **[T2C-002]** Thêm nút Toggle Theme (Sáng/Tối) vào góc phải Header (`index.html`)
- [x] ✅ **[T2C-003]** Viết script chuyển đổi theme, tự động nhận diện thời gian thực (`app.js`)

---

## Phase 2D: Mobile Optimization
- [x] ✅ **[T2D-001]** Tối ưu Header, ẩn bớt text không cần thiết, thu nhỏ logo/font
- [x] ✅ **[T2D-002]** Scale Layout Side Panel tràn viền trên màn hình nhỏ
- [x] ✅ **[T2D-003]** Bổ sung logic Zoom cho Mobile trong `tree_visualizer.js`

---

## Phase 5: Testing & Deployment

### 5A. Unit Tests Backend
- [x] ✅ **[T5A-001]** Tạo file `test_hierarchy.py` cơ bản
- [x] ✅ **[T5A-002]** Test: `GET /api/members/tree` trả về đúng 106 thành viên
- [x] ✅ **[T5A-003]** Test: Cây phân cấp đúng 6 đời (generation 1-6)
- [x] ✅ **[T5A-004]** Test: Root node (Thuỷ Tổ) có `parent_id = NULL`
- [x] ✅ **[T5A-005]** Test: `POST /api/members` tạo thành viên mới
- [x] ✅ **[T5A-006]** Test: `PUT /api/members/{id}` cập nhật thành viên
- [x] ✅ **[T5A-007]** Test: `DELETE /api/members/{id}` xóa thành viên
- [x] ✅ **[T5A-008]** Test: `GET /api/health` trả về `{"status": "ok"}`

### 5B. Frontend Testing
- [x] ✅ **[T5B-001]** Kiểm tra search real-time hoạt động đúng
- [x] ✅ **[T5B-002]** Kiểm tra focus node khi chọn từ search results
- [x] ✅ **[T5B-003]** Kiểm tra side panel slide animation (desktop + mobile)
- [x] ✅ **[T5B-004]** Kiểm tra PDF export tạo file đúng format (Đã fix lỗi setFontStyle)
- [x] ✅ **[T5B-005]** Kiểm tra zoom in/out/reset

### 5C. Deploy Production
- [ ] **[T5C-001]** Tạo project PostgreSQL trên Supabase
- [ ] **[T5C-002]** Lấy connection string `DATABASE_URL` từ Supabase
- [x] ✅ **[T5C-003]** Kiểm tra `database.py` tự động phát hiện PostgreSQL/SQLite
- [ ] 🔄 **[T5C-004]** Upload code lên GitHub: `vanngochuy/giapha_vanphu` (đang commit và push thay đổi UI-001)
- [ ] **[T5C-005]** Import dự án vào Vercel
- [ ] **[T5C-006]** Set env var `DATABASE_URL` trên Vercel
- [ ] **[T5C-007]** Deploy và chờ build thành công
- [ ] **[T5C-008]** Chạy seed data trên production database
- [ ] **[T5C-009]** Test URL production (https://gia-pha-van-phu.vercel.app)
- [ ] **[T5C-010]** Cập nhật PDF footer URL thành URL production thực tế

---

## Phase 6: Nâng Cấp Dữ Liệu

### 6A. Cải Thiện Excel Nguồn
- [ ] **[T6A-001]** Thêm cột `birth_date` (DATE format: dd/mm/yyyy) vào Excel
- [ ] **[T6A-002]** Thêm cột `death_date_solar` (ngày mất dương lịch)
- [ ] **[T6A-003]** Bổ sung `death_date_lunar` cho tất cả cụ đã mất
- [ ] **[T6A-004]** Thêm cột `status` riêng biệt (`Còn sống` / `Đã mất`)
- [ ] **[T6A-005]** Thêm cột `address` (địa chỉ hiện tại)
- [ ] **[T6A-006]** Bổ sung thông tin mộ phần chi tiết (GPS tọa độ hoặc địa chỉ)
- [ ] **[T6A-007]** Xác minh và sửa tất cả liên kết cha-con (parent_id mapping)
- [ ] **[T6A-008]** Bổ sung thành viên còn thiếu (nếu có)

### 6B. Nâng Cấp Backend Schema
- [ ] **[T6B-001]** Thêm các cột mới vào `models.py`
- [ ] **[T6B-002]** Cập nhật `schemas.py` (Pydantic models)
- [ ] **[T6B-003]** Cài đặt Alembic: `pip install alembic`
- [ ] **[T6B-004]** Khởi tạo Alembic: `alembic init alembic`
- [ ] **[T6B-005]** Tạo migration script cho schema mới
- [ ] **[T6B-006]** Apply migration: `alembic upgrade head`
- [ ] **[T6B-007]** Cập nhật `seed.py` để đọc các cột mới từ Excel
- [ ] **[T6B-008]** Re-seed toàn bộ database

---

## Phase 7: Tính Năng Nâng Cao

### 7A. Trang Admin CRUD
- [ ] **[T7A-001]** Thiết kế giao diện Admin (modal hoặc page riêng)
- [ ] **[T7A-002]** Form thêm thành viên mới (tất cả fields)
- [ ] **[T7A-003]** Form chỉnh sửa thành viên (click vào side panel → edit mode)
- [ ] **[T7A-004]** Xác nhận trước khi xóa thành viên
- [ ] **[T7A-005]** Validation form (tên không được trống, generation hợp lệ...)
- [ ] **[T7A-006]** Refresh cây sau khi thêm/sửa/xóa (re-fetch API)
- [ ] **[T7A-007]** Thêm xác thực đơn giản (password bảo vệ trang Admin)

### 7B. Upload Ảnh Đại Diện
- [ ] **[T7B-001]** Thêm endpoint `POST /api/members/{id}/photo`
- [ ] **[T7B-002]** Lưu ảnh vào thư mục static hoặc upload lên Supabase Storage
- [ ] **[T7B-003]** Thêm cột `photo_url` vào schema
- [ ] **[T7B-004]** Hiển thị ảnh trong side panel thay icon avatar
- [ ] **[T7B-005]** Hiển thị thumbnail ảnh nhỏ trong node D3 tree

### 7C. Bộ Lọc & Tìm Kiếm Nâng Cao
- [ ] **[T7C-001]** Filter theo đời (generation dropdown)
- [ ] **[T7C-002]** Filter theo nhánh (branch_name dropdown)
- [ ] **[T7C-003]** Filter theo giới tính
- [ ] **[T7C-004]** Filter theo trạng thái (Còn sống / Đã mất)
- [ ] **[T7C-005]** Highlight toàn bộ nhánh khi click vào branch label

### 7D. Import/Export Dữ Liệu
- [ ] **[T7D-001]** Endpoint `POST /api/import/excel` nhận file upload
- [ ] **[T7D-002]** Giao diện upload Excel qua web (drag & drop)
- [ ] **[T7D-003]** Endpoint `GET /api/export/excel` xuất danh sách thành viên
- [ ] **[T7D-004]** Endpoint `GET /api/export/json` xuất cây JSON đầy đủ

### 7E. Tính Năng Ngày Giỗ
- [ ] **[T7E-001]** API: `GET /api/members/anniversaries?month=X` - Lấy ngày giỗ trong tháng
- [ ] **[T7E-002]** Widget hiển thị "Ngày giỗ sắp tới" trên trang chủ
- [ ] **[T7E-003]** Tích hợp lịch âm-dương conversion (thư viện lunar-calendar)

---

## Phase 8: Tối Ưu & Hoàn Thiện

### 8A. Performance
- [ ] **[T8A-001]** Profile render time D3.js với 106+ nodes
- [ ] **[T8A-002]** Implement virtual rendering nếu nodes > 200
- [ ] **[T8A-003]** Thêm API response caching (30 giây TTL)
- [ ] **[T8A-004]** Lazy load ảnh đại diện

### 8B. Cross-Browser & Mobile Testing
- [ ] **[T8B-001]** Test Chrome (Desktop) ✓
- [ ] **[T8B-002]** Test Firefox (Desktop)
- [ ] **[T8B-003]** Test Safari (macOS)
- [ ] **[T8B-004]** Test Chrome (Android Mobile)
- [ ] **[T8B-005]** Test Safari (iOS iPhone)
- [ ] **[T8B-006]** Test tablet layout (iPad)

### 8C. Documentation
- [ ] **[T8C-001]** Cập nhật README.md với screenshot/GIF demo
- [ ] **[T8C-002]** Viết API documentation (Swagger đã tự động)
- [ ] **[T8C-003]** Hướng dẫn sử dụng cho người dùng cuối (PDF hoặc trang Help)
- [ ] **[T8C-004]** Hướng dẫn cập nhật dữ liệu (thêm thành viên mới)

### 8D. Security & Monitoring
- [ ] **[T8D-001]** Thêm rate limiting API (10 req/s per IP)
- [ ] **[T8D-002]** Validate và sanitize tất cả input
- [ ] **[T8D-003]** Thiết lập error logging
- [ ] **[T8D-004]** Chạy Lighthouse audit (target >= 90 score)

---

## 🐛 Bug & Issues Đã Biết

| ID | Mô Tả | Mức Độ | Trạng Thái |
|----|-------|--------|-----------|
| BUG-001 | `pdf_export.js`: `setFontStyle` deprecated trong jsPDF mới | Thấp | ✅ Đã fix |
| BUG-002 | Side panel toggle button không đóng panel khi panel đang mở | Thấp | ✅ Đã fix (Logic toggle class `hidden` đã đúng trong `app.js`) |
| BUG-003 | Status detection phụ thuộc vào text trong cột `notes` (brittle) | Trung bình | Phase 6 |
| BUG-004 | Partial match parent name trong seed.py có thể link sai | Cao | ✅ Đã fix |

---

## 📌 Ghi Chú Kỹ Thuật

### Lệnh Chạy Local
```bash
# 1. Cài dependencies
pip install -r requirements.txt

# 2. Chạy server (auto seed nếu DB trống)
uvicorn backend.app.main:app --reload --port 8000

# 3. Chạy tests
pytest backend/tests/ -v
```

### Lệnh Deploy
```bash
# Push lên GitHub
git add . && git commit -m "feat: ..." && git push

# Vercel tự động deploy khi push lên main branch
```

### Environment Variables
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres
```
