# 🎨 Gallery Backend API

Professional File Upload va Gallery Management tizimi. Node.js, Express, MongoDB va Multer ishlatilgan.

## 🌟 Xususiyatlari

### ✅ File Upload
- ✨ **Smart Upload**: Rasm, video va boshqa fayllar avtomatik ajratiladi
- 🔒 **File Size Limits**: Image (20MB), Video (50MB)
- 🎯 **Duplicate Detection**: MD5 hash orqali bir xil fayllarni aniqlash
- 📦 **Multiple Upload**: Bir vaqtda 10 tagacha fayl
- 🌐 **Dynamic URL**: Development/Production uchun avtomatik URL yaratish

### 🖼️ Gallery Management
- 📋 CRUD operatsiyalari
- 🔍 Filter (file_type bo'yicha)
- 🗑️ Smart Delete (fayl cron job orqali tozalanadi)

### ⏰ Cron Job
- 🧹 Avtomatik tozalash (har kuni 02:00)
- 🗑️ is_use=false va 7+ kun o'tgan fayllarni o'chirish
- 🎛️ Manual cleanup endpoint

### 🔐 Security & Best Practices
- 🛡️ Helmet (HTTP headers protection)
- 🌍 CORS enabled
- ✅ Express Validator
- 📝 Swagger API Documentation
- 🎯 RESTful API design

---

## 🚀 O'rnatish

```bash
# 1. Repositoriyani clone qiling
git clone <your-repo>
cd gallery_backend

# 2. Dependencies o'rnating
npm install

# 3. .env fayl yarating
cp .env.example .env

# 4. .env ni to'ldiring
nano .env

# 5. MongoDB ishga tushiring
sudo systemctl start mongod

# 6. Server ishga tushiring
npm run dev
```

---

## ⚙️ Environment Variables

```env
# Server
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/gallery_db

# Base URL (Production uchun)
# Development da bo'sh qoldirsangiz avtomatik aniqlanadi
BASE_URL=
```

---

## 📚 API Endpoints

### Upload Endpoints

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/upload/file` | Bitta fayl yuklash |
| POST | `/upload/files` | Ko'p fayl yuklash (max 10) |
| POST | `/upload/cleanup` | Manual tozalash (Admin) |

### Gallery Endpoints

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/gallery/create` | Gallereyaga qo'shish |
| GET | `/gallery/get-all` | Barcha fayllar |
| GET | `/gallery/get-all?file_type=image` | Filter (image/video/other) |
| DELETE | `/gallery/:id` | Gallereyadan o'chirish |

---

## 📖 API Documentation

Swagger UI: **http://localhost:3000/api-docs**

---

## 🧪 Test Qilish

Batafsil test qo'llanmasi: [TEST_GUIDE.md](TEST_GUIDE.md)

**Quick Test:**
```bash
# Upload
curl -X POST -F "file=@test.jpg" http://localhost:3000/upload/file

# Get all
curl http://localhost:3000/gallery/get-all

# Delete
curl -X DELETE http://localhost:3000/gallery/:id
```

---

## 📁 Loyiha Tuzilishi

```
gallery_backend/
├── src/
│   ├── controllers/       # Business logic
│   │   ├── gallery/
│   │   └── upload/
│   ├── models/            # MongoDB schemas
│   │   ├── gallery/
│   │   └── upload/
│   ├── routes/            # API routes
│   │   ├── gallery/
│   │   └── upload/
│   ├── middlewares/       # Error handling, etc
│   ├── validators/        # Express validator
│   ├── utils/             # Helper functions
│   │   ├── async-handler.js
│   │   ├── config.database.js
│   │   ├── cron-jobs.js
│   │   ├── file-hash.js
│   │   ├── http-exception.js
│   │   ├── upload-file.js
│   │   └── url-helper.js
│   ├── index.js           # Entry point
│   └── swagger.js         # API documentation
├── public/
│   └── uploads/
│       ├── images/
│       ├── videos/
│       └── others/
├── .env.example
├── package.json
├── YAXSHILASHLAR.md      # Yaxshilashlar haqida
└── TEST_GUIDE.md         # Test qo'llanmasi
```

---

## 🔥 Asosiy Funksiyalar

### 1. Duplicate Detection
Bir xil faylni ikki marta yuklasa, avvalgi faylni qaytaradi:

```javascript
// Birinchi yuklash
{ "is_duplicate": false, "url": "..." }

// Ikkinchi yuklash (bir xil fayl)
{ "is_duplicate": true, "url": "...", "message": "Bu fayl avval yuklangan" }
```

### 2. Smart URL Generation
```javascript
// Development
http://localhost:3000/uploads/images/abc.jpg

// Production (.env da BASE_URL)
https://api.example.com/uploads/images/abc.jpg
```

### 3. Cron Job - Avtomatik tozalash
```javascript
// Har kuni 02:00 da
// is_use=false va 7+ kun o'tgan fayllar o'chiriladi
⏰ Cron job faollashtirildi: Har kuni soat 02:00 da ishga tushadi
```

---

## 🛠️ Technologies

- **Backend**: Node.js, Express 5
- **Database**: MongoDB, Mongoose
- **File Upload**: Multer
- **Validation**: Express Validator
- **Scheduling**: node-cron
- **Security**: Helmet, CORS
- **Documentation**: Swagger (swagger-jsdoc, swagger-ui-express)
- **Utils**: UUID, crypto (MD5 hash)

---

## 📝 Keyingi Qadamlar

- [ ] Authentication/Authorization (JWT)
- [ ] Rate Limiting (DDoS protection)
- [ ] Image Optimization (sharp package)
- [ ] Video Thumbnail generation
- [ ] Pagination (cursor-based)
- [ ] S3/CloudFlare R2 integration
- [ ] Unit/Integration tests
- [ ] Docker containerization
- [ ] CI/CD pipeline

---

## 👨‍💻 Muallif

Jorabek - Backend Developer

---

## 📄 License

MIT

---

## 🤝 Contributing

Pull requests are welcome!

---

## 📞 Support

Savollaringiz bormi? Issue oching yoki email yuboring.

---

**⭐ Agar foydali bo'lsa, star bering!**
