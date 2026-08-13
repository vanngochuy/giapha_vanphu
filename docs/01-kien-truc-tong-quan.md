# Kiến Trúc Tổng Quan - Hệ Thống Gia Phả Họ Văn Phú

> **Phiên bản:** 1.0.0  
> **Cập nhật:** 2026-08-13  
> **Dự án:** Gia Phả Họ Văn Phú - Van Phu Genealogy Web System

---

## 1. Mô Tả Dự Án

Hệ thống quản lý và hiển thị cây gia phả tương tác chuẩn **Classic Vintage & Mystical** dành cho Họ Văn Phú, cho phép:
- Chạy hoàn toàn trên Web (Vercel + Supabase PostgreSQL)
- Chạy Local (SQLite + uvicorn)

Dữ liệu hiện tại: **106 thành viên** trải qua **6 thế hệ**, đọc từ file Excel `GiaPha_VanPhu.xlsx`.

---

## 2. Stack Công Nghệ

| Tầng | Công nghệ | Ghi chú |
|------|-----------|---------|
| **Backend API** | Python 3.10+, FastAPI | Lightweight, async-ready |
| **ORM / DB Layer** | SQLAlchemy 2.x | Hỗ trợ cả SQLite (local) & PostgreSQL (production) |
| **Database Local** | SQLite (`gia_pha.db`) | Không cần cài đặt, zero-config |
| **Database Cloud** | PostgreSQL (Supabase) | Hỗ trợ CTE Recursive |
| **Frontend** | HTML5 + Vanilla JS + Vanilla CSS | Không dùng framework nặng |
| **Visualizer** | D3.js v7 | Interactive tree, zoom/pan/collapse |
| **PDF Export** | html2canvas + jsPDF | Xuất sơ đồ PDF trực tiếp từ browser |
| **Font** | Cinzel, Playfair Display, Merriweather | Google Fonts - phong cách cổ điển |
| **Icon** | FontAwesome 6.4 | |
| **Deploy** | Vercel (serverless) + Supabase | Miễn phí 100% |
| **Test** | pytest | Python unit & integration tests |

---

## 3. Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                     │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │index.html│  │tree_visualizer│  │   pdf_export.js  │  │
│  │  (UI)    │  │    .js (D3)  │  │ (html2canvas+pdf)│  │
│  └────┬─────┘  └──────┬───────┘  └──────────────────┘  │
│       └───────────────┤                                 │
│                  app.js (Orchestrator)                  │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP REST API (fetch)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (FastAPI)                      │
│  ┌─────────┐  ┌─────────┐  ┌────────┐  ┌──────────┐   │
│  │ main.py │  │ crud.py │  │models. │  │schemas.py│   │
│  │ (Routes)│  │(Queries)│  │   py   │  │(Pydantic)│   │
│  └────┬────┘  └────┬────┘  └───┬────┘  └──────────┘   │
│       └────────────┤           │                       │
│               database.py (SQLAlchemy Engine)          │
└──────────────────────┬─────────────────────────────────┘
                       │ SQL (WITH RECURSIVE CTE)
           ┌───────────┴───────────┐
           │  LOCAL: SQLite        │  CLOUD: PostgreSQL
           │  (gia_pha.db)        │  (Supabase)
           └───────────────────────┘
```

---

## 4. Cấu Trúc Thư Mục Hiện Tại

```
GIA PHẢ/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, routes, CORS, static serve
│   │   ├── models.py        # SQLAlchemy ORM model (FamilyMember)
│   │   ├── schemas.py       # Pydantic schemas (request/response)
│   │   ├── crud.py          # DB operations + CTE Recursive query
│   │   ├── database.py      # Engine, Base, SessionLocal
│   │   └── seed.py          # Import dữ liệu từ Excel → DB
│   ├── tests/
│   │   └── test_hierarchy.py # pytest kiểm tra cây phân cấp
│   └── requirements.txt
│
├── frontend/
│   ├── index.html           # Giao diện chính (Vintage theme)
│   ├── css/
│   │   └── style.css        # Toàn bộ CSS (Vintage dark theme)
│   └── js/
│       ├── app.js           # Orchestrator: fetch API, side panel, search
│       ├── tree_visualizer.js # D3.js interactive tree class
│       └── pdf_export.js    # PDF export via html2canvas + jsPDF
│
├── docs/                    # Tài liệu dự án
│   ├── 01-kien-truc-tong-quan.md  (file này)
│   ├── 02-database-schema.md
│   ├── 03-frontend-ui-ux.md
│   ├── 04-ke-hoach-phat-trien.md
│   └── 05-task-list.md
│
├── GiaPha_VanPhu.xlsx       # Dữ liệu gốc (106 thành viên, 6 đời)
├── gia_pha.db               # SQLite database (local)
├── vercel.json              # Vercel deploy config
├── requirements.txt         # Python dependencies
└── README.md                # Hướng dẫn chạy & deploy
```

---

## 5. Luồng Dữ Liệu

```
Excel (GiaPha_VanPhu.xlsx)
    │ seed.py (parse_and_seed_excel)
    ▼
Database (family_members table)
    │ crud.get_hierarchy_tree() - WITH RECURSIVE CTE
    ▼
REST API: GET /api/members/tree → JSON nested tree
    │ fetch() trong app.js
    ▼
TreeVisualizer.render(treeData) - D3.js
    │ Click node
    ▼
showMemberDetail() → Side Panel slide-in
```

---

## 6. API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Kiểm tra trạng thái hệ thống |
| GET | `/api/members/tree` | Trả về cây JSON phân cấp đệ quy (CTE) |
| GET | `/api/members` | Danh sách tất cả thành viên (flat list) |
| GET | `/api/members/{id}` | Chi tiết một thành viên |
| POST | `/api/members` | Thêm thành viên mới |
| PUT | `/api/members/{id}` | Cập nhật thông tin thành viên |
| DELETE | `/api/members/{id}` | Xóa thành viên |

---

## 7. Yêu Cầu Kỹ Thuật Quan Trọng

### 7.1 Recursive CTE Query
- Backend phải dùng `WITH RECURSIVE` CTE để trả về cây JSON phân cấp **trong 1 lần query duy nhất**
- Tương thích cả SQLite (local) và PostgreSQL (production)

### 7.2 UI/UX Theme
- **Màu nền:** `#080D0C` (Obsidian Dark Green)
- **Màu chữ vàng:** `#D4AF37` (Antique Gold)
- **Font:** Cinzel, Playfair Display, Merriweather (Serif cổ điển)
- **Canvas:** Chiếm >= 85% viewport

### 7.3 Tính năng Side Panel
- Desktop: Trượt từ phải sang
- Mobile: Trượt từ dưới lên

### 7.4 Code Quality Rules
- File nhỏ, tách biệt rõ ràng: DB connection / API routing / business logic
- Không ghi đè file hiện có khi không cần thiết (chỉ update diff)
- Có test tự động cho mọi API critical
