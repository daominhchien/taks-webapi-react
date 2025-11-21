# 📌 Task WebAPI + React – Hướng dẫn chạy dự án

## 🚀 Giới thiệu
Dự án xây dựng hệ thống quản lý Task đơn giản gồm:
- Backend sử dụng ASP.NET Core Web API (.NET 8)
- Frontend React (Vite)
- Database MySQL

---

## 1. Câu lệnh SQL tạo database + bảng:

```sql
CREATE DATABASE TaskDb;
USE TaskDb;

CREATE TABLE Tasks (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(200) NOT NULL,
  DueDate DATETIME NOT NULL,
  Status VARCHAR(20) NOT NULL,
  CreatedDate DATETIME NOT NULL
);

SELECT * FROM Tasks;
```

## 2. Cấu hình Backend (.env)

Tạo file:
backend/.env

Nội dung:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=TaskDb

API_PORT=5000
```
## 3. ⚙ Cấu hình appsettings.json
```
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=TaskDb;User=root;Password=your_password"
  },
  "AllowedHosts": "*"
}
```

## 4. Chạy backend
```
# Backend (port 5000)
dotnet run --urls="http://localhost:5000"
```
API chạy tại: http://localhost:5000

## 5. Chạy Frontend

Cài dependencies
```
cd frontend
npm install
```

Tạo file .env cho FE
```
frontend/.env
```
Nội dung:
```
VITE_API_URL=http://localhost:5000
```

Chạy FE
```
# Frontend (port 5173)
npm run dev
```
API chạy tại: http://localhost:5173

