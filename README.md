# ContentForge AI

<div align="center">

**一次输入，生成所有平台的适配内容**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

[Live Demo](#) · [中文文档](#中文文档)

</div>

---

## 📖 项目简介

ContentForge AI 是一个智能内容生成平台，可以帮助创作者一次性将内容适配到多个社交平台。

### 核心功能

- 🎯 **一键生成** - 输入一次内容，自动生成 Twitter、LinkedIn、Instagram 等平台的适配版本
- 🤖 **AI 驱动** - 基于 Claude AI，智能理解内容并调整风格
- 🔗 **平台连接** - 支持 OAuth 2.0 连接多个社交平台
- ✏️ **实时编辑** - 内置内容编辑器，支持撤销/重做
- 📝 **预设模板** - 7 种常用模板，快速开始创作

### 支持的平台

| 平台 | 状态 |
|------|------|
| Twitter/X | ✅ 支持 |
| LinkedIn | ✅ 支持 |
| Instagram | ✅ 支持 |
| TikTok | ✅ 支持 |
| Newsletter | ✅ 支持 |

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/asiansumer/contentforge-ai.git
cd contentforge-ai
```

### 2. 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，添加以下配置：

```env
# ====================================
# 必需配置 - AI API
# ====================================
# Anthropic Claude API Key
# 获取地址: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxxxx

# ====================================
# 必需配置 - 社交平台 API
# ====================================
# Twitter / X
# 获取地址: https://developer.twitter.com/
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_REDIRECT_URI=http://localhost:3000/api/auth/twitter/callback

# LinkedIn
# 获取地址: https://www.linkedin.com/developers/
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/linkedin/callback

# Instagram (Facebook App)
# 获取地址: https://developers.facebook.com/
INSTAGRAM_APP_ID=your_instagram_app_id
INSTAGRAM_APP_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/auth/instagram/callback

# ====================================
# 数据库配置（可选）
# ====================================
# 支持 PostgreSQL、MySQL、SQLite
DATABASE_URL=postgresql://user:password@localhost:5432/contentforge

# ====================================
# 支付配置（可选）
# ====================================
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx

# ====================================
# 其他配置
# ====================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 启动开发服务器

```bash
# 方法 1: 使用 pnpm
pnpm run dev

# 方法 2: 使用 start.sh 脚本
chmod +x start.sh
./start.sh

# 方法 3: 使用 npm
npm run dev
```

服务器启动后，访问：

```
http://localhost:3000/generate
```

---

## 🧪 测试项目

### 本地测试步骤

#### 1. 测试页面加载

访问以下 URL，检查页面是否正常加载：

```
http://localhost:3000/generate     # 内容生成页面
http://localhost:3000/connect     # 账户连接页面
http://localhost:3000/           # 主页
```

#### 2. 测试 AI 内容生成

1. 访问 `/generate` 页面
2. 在输入框输入测试内容，例如：
   ```
   今天我学习了 Next.js 16 的新特性，包括 React 19、Turbopack 和服务端组件。
   感觉这些改进让开发体验更好了！
   ```
3. 选择平台（Twitter、LinkedIn、Instagram）
4. 选择语调（专业、轻松、幽默、正式）
5. 点击"开始生成"
6. 查看生成结果

#### 3. 测试社交平台连接

1. 访问 `/connect` 页面
2. 点击"连接"按钮
3. 系统会跳转到 OAuth 授权页面
4. 授权后返回，检查连接状态

#### 4. 测试 API 端点

使用 `curl` 或 Postman 测试 API：

```bash
# 测试内容生成 API
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "测试内容生成",
    "platforms": ["twitter", "linkedin"],
    "tone": "professional"
  }'

# 测试 Twitter OAuth 授权
curl -X GET http://localhost:3000/api/auth/twitter/authorize
```

#### 5. 测试构建

```bash
# 构建生产版本
pnpm run build

# 启动生产服务器
pnpm run start
```

---

## 📁 项目结构

```
contentforge-ai/
├── src/
│   ├── app/
│   │   ├── generate/              # 内容生成页面
│   │   ├── connect/              # 账户连接页面
│   │   └── api/
│   │       ├── generate/          # 内容生成 API
│   │       └── auth/             # OAuth 认证
│   ├── shared/
│   │   ├── components/           # 共享组件
│   │   ├── services/            # 业务服务
│   │   └── lib/                 # 工具函数
│   └── core/                    # 核心功能
├── public/                      # 静态资源
├── .env.local.example           # 环境变量示例
├── package.json
├── next.config.mjs
└── README.md
```

---

## 🔧 配置指南

### 获取 Anthropic API Key

1. 访问 https://console.anthropic.com/
2. 登录或注册账号
3. 进入 API Keys 页面
4. 点击 "Create Key"
5. 复制 API Key 并添加到 `.env.local`

### 获取 Twitter Developer Access

1. 访问 https://developer.twitter.com/
2. 申请开发者账号
3. 创建新应用
4. 配置 OAuth 2.0 回调 URL
5. 复制 Client ID 和 Client Secret

### 获取 LinkedIn API Keys

1. 访问 https://www.linkedin.com/developers/
2. 创建新应用
3. 配置 OAuth 2.0 设置
4. 复制 Client ID 和 Client Secret

---

## 🌐 部署到 Vercel

### 方法 1: 通过 Vercel 仪表板

1. 将代码推送到 GitHub
2. 访问 https://vercel.com/new
3. 导入 GitHub 仓库 `asiansumer/contentforge-ai`
4. 配置环境变量
5. 点击 "Deploy"

### 方法 2: 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

### 部署后的环境变量

在 Vercel 项目设置中添加以下环境变量：

```
ANTHROPIC_API_KEY
TWITTER_CLIENT_ID
TWITTER_CLIENT_SECRET
TWITTER_REDIRECT_URI=https://your-domain.vercel.app/api/auth/twitter/callback
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
LINKEDIN_REDIRECT_URI=https://your-domain.vercel.app/api/auth/linkedin/callback
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## 📊 技术栈

- **前端框架**: Next.js 16 (App Router)
- **UI 库**: React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4
- **组件库**: shadcn/ui
- **AI**: Anthropic Claude 3.5 Sonnet
- **认证**: Better Auth, OAuth 2.0
- **数据库**: Drizzle ORM
- **支付**: Stripe

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 📮 联系方式

- GitHub: [@asiansumer](https://github.com/asiansumer)
- Email: (可选)

---

**⭐ 如果这个项目对你有帮助，请给一个 Star！**
