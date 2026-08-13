# Đề xuất Design System v2 — Gia Phả Họ Văn Phú
> Hướng: **Hiện đại, chuyên nghiệp** — thay thế triết lý "Mystical" trong `docs/03-frontend-ui-ux.md` hiện tại

---

## 1. Vì sao cần đổi hướng

Bản hiện tại (`vintage-theme`) có 2 vấn đề khiến giao diện "hiển thị tệ" **ngoài** lỗi routing đã sửa:

| Vấn đề trong code hiện tại | Ảnh hưởng |
|---|---|
| `Cinzel` làm font tiêu đề chính | Cinzel là font Latin cổ điển, **không hỗ trợ đầy đủ dấu tiếng Việt** (ư, ơ, các dấu thanh) — chữ "GIA PHẢ HỌ VĂN PHÚ" có thể bị fallback sang font hệ thống, vỡ kiểu chữ giữa trang |
| Glow/blur dùng ở gần như mọi thành phần (`box-shadow` phát sáng, `backdrop-filter: blur`, gradient 2 lớp) | Tạo cảm giác "giao diện game/fantasy" hơn là công cụ tra cứu tư liệu gia đình — không hợp "chuyên nghiệp" |
| Số size chữ rời rạc (20/16/14/13/12/11/10px) không theo hệ thống | Phân cấp thị giác không nhất quán, khó mở rộng thêm màn hình mới |
| Chấm màu Nam/Nữ dùng xanh dương/hồng bão hòa (`#4A90D9` / `#EC4899`) | Lệch tông hoàn toàn khỏi bảng màu vàng-đồng còn lại, trông như dán thêm vào |

**Định hướng mới** không bỏ hoàn toàn tinh thần "gia phả cổ" — mà chuyển từ *"huyền bí, phát sáng"* sang **"tư liệu lưu trữ được số hóa cẩn trọng"**: giống cách một bảo tàng hoặc thư viện quốc gia trình bày một cuốn gia phả cổ dưới ánh sáng phòng lưu trữ, không phải dưới ánh nến huyền ảo.

---

## 2. Bảng màu mới

| Tên | Hex | Vai trò |
|---|---|---|
| **Mực Đen** `ink` | `#1A1815` | Nền chính (thay obsidian) — đen ấm, không phải đen thuần |
| **Giấy Cũ** `surface` | `#242018` | Nền card, panel, header |
| **Ngà** `text-primary` | `#EAE3D3` | Chữ chính trên nền tối |
| **Đồng Cổ** `accent-gold` | `#B58A3F` | Thay `--gold-primary` — trầm hơn, bớt "vàng kim game" |
| **Son Triện** `accent-red` | `#A6402E` | **Màu tín hiệu duy nhất** — chỉ dùng cho: nút hành động chính, viền node Thủy Tổ, dấu triện (mục 5) |
| **Rêu Phong** `text-muted` | `#8A8977` | Chữ phụ, metadata, thay cho parchment-muted |

Quy tắc dùng màu: **vàng đồng = phân cấp** (tiêu đề, viền, trạng thái chọn), **đỏ son = duy nhất 1 điểm nhấn** trên mỗi màn hình. Bỏ hẳn glow/blur nhiều lớp — dùng viền mảnh (1px) thay bóng đổ lan tỏa.

Bỏ cặp xanh/hồng cho Nam/Nữ. Thay bằng chữ viết tắt trong badge nhỏ (`Nam` / `Nữ`, chữ thường, không chấm màu) — vừa hợp tông, vừa không cần giải thích màu nào là gì.

---

## 3. Typography

```html
<link href="https://fonts.googleapis.com/css2?
  family=Noto+Serif:ital,wght@0,600;0,700;1,600&
  family=Inter:wght@400;500;600;700&
  family=IBM+Plex+Mono:wght@400;500&
  display=swap" rel="stylesheet">
```

| Font | Vai trò | Vì sao |
|---|---|---|
| **Noto Serif** | Tiêu đề, tên thành viên | Hỗ trợ đầy đủ dấu tiếng Việt (thay Cinzel/Playfair — cả 2 đều rủi ro về dấu), vẫn giữ chất "serif trang trọng" |
| **Inter** | Body, label, nút — *giữ nguyên*, đã dùng tốt | Trung tính, hiện đại, đọc tốt ở size nhỏ |
| **IBM Plex Mono** | Mã thành viên (`p1`, `p2`...), Đời số, ngày tháng | Gợi cảm giác "số hiệu hồ sơ lưu trữ" — chi tiết nhỏ này tạo cảm giác chuyên nghiệp hơn hẳn so với dùng chung 1 font sans cho mọi số liệu |

Bỏ `Merriweather` và `Playfair Display` (giảm 1 request font, tránh 2 serif cạnh tranh nhau trong cùng 1 layout).

---

## 4. Layout & component — giữ cấu trúc, đổi cách thực thi

Cấu trúc trong `docs/03-frontend-ui-ux.md` (header 65px, canvas ≥85%, side panel trượt phải, floating controls) **vẫn hợp lý, không cần đổi**. Chỉ đổi cách render từng phần:

- **Node card trên D3 tree:** bỏ `drop-shadow` phát sáng khi hover → chỉ đổi màu viền từ đồng sang sáng hơn 1 chút + tăng độ dày viền 0.5px. Node Thủy Tổ (đời 1) là node **duy nhất** có viền đỏ son + nền hơi khác, để mắt người xem tự nhiên tìm ra gốc tổ mà không cần chú thích.
- **Search dropdown, side panel:** bỏ `backdrop-filter: blur`, dùng nền đặc `--surface` + viền 1px `--accent-gold` mờ 30%.
- **Nút "Xuất PDF":** đổi từ gradient vàng sang **đỏ son đặc** (`--accent-red`) — đây là hành động quan trọng nhất trên trang, xứng đáng là nơi duy nhất dùng màu tín hiệu.
- **Badge Đời / trạng thái:** dùng font `IBM Plex Mono`, nền `--surface`, chữ `--accent-gold`, bỏ bo tròn pill quá lớn (giảm `border-radius` xuống 4-6px thay vì 12-20px) — pill tròn nhiều dễ trông "app di động vui nhộn" hơn là "hồ sơ lưu trữ".

---

## 5. Signature element — dấu triện

Điểm nhấn thị giác **duy nhất** của toàn bộ thiết kế: một **con dấu son hình tròn** (giống dấu triện đóng trên gia phả/sắc phong thật), đặt ở:
- Góc trên-trái node Thủy Tổ trên cây
- Góc dưới-phải mỗi bản PDF xuất ra (thay watermark hiện tại)

Chỉ 1 nơi dùng hiệu ứng nổi bật (đỏ son, có thể xoay nhẹ 3-5°) — mọi thứ còn lại trong giao diện phẳng, tĩnh, im lặng. Đây là cách tạo "một khoảnh khắc đáng nhớ" mà không cần rải hiệu ứng khắp nơi như bản hiện tại.

---

## 6. Áp dụng nhanh — map biến CSS cũ → mới

Chỉ cần sửa khối `:root` trong `style.css`, phần lớn code còn lại (dùng `var(--...)`) tự động ăn theo:

```css
:root {
    --bg-dark-obsidian: #1A1815;
    --bg-dark-emerald: #1A1815;
    --bg-card-gradient: #242018;
    --bg-panel: #242018;

    --gold-primary: #B58A3F;
    --gold-light: #D3B673;
    --gold-bright: #B58A3F;
    --gold-border: rgba(181, 138, 63, 0.3);
    --gold-glow: rgba(181, 138, 63, 0.15);

    --parchment-text: #EAE3D3;
    --parchment-muted: #8A8977;

    --seal-red: #A6402E;

    --font-heading: 'Noto Serif', Georgia, serif;
    --font-body: 'Inter', system-ui, sans-serif;
    --font-mono: 'IBM Plex Mono', monospace;

    --shadow-vintage: 0 2px 8px rgba(0, 0, 0, 0.4);
}
```

Đổi thêm 3 chỗ trong code (không đổi biến được vì đang hardcode):
1. `.btn-gold` → đổi `linear-gradient(...)` thành `background: var(--seal-red); color: var(--parchment-text);`
2. `.dot-male` / `.dot-female` → bỏ, thay bằng `<span class="badge-text">Nam</span>` kiểu chữ thường
3. `.node-rect` (trong `tree_visualizer.js`, phần style JS) → bỏ `filter: drop-shadow(...)` ở trạng thái mặc định, chỉ giữ ở trạng thái `.selected`

---

## 7. Việc không cần làm lại

Giữ nguyên toàn bộ: bố cục header/canvas/panel, cơ chế zoom/pan D3, expand/collapse, cách side panel trượt trên mobile, cấu trúc search dropdown. Đây đều là quyết định UX đúng, vấn đề chỉ nằm ở lớp "trang trí" (màu, font, hiệu ứng) — nên chi phí sửa thấp, không cần viết lại HTML/JS.
