# 🧾 Zuniswap UI Spec

## 🎨 Font
- Font chính: Inter
- Fallback: Helvetica Neue, sans-serif

## 🧱 Layout
- Card Width: `min-w-[480px]`, `max-w-[480px]`, `w-full`
- Card Center: `mx-auto`, `flex justify-center items-center min-h-screen`
- Padding Card: `px-8 py-6`

## 🌈 Colors
- Nền chính: `#0B0C10` (near-black)
- Gradient nút: `from-blue-500 to-purple-800`
- Text chính: `text-white`
- Text phụ: `text-gray-400`
- Hover Button: `hover:ring-4`, `hover:brightness-110`, `hover:shadow-xl`

## ⭕ Border & Shadow
- Border radius card: `rounded-3xl`
- Input/button: `rounded-xl`
- Shadow card: `shadow-[0_0_30px_rgba(0,0,0,0.4)]`

## 🧩 Component Rules

### Header
- Logo trái: `ZuniSwap` với chữ `Zuni` thường, `Swap` có màu `text-primary`
- Center Menu: `Trade | Explore | Pool`
- Nút `Connect Wallet` phải nổi bật, glow nhẹ
- Thêm thanh `underline` chuyển động khi active tab

### SwapCard
- Có 3 phần: Sell – Icon – Buy
- TokenSelector luôn hiển thị icon + tên
- Hiện balance phía trên bên phải
- Phía dưới input có dòng `$0.00` hiển thị value USD

### Footer
- Dòng `"The largest onchain marketplace..."` phải nhỏ hơn `text-sm`, `text-center`, `text-gray-400`

---

## 📁 Cấu trúc thư mục Production-ready

