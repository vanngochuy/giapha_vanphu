# Database Schema - Hệ Thống Gia Phả Họ Văn Phú

> **Cập nhật:** 2026-08-13

---

## 1. Bảng Chính: `family_members`

SQLAlchemy ORM model (`backend/app/models.py`), tương thích cả SQLite và PostgreSQL.

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|-------------|-----------|-------|
| `id` | VARCHAR(20) | PRIMARY KEY | Mã thành viên, VD: `VP-001` |
| `parent_id` | VARCHAR(20) | FK → `family_members.id`, NULLABLE | Tự tham chiếu để tạo cây phân cấp |
| `full_name` | VARCHAR(100) | NOT NULL, INDEX | Họ và tên đầy đủ |
| `generation` | INTEGER | NOT NULL, INDEX | Số đời (1, 2, 3..., 6) |
| `order_in_family` | INTEGER | NULLABLE | Thứ tự trong gia đình (con thứ mấy) |
| `gender` | VARCHAR(10) | NULLABLE | `Nam` / `Nữ` |
| `spouse` | VARCHAR(250) | NULLABLE | Tên vợ / chồng |
| `branch_name` | VARCHAR(100) | NULLABLE | Tên nhánh, VD: `Nhánh Ông Văn Phú Nọc` |
| `status` | VARCHAR(20) | DEFAULT `Còn sống` | `Còn sống` / `Đã mất` |
| `birth_year` | VARCHAR(20) | NULLABLE | Năm sinh |
| `death_date_lunar` | VARCHAR(50) | NULLABLE | Ngày giỗ âm lịch, VD: `15 tháng 7 AL` |
| `burial_place` | TEXT | NULLABLE | Nơi an táng / mộ phần |
| `notes` | TEXT | NULLABLE | Ghi chú tiểu sử, nơi ở |

---

## 2. Sơ Đồ Quan Hệ

```
family_members
┌──────────────────────────────────────────────────┐
│  id (PK, VARCHAR 20)  ← VP-001, VP-002...        │
│  parent_id (FK → id)  ← Tự tham chiếu           │
│  full_name            ← Tên đầy đủ              │
│  generation           ← Đời 1 → 6              │
│  order_in_family      ← Thứ tự con trong gia đình│
│  gender               ← Nam / Nữ               │
│  spouse               ← Tên vợ/chồng           │
│  branch_name          ← Tên nhánh dòng họ       │
│  status               ← Còn sống / Đã mất       │
│  birth_year           ← Năm sinh               │
│  death_date_lunar     ← Ngày giỗ âm lịch        │
│  burial_place         ← Nơi an táng            │
│  notes                ← Ghi chú               │
└──────────────────────────────────────────────────┘
         ▲ parent_id FK tự tham chiếu (self-join)
         │
         └─── Cho phép xây dựng cây phân cấp đa cấp
```

---

## 3. Thuật Toán Truy Vấn Cây: WITH RECURSIVE CTE

```sql
WITH RECURSIVE family_tree AS (
    -- Base case: Gốc cây (Thuỷ Tổ) - parent_id IS NULL
    SELECT
        id, parent_id, full_name, generation, order_in_family,
        gender, spouse, branch_name, status, birth_year,
        death_date_lunar, burial_place, notes, 0 as level
    FROM family_members
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive step: Lấy con cháu liên kết theo parent_id
    SELECT
        m.id, m.parent_id, m.full_name, m.generation, m.order_in_family,
        m.gender, m.spouse, m.branch_name, m.status, m.birth_year,
        m.death_date_lunar, m.burial_place, m.notes, ft.level + 1
    FROM family_members m
    INNER JOIN family_tree ft ON m.parent_id = ft.id
)
SELECT * FROM family_tree ORDER BY generation ASC, order_in_family ASC;
```

**Ưu điểm:** Lấy toàn bộ 106 thành viên (6 đời) **chỉ trong 1 lần query**, backend tái cấu trúc thành nested JSON.

---

## 4. Cấu Trúc JSON Trả Về (Nested Tree)

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "VP-001",
      "parent_id": null,
      "full_name": "Văn Phú Dưỡng",
      "generation": 1,
      "gender": "Nam",
      "branch_name": "Dòng Chính",
      "status": "Đã mất",
      "spouse": "Bà Nguyễn Thị...",
      "children": [
        {
          "id": "VP-002",
          "parent_id": "VP-001",
          "full_name": "Văn Phú Nọc",
          "generation": 2,
          "children": [...]
        },
        ...
      ]
    }
  ]
}
```

---

## 5. Cấu Trúc File Excel Gốc (`GiaPha_VanPhu.xlsx`)

Sheet đầu tiên (active sheet), bỏ qua hàng tiêu đề, các cột theo thứ tự:

| Cột (index) | Tên cột | Ví dụ |
|-------------|---------|-------|
| 0 | STT | 1, 2, 3... |
| 1 | Đời (generation) | 1, 2, 3... |
| 2 | Thứ tự trong gia đình | 1, 2, 3... |
| 3 | Họ và tên | Văn Phú Dưỡng |
| 4 | Giới tính | Nam / Nữ |
| 5 | Vợ / Chồng | Bà Nguyễn Thị... |
| 6 | Ghi chú | Đã mất, nơi ở... |
| 7 | Tên cha/mẹ (parent_name) | Văn Phú Nọc |
| 8 | Tên nhánh | Nhánh Ông Văn Phú Nọc |

---

## 6. Lưu Ý Tính Toán Status

Logic trong `seed.py`:
```python
status = "Còn sống"
if notes and ("chết" in notes.lower() or "đã mất" in notes.lower()):
    status = "Đã mất"
```

> **TODO:** Cần bổ sung cột `status` / `death_date` riêng trong Excel để tránh phụ thuộc vào text trong cột ghi chú.

---

## 7. Yêu Cầu Nâng Cấp Schema (Tương Lai)

| Cột mới | Kiểu | Mô tả |
|---------|------|-------|
| `birth_date` | DATE | Ngày tháng năm sinh đầy đủ |
| `death_date` | DATE | Ngày tháng năm mất (dương lịch) |
| `photo_url` | TEXT | Link ảnh thành viên |
| `address` | TEXT | Địa chỉ hiện tại |
| `occupation` | VARCHAR(100) | Nghề nghiệp |
| `spouse_id` | VARCHAR(20) | FK → id (nếu vợ/chồng cũng trong cây) |
| `created_at` | TIMESTAMP | Thời gian tạo bản ghi |
| `updated_at` | TIMESTAMP | Thời gian cập nhật |
