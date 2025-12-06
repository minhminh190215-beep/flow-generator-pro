# Flow Generator Pro

Tool tạo ảnh AI sử dụng Google Labs Flow API.

## 🚀 Hướng dẫn Deploy lên Vercel

### Bước 1: Tạo Repository trên GitHub

1. Đăng nhập GitHub
2. Click **"New repository"** (nút xanh lá)
3. Đặt tên: `flow-generator-pro` (hoặc tên khác)
4. Chọn **Public** hoặc **Private**
5. Click **"Create repository"**

### Bước 2: Upload code lên GitHub

**Cách 1: Dùng GitHub Web (Đơn giản)**
1. Trong repo vừa tạo, click **"uploading an existing file"**
2. Kéo thả toàn bộ files vào
3. Click **"Commit changes"**

**Cách 2: Dùng Git (Command line)**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/flow-generator-pro.git
git push -u origin main
```

### Bước 3: Deploy lên Vercel

1. Truy cập https://vercel.com
2. Đăng nhập bằng GitHub
3. Click **"Add New..."** → **"Project"**
4. Chọn repo `flow-generator-pro`
5. Click **"Deploy"**
6. Chờ 1-2 phút để deploy xong

### Bước 4: Sử dụng

1. Sau khi deploy xong, Vercel sẽ cho bạn link như: `https://flow-generator-pro-xxx.vercel.app`
2. Mở link đó
3. Nhập Cookie từ labs.google/fx
4. Tạo ảnh!

## 📁 Cấu trúc Project

```
flow-generator-pro/
├── api/
│   └── index.js        # Backend API (Vercel serverless)
├── public/
│   └── index.html      # Frontend
├── package.json
├── vercel.json
└── README.md
```

## ⚠️ Lưu ý

- Cookie hết hạn sau vài giờ, cần lấy lại
- Không chia sẻ cookie với người khác
- Free tier của Vercel: 100GB bandwidth/tháng (đủ dùng)
