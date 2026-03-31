# AI 抠图工具 🎨

AI 智能抠图工具，基于 Next.js + Tailwind CSS + Remove.bg API

## 功能

- 📤 图片上传（支持 JPG/PNG，最大 10MB）
- 🤖 AI 自动抠图
- 💾 一键下载透明背景图片
- 📱 响应式设计，支持手机和电脑

## 技术栈

| 技术 | 说明 |
|------|------|
| 前端 | Next.js 14 (App Router) |
| 样式 | Tailwind CSS |
| AI | Remove.bg API |
| 部署 | Vercel / 本地 |

## 快速开始

### 本地运行

```bash
# 克隆项目
git clone https://github.com/wdsl888/image-background-remover.git
cd image-background-remover

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

### 环境变量

在项目根目录创建 `.env.local` 文件：

```env
REMOVE_BG_API_KEY=your_api_key_here
```

API Key 申请地址：[https://www.remove.bg/api](https://www.remove.bg/api)

> ⚠️ 项目已内置免费 API Key，每日有限额

## 部署

### Vercel（推荐）

1. 点击 [Deploy to Vercel](https://vercel.com/new/import?s=https://github.com/wdsl888/image-background-remover)
2. 导入 GitHub 仓库
3. 点击 Deploy

### Docker

```bash
docker build -t image-background-remover .
docker run -p 3000:3000 image-background-remover
```

## 项目结构

```
src/app/
├── api/remove-bg/    # 抠图 API 接口
├── page.tsx          # 主页面
├── layout.tsx        # 布局
└── globals.css       # 全局样式
```

## 免费额度

| 服务商 | 免费额度 |
|--------|----------|
| Remove.bg | 50 次/月 |

## 许可证

MIT
