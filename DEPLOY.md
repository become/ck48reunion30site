# 部署與開發指令手冊

## 專案架構

| 專案 | 說明 | 本地路徑 |
|------|------|----------|
| `ck48reunion30site` | 前端靜態網站 | `~/ck48reunion30site` |
| `reunion30-node` | 後端 API (Fastify + Prisma) | `~/reunion30-node` |

伺服器 IP：`159.223.40.36`

---

## 前端 ck48reunion30site

### Git 分支對應

| 分支 | 部署目標 | 網址 |
|------|----------|------|
| `main` | `/var/www/ck48` | https://ck48.reunion30.tw |
| `staging` | `/var/www/test-ck48` | https://test-ck48.reunion30.tw |
| `claude/deploy-github-pages-V761O` | (開發用，不自動部署) | — |

### 開發流程

```
Claude 開發 → claude/* 分支
    ↓ merge
  staging 分支 → 自動部署 test-ck48.reunion30.tw（測試）
    ↓ merge
   main 分支  → 自動部署 ck48.reunion30.tw（正式）
```

### 本地開發

```bash
cd ~/ck48reunion30site

# 啟動本地靜態伺服器（port 8080，避免與後端 3000 衝突）
npx serve . -l 8080
```

瀏覽器開啟：http://localhost:8080

> `js/api.js` 會自動偵測 localhost，切換到 http://localhost:3000

### 部署到測試環境

```bash
git add .
git commit -m "..."
git push origin staging
# GitHub Actions 自動 rsync 到 test-ck48.reunion30.tw
```

### 部署到正式環境

```bash
git checkout main
git merge staging
git push origin main
# GitHub Actions 自動 rsync 到 ck48.reunion30.tw
```

---

## 後端 reunion30-node

### 環境變數（`~/reunion30-node/.env`）

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB"
PORT=3000
NODE_ENV=development
CORS_ORIGINS=*
RECAPTCHA_SECRET=          # reCAPTCHA v3 secret key（正式環境填入）
```

### 本地開發

```bash
cd ~/reunion30-node

# 安裝相依套件（第一次）
npm install

# 同步 schema 到本地 DB + 產生 Prisma client
npx prisma db push

# 匯入種子資料（校友名單、班級）
npm run db:seed

# 啟動開發伺服器（hot reload，port 3000）
npm run dev

# 開啟 Prisma Studio（DB 視覺化介面）
npm run db:studio
```

### Schema 有變更時

```bash
npx prisma db push      # 更新 DB + 重新產生 Prisma client
```

### 部署到正式伺服器

#### 一般更新（無 schema 異動）

```bash
# 1. 本地推送程式碼
git push origin main

# 2. SSH 到伺服器
ssh root@159.223.40.36

# 3. 在伺服器上執行
cd /var/www/reunion30-node
git pull
npm install
npm run build:prod   # prisma generate + tsc
pm2 restart reunion30-api

# 4. 確認狀態
pm2 status
pm2 logs reunion30-api --lines 20
```

#### Schema 有異動時

在 `npm run build:prod` 前加一步：

```bash
git pull
npm install
npx prisma db push   # ← 先更新 DB schema
npm run build:prod
pm2 restart reunion30-api
```

#### 首次啟動（全新環境）

```bash
pm2 start ecosystem.config.js
pm2 save   # 讓 PM2 開機自動啟動
```

### 常用 PM2 指令（伺服器上）

```bash
pm2 status                         # 查看所有程序狀態
pm2 restart reunion30-api          # 重啟
pm2 logs reunion30-api --lines 50  # 查看最新 log
pm2 stop reunion30-api             # 停止
```

### 常用 API 測試指令

```bash
# 健康檢查
curl http://localhost:3000/health

# 取得班級列表
curl http://localhost:3000/api/classes \
  -H "X-Tenant-Slug: ck48"

# 取得統計
curl http://localhost:3000/api/stats \
  -H "X-Tenant-Slug: ck48"

# 報到（測試）
curl -X POST http://localhost:3000/api/checkin \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Slug: ck48" \
  -d '{"name":"姓名","classId":"1","phone":"0912345678"}'
```

---

## 首次建置（全新環境）

### 前端

```bash
git clone https://github.com/become/ck48reunion30site.git
cd ck48reunion30site
npx serve . -l 8080
```

### 後端

```bash
git clone https://github.com/become/reunion30-node.git
cd reunion30-node
npm install
cp .env.example .env   # 填入 DATABASE_URL
npx prisma db push
npm run db:seed
npm run dev
```
