# Gia Phả Họ Văn Phú — Van Phu Genealogy Web System

> Hệ thống quản lý và hiển thị cây gia phả tương tác chuẩn **Classic Vintage & Mystical** dành cho Họ Văn Phú.  
> Chạy hoàn toàn trên Web (Vercel + Supabase) hoặc chạy Local.

---

## 🌟 Tính Năng Nổi Bật

| # | Tính Năng | Mô Tả |
|---|-----------|-------|
| 1 | **Cây Gia Phả Tương Tác D3.js** | Phóng to/thu nhỏ, mở/đóng nhánh, tìm kiếm & auto-center |
| 2 | **Kiến Trúc Đệ Quy CTE PostgreSQL/SQLite** | `WITH RECURSIVE` — 106 thành viên, 6 đời, 1 query |
| 3 | **Giao Diện Vintage Cổ Kính** | Dark Obsidian + Antique Gold, fonts Cinzel & Playfair |
| 4 | **Side Panel Slide-in** | Chi tiết thành viên, ngày giỗ, mộ phần, quan hệ gia đình |
| 5 | **Xuất PDF Độ Phân Giải Cao** | A4 Landscape, chất lượng in sắc nét |
| 6 | **Responsive Mobile** | Side panel trượt từ dưới lên trên mobile |

---

## 📁 Cấu Trúc Dự Án

```
GIA PHẢ/
├── backend/app/
│   ├── main.py          # FastAPI routes, CORS, static serving
│   ├── models.py        # SQLAlchemy ORM (FamilyMember)
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── crud.py          # CRUD + WITH RECURSIVE CTE query
│   ├── database.py      # DB engine (SQLite/PostgreSQL)
│   └── seed.py          # Seed dữ liệu từ Excel
├── backend/tests/
│   └── test_hierarchy.py # pytest tests
├── frontend/
│   ├── index.html       # Giao diện Vintage
│   ├── css/style.css    # Vintage Dark CSS theme
│   └── js/
│       ├── app.js              # App orchestrator
│       ├── tree_visualizer.js  # D3.js tree class
│       └── pdf_export.js       # PDF export module
├── docs/
│   ├── 01-kien-truc-tong-quan.md  # Kiến trúc hệ thống
│   ├── 02-database-schema.md      # Database schema
│   ├── 03-frontend-ui-ux.md       # UI/UX design rules
│   ├── 04-ke-hoach-phat-trien.md  # Kế hoạch phát triển
│   └── 05-task-list.md            # Danh sách công việc
├── GiaPha_VanPhu.xlsx   # Dữ liệu nguồn (106 thành viên)
├── gia_pha.db           # SQLite database (local)
├── vercel.json          # Vercel deploy config
└── requirements.txt     # Python dependencies
```

---

## 🚀 Chạy Local

### Bước 1: Cài đặt Python dependencies
```bash
pip install -r backend/requirements.txt
```

### Bước 2: Khởi chạy Server (auto-seed khi DB trống)
```bash
uvicorn backend.app.main:app --reload --port 8000
```

Mở trình duyệt: **`http://localhost:8000`**

### Bước 3 (tuỳ chọn): Seed dữ liệu thủ công
```bash
python -m backend.app.seed
```

### Chạy Tests
```bash
pytest backend/tests/ -v
```

---

## ☁️ Deploy Lên Production (Miễn Phí 100%)

### Bước 1: Tạo PostgreSQL trên Supabase
1. Truy cập [Supabase.com](https://supabase.com) → Đăng ký → **New Project** tên `gia-pha-van-phu`
2. Vào **Project Settings → Database** → Copy chuỗi `URI` kết nối

### Bước 2: Push lên GitHub
```bash
git add .
git commit -m "feat: initial release Gia Phả Họ Văn Phú v1.0"
git branch -M main
git remote add origin https://github.com/vanngochuy/giapha_vanphu.git
git push -u origin main
```

### Bước 3: Deploy lên Vercel
1. Truy cập [Vercel.com](https://vercel.com) → **Add New Project** → Chọn repo GitHub
2. **Environment Variables** → Thêm:
   - Name: `DATABASE_URL`
   - Value: `<Chuỗi URI Supabase>`
3. Nhấn **Deploy** → Nhận URL: `https://gia-pha-van-phu.vercel.app`

---

## 📊 Dữ Liệu Gia Phả

- **Tổng thành viên:** 106 người
- **Số đời:** 6 thế hệ
- **Thuỷ Tổ:** Ông Văn Phú Dưỡng (Đời 1)
- **Nguồn dữ liệu:** `GiaPha_VanPhu.xlsx`

---

## 📚 Tài Liệu

| File | Nội dung |
|------|---------|
| [01-kien-truc-tong-quan.md](docs/01-kien-truc-tong-quan.md) | Kiến trúc hệ thống, stack công nghệ, API endpoints |
| [02-database-schema.md](docs/02-database-schema.md) | Schema bảng, CTE query, cấu trúc Excel |
| [03-frontend-ui-ux.md](docs/03-frontend-ui-ux.md) | Thiết kế UI, màu sắc, typography, D3.js |
| [04-ke-hoach-phat-trien.md](docs/04-ke-hoach-phat-trien.md) | Roadmap 8 phases với trạng thái chi tiết |
| [05-task-list.md](docs/05-task-list.md) | Danh sách công việc chi tiết (checklist) |

---

## 🛠️ Tech Stack

- **Backend:** Python 3.10+, FastAPI, SQLAlchemy 2.x
- **Database:** SQLite (local) / PostgreSQL (production via Supabase)
- **Frontend:** HTML5, Vanilla JS, Vanilla CSS
- **Visualization:** D3.js v7
- **PDF:** html2canvas + jsPDF
- **Deploy:** Vercel + Supabase (free tier)

---

*Gia Phả Họ Văn Phú — Văn Phú Tộc Gia Phả - Bách Niên Cổ Thụ*
