# Gia Phả Họ Văn Phú (Van Phu Genealogy Web System)

Hệ thống quản lý và hiển thị cây gia phả tương tác chuẩn **Classic Vintage & Mystical** dành cho Họ Văn Phú, cho phép chạy hoàn toàn trên Web (Vercel / Supabase) hoặc chạy Local.

---

## 🌟 Tính Năng Nổi Bật
1. **Kiến Trúc Đệ Quy CTE PostgreSQL / SQLite (`WITH RECURSIVE`):**
   - Truy vấn toàn bộ hệ thống 6 thế hệ (106 thành viên) chỉ trong 1 lần duy nhất, trả về cây JSON phân cấp.
2. **Giao Diện Cổ Kính Vintage & Trang Trọng (Classic Vintage Theme):**
   - Tông màu tối Obsidian Dark Green (`#080D0C`), họa tiết & chữ vàng cổ Antique Gold (`#D4AF37`).
   - Font chữ Serif cổ điển: *Cinzel*, *Playfair Display*, *Merriweather*.
3. **Đồ Thị Cây Tương Tác D3.js (Canvas >= 85% Viewport):**
   - Phóng to / Thu nhỏ (Zoom & Pan), Đặt lại góc nhìn (Reset View).
   - Thu gập / Mở rộng các nhánh (Expand / Collapse nodes).
   - Tìm kiếm thành viên tức thì với khả năng tự động canh giữa (Auto-center & Highlight).
4. **Bảng Chi Tiết Slide-in Side Panel:**
   - Trượt êm ái từ bên phải (trên Desktop) hoặc trượt từ dưới lên (trên Mobile) khi click chọn thành viên, hiển thị thông tin cha/mẹ, vợ/chồng, ngày giỗ âm lịch, mộ phần, ghi chú.
5. **Xuất PDF Độ Phân Giải Cao:**
   - Nút Xuất PDF trực tiếp trên web tạo file `GiaPha_VanPhu_Tree.pdf` lưu trữ sắc nét.

---

## 🚀 Hướng Dẫn Chạy Local (Chạy Trên Máy)

### Bước 1: Cài đặt thư viện Python
```bash
pip install -r backend/requirements.txt
```

### Bước 2: Nạp dữ liệu Excel vào Database
```bash
python -m backend.app.seed
```
*Script sẽ tự động đọc `GiaPha_VanPhu.xlsx` và khởi tạo cơ sở dữ liệu `gia_pha.db` (106 thành viên).*

### Bước 3: Khởi chạy Server Web
```bash
uvicorn backend.app.main:app --reload --port 8000
```
Mở trình duyệt truy cập: **`http://localhost:8000`**

---

## ☁️ Hướng Dẫn Deploy Lên Web Chạy Hoàn Toàn Online (Miễn Phí 100%)

### Bước 1: Tạo Database PostgreSQL Cloud Trên Supabase
1. Truy cập [Supabase.com](https://supabase.com) và đăng ký tài khoản miễn phí.
2. Tạo một **New Project** tên `gia-pha-van-phu`.
3. Vào phần **Project Settings** -> **Database** -> Sao chép chuỗi `URI` kết nối Database (dạng `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres`).

### Bước 2: Upload Code Lên GitHub
```bash
git init
git add .
git commit -m "Initial commit Gia Phả Họ Văn Phú Web System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gia-pha-van-phu.git
git push -u origin main
```

### Bước 3: Deploy Lên Vercel
1. Truy cập [Vercel.com](https://vercel.com) -> Đăng nhập -> Chọn **Add New Project**.
2. Chọn Repository `gia-pha-van-phu` vừa đẩy lên GitHub.
3. Trong phần **Environment Variables**, thêm biến môi trường:
   - Name: `DATABASE_URL`
   - Value: `<Chuỗi URI Supabase vừa copy ở Bước 1>`
4. Nhấn **Deploy**. Sau 1-2 phút, bạn sẽ nhận được đường link web chính thức (VD: `https://gia-pha-van-phu.vercel.app`) để chia sẻ cho dòng họ truy cập từ bất kỳ đâu!
