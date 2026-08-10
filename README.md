# Zawer - 附近 Zawer 地图 🗺️

![Project Status](https://img.shields.io/badge/Status-WIP-yellow) ![License](https://img.shields.io/badge/License-MIT-blue)

> ⚠️ **高能预警**：
> 四川方言 "Zawer" 意为"差劲的、劣质的"。
> 本地图评分**越高**，代表店铺越**Zawer**（越坑）！
>
> "Zawer 货"用以形容劣质商品

## 📖 产品简介

Zawer 是一个网页应用，让用户查看附近的商家 Zawer 评分。评分越高，说明这家店越"Zawer"——越值得避坑。

这不是一个普通的点评 App，而是一个反消费陷阱指南。用轻松幽默的方式，帮助用户避开那些"踩坑"商家。

## 📉 Zawer 指数说明（避坑必读）

| Zawer 指数 | 含义 | 建议 | 表情 |
|:---:|:---|:---|:---:|
| **5.0** | **极度 Zawer** | 🚫 必须绕道 | 😡 / 💩 |
| **4.0** | 很 Zawer | ⚠️ 慎重选择 | 😨 |
| **3.0** | 一般 Zawer | 🤔 可以尝试 | 😐 |
| **2.0** | 不太 Zawer | 👌 放心消费 | 🙂 |
| **1.0** | **一点都不 Zawer** | ✅ 强烈推荐 | 😍 / 💎 |

## 🛠 技术架构

- **前端**：React 18 + TypeScript + Vite
- **UI 库**：Tailwind CSS + ShadcnUI (推荐，轻量且现代)
- **地图**：高德地图 JS API 2.0
- **后端**：Node.js (NestJS / Koa)
- **数据库**：PostgreSQL
- **部署**：Vercel / Docker

## 核心功能

### 1. Zawer 地图
- 展示用户附近的商家位置
- 商家图标颜色代表 Zawer 等级（红色=高 Zawer，绿色=低 Zawer）
- 一目了然，快速决策

### 2. 商家评分
- 1-5 分制 Zawer 评分（见上表）
- 评分来源：真实用户评价 + 众包数据

### 3. 避坑指南
- 用户可对商家进行 Zawer 评分
- 撰写点评，分享"踩坑"经历
- 查看其他用户的真实评价

### 4. 搜索与筛选
- 按品类筛选（餐饮、住宿、出行等）
- 按 Zawer 等级筛选
- 关键词搜索商家

## 目标用户

- 消费者：避免踩坑，做出明智的消费决策
- 热衷发现"宝藏店铺"的用户
- 喜欢分享消费心得的社交用户

## 产品特色

- **幽默接地气**：用川渝方言表达，贴近用户生活
- **真实客观**：众包评分，拒绝刷单
- **简单高效**：地图 + 评分，快速决策

## 开发计划

### 第一阶段：项目初始化

- [ ] 初始化前端项目（React + TypeScript + Vite）
- [ ] 配置开发环境 ESLint + Prettier + Tailwind CSS
- [ ] 搭建项目目录结构

### 第二阶段：地图模块

- [ ] 集成地图 SDK（高德地图）
- [ ] 实现地图展示和定位
- [ ] 商家标注和 Zawer 等级可视化

### 第三阶段：核心功能

- [ ] 开发商家详情页
- [ ] 实现评分和点评功能
- [ ] 搜索与筛选功能

### 第四阶段：用户系统

- [ ] 用户登录/注册
- [ ] 个人中心
- [ ] 收藏和历史记录

### 第五阶段：优化上线

- [ ] 性能优化
- [ ] 移动端适配
- [ ] 部署上线

## 🚀 快速开始

```bash
# Clone the repository
git clone https://github.com/your-username/zawer.git

# Enter the project directory
cd zawer

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🧪 本地 Demo 运行方式

当前仓库的本地演示模式需要同时启动前端和后端，并在根目录准备一份本地配置文件。

### 1. 安装依赖

在仓库根目录执行：

```bash
npm install
cd server && npm install && cd ..
```

### 2. 创建本地配置文件

复制根目录模板：

```bash
cp .env.local.example .env.local
```

然后至少补齐以下配置：

```env
VITE_AMAP_KEY=你的高德地图Key
VITE_AMAP_SECRET=你的高德地图Secret
JWT_SECRET=你自己的本地JWT密钥
```

说明：

- 前端默认运行在 `http://localhost:3000`
- 后端默认运行在 `http://localhost:4000`
- 前端默认通过 `VITE_API_BASE_URL=/api` 走本地代理访问后端

### 3. 初始化演示数据

```bash
npm run seed:server
```

这一步会写入本地 SQLite 演示数据，包括：

- 测试用户
- 商家列表
- 点评数据

### 4. 一键启动 Demo

推荐直接执行：

```bash
npm run demo:seed
```

如果你不想每次都重置数据，也可以执行：

```bash
npm run demo
```

启动后访问：

- 前端页面：`http://localhost:3000`
- 后端 Swagger：`http://localhost:4000/api-docs`

### 5. 演示登录方式

当前本地 demo 使用演示验证码逻辑：

- 手机号：任意合法 11 位手机号
- 验证码：`1234`

### 6. 常见问题

- 地图加载失败：通常是 `.env.local` 中没有正确填写 `VITE_AMAP_KEY`
- 接口请求失败：请确认后端已经启动，且端口为 `4000`
- 登录后状态异常：可尝试清空浏览器本地存储中的 `auth-storage` 和 `token`

更完整的本地演示说明见 `/Users/liyang/Desktop/abula_project/Zawer/docs/LOCAL_DEMO.md`

## 🤝 如何贡献 (Contributing)

欢迎提交 Issue 或 Pull Request！请查阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解更多详情。

---

*本产品旨在帮助消费者做出更明智的消费决策，同时为商家提供改进服务的参考。*
