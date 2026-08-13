# Frontend UI/UX - Thiết Kế Giao Diện Gia Phả Họ Văn Phú

> **Cập nhật:** 2026-08-13  
> **Triết lý thiết kế:** Classic Vintage & Mystical — Tôn vinh lịch sử dòng họ

---

## 1. Triết Lý Thiết Kế

Giao diện phải truyền tải **cảm giác tôn kính, lịch sử, và huyền bí** khi người dùng nhìn vào cây gia phả. Không dùng:
- ❌ Corporate flat UI (màu sáng, góc vuông)
- ❌ Bright/pastel colors
- ❌ Material Design thông thường

Thay vào đó sử dụng:
- ✅ Dark obsidian background với hiệu ứng cổ điển
- ✅ Antique gold accents
- ✅ Serif fonts mang hơi thở cổ điển
- ✅ Slow, smooth, mystical animations

---

## 2. Color Palette (Bảng Màu)

| Tên Màu | Hex Code | Ứng Dụng |
|---------|----------|----------|
| **Obsidian Dark** | `#080D0C` | Màu nền chính toàn trang |
| **Dark Teal** | `#0A1512` | Nền header, panels |
| **Antique Gold** | `#D4AF37` | Màu chữ tên, borders, accents |
| **Bronze** | `#B8AC8E` | Màu chữ phụ, metadata |
| **Parchment** | `#F5E6C8` | Màu chữ trắng ấm |
| **Dark Card** | `#111C19` | Nền card node trong D3 tree |
| **Gold Light** | `rgba(212,175,55,0.3)` | Divider lines, borders mờ |
| **Male Blue** | `#4A90D9` | Badge dot Nam |
| **Female Pink** | `#EC4899` | Badge dot Nữ |

---

## 3. Typography (Phông Chữ)

```html
<!-- Google Fonts Import -->
<link href="https://fonts.googleapis.com/css2?
  family=Cinzel:wght@500;700;900&
  family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&
  family=Playfair+Display:ital,wght@0,600;0,800;1,600&
  display=swap" rel="stylesheet">
```

| Font | Trọng số | Ứng dụng |
|------|----------|----------|
| **Cinzel** | 700/900 | Tiêu đề chính "GIA PHẢ HỌ VĂN PHÚ" |
| **Playfair Display** | 600/800 | Tên thành viên trong side panel |
| **Merriweather** | 400/700 | Nội dung, ghi chú, labels |
| **Sans-serif (system)** | 400 | Metadata, số liệu nhỏ |

---

## 4. Bố Cục Giao Diện (Layout)

```
┌────────────────────────────────────────────────┐
│  HEADER BAR (~60px)                            │
│  [🌲 GIA PHẢ HỌ VĂN PHÚ]  [🔍 Search] [PDF]  │
├──────────────────────────┬─────────────────────┤
│                          │   SIDE PANEL        │
│   TREE CANVAS (D3.js)    │   (slide từ phải)  │
│   >= 85% viewport        │   - Avatar          │
│                          │   - Thông tin       │
│   [+] [-] [⊙]           │   - Quan hệ         │
│   [📂] [📁]              │   - Ghi chú         │
│                          │                     │
│   ● Nam  ● Nữ  ★ Tổ    │                     │
│   Tổng số: 106 thành viên│                     │
└──────────────────────────┴─────────────────────┘
```

### Mobile Layout (< 768px)
- Header: Stack dọc (brand trên, tools dưới)
- Side Panel: Slide từ **dưới lên** (bottom sheet)
- Tree Canvas: 100% width

---

## 5. D3.js Tree Visualization

### 5.1 Node Card Structure
```
┌─────────────────────────────┐
│ Đời 3                    ⊕ │  ← Generation badge + expand icon
│─────────────────────────────│  ← divider (gold 30%)
│ Văn Phú Tèo                │  ← Full name (Playfair Display)
│ Vợ: Bà Nguyễn Thị Lan      │  ← Spouse / meta (Merriweather)
└─────────────────────────────┘
```

- **Width:** 200px
- **Height:** 80px
- **Border radius:** 8px
- **Border màu vàng:** `#D4AF37` khi selected
- **Animation:** Cubic Bezier transitions, 400ms

### 5.2 Link Lines
- Đường cong Bezier (`M ... C ...`) nối cha → con
- Màu: `rgba(212, 175, 55, 0.4)` (gold mờ)

### 5.3 Expand/Collapse
- `⊕` = Đang thu gọn (có hidden children) → click để mở
- `⊖` = Đang mở rộng (có children hiện) → click để thu
- Mặc định: Thu gọn các node ở đời >= 3 khi load

### 5.4 Zoom & Pan
- Scale: 0.15x → 2.5x
- Reset: Pan về trung tâm, scale 0.85
- Focus node: Tự động canh giữa khi chọn từ search

---

## 6. Side Panel Chi Tiết

### Các Thông Tin Hiển Thị
- **Avatar icon:** `fa-user-tie` (Nam/vàng) hoặc `fa-user-nurse` (Nữ/hồng)
- **Tên thành viên** (to, Playfair Display)
- **Badge:** Đời X | Nam/Nữ | Còn sống/Đã mất
- **Quan hệ gia đình:** ID, Cha/Mẹ, Thứ tự con, Vợ/Chồng, Phân nhánh
- **Thông tin bổ sung:** Năm sinh, Ngày giỗ âm lịch, Mộ phần, Ghi chú tiểu sử

### Animation
```css
/* Desktop: Slide từ phải */
.side-panel {
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.side-panel:not(.hidden) {
    transform: translateX(0);
}

/* Mobile: Slide từ dưới */
@media (max-width: 768px) {
    .side-panel {
        transform: translateY(100%);
    }
}
```

---

## 7. Search Bar

- Input: Full-width với icon kính lúp
- Tìm kiếm real-time theo: `full_name`, `id`, `branch_name`, `notes`
- Dropdown kết quả: Tối đa 10 kết quả
- Click kết quả: Focus & highlight node trên cây + mở side panel

---

## 8. PDF Export

- Nút "Xuất PDF" (gold button)
- Capture toàn bộ `#treeContainer` bằng `html2canvas` (scale 2x)
- Tạo PDF A4 Landscape
- Header PDF: "SƠ ĐỒ CÂY GIA PHẢ HỌ VĂN PHÚ" màu vàng
- Footer PDF: URL website + ngày xuất

---

## 9. Loading States

- Spinner cổ điển (vintage spinner CSS animation)
- Text: "Đang tải sơ đồ Gia Phả Họ Văn Phú..."
- Nền: Màu tối, centered

---

## 10. Responsive Breakpoints

| Breakpoint | Hành vi |
|-----------|---------|
| `>= 1024px` | Full desktop layout, side panel bên phải |
| `768px - 1023px` | Tablet: Side panel overlay toàn màn hình |
| `< 768px` | Mobile: Side panel slide từ dưới lên |

---

## 11. Yêu Cầu Nâng Cấp UI (Tương Lai)

- [ ] Thêm ảnh đại diện thành viên (từ URL hoặc upload)
- [ ] Hiệu ứng particle/dust trên canvas để tăng chất huyền bí
- [ ] Bản đồ mộ phần (Google Maps embed)
- [ ] Chế độ in (Print CSS) tối ưu cho in giấy
- [ ] Dark/Light mode toggle (tùy chọn)
- [ ] Đa ngôn ngữ (Tiếng Việt / English)
- [ ] Timeline view (hiển thị theo dòng thời gian)
