# Repository Guidelines

## Project Structure & Module Organization
- `src/`: 前端代码（React + TypeScript），按 `features/`（业务页面）、`components/`（通用组件）、`hooks/`、`services/`、`stores/` 分层。
- `server/src/`: 后端代码（NestJS + TypeORM），按 `modules/` 组织业务模块（`auth`、`merchants`、`reviews`、`users`），`entities/` 定义数据模型。
- `public/`: 前端静态资源；`docs/`: 项目文档与计划；`.husky/`: Git hooks。

## Build, Test, and Development Commands
- 前端安装与启动：`npm install`，`npm run dev`（Vite 本地开发，默认 `:5173`）。
- 前端构建与校验：`npm run build`（TypeScript 构建 + Vite 打包），`npm run lint`，`npm run format`。
- 后端安装与启动：`cd server && npm install && npm run start:dev`（NestJS watch 模式，默认 `:3000`）。
- 后端构建与运行：`cd server && npm run build && npm run start:prod`。
- 初始化数据：`cd server && npm run seed`。

## Coding Style & Naming Conventions
- 使用 2 空格缩进、LF 行尾、UTF-8（见 `.editorconfig`）。
- Prettier: 单引号、无分号、`trailingComma: all`、`printWidth: 100`。
- ESLint: `@typescript-eslint` + React Hooks 规则，禁止未使用变量（允许 `_` 前缀参数）。
- 命名建议：组件使用 `PascalCase`（如 `MapPage.tsx`），hooks 使用 `useXxx`，服务文件使用小写语义名（如 `merchant.ts`）。

## Testing Guidelines
- 当前仓库未包含自动化测试目录（无 `*.spec.ts` / `*.test.ts`）。
- 提交前至少执行：`npm run lint && npm run build`，以及 `cd server && npm run build`。
- 新增测试时建议：
  - 前端：`src/**/__tests__/` 或与组件同目录 `*.test.tsx`。
  - 后端：`server/src/**/*.spec.ts`，按模块拆分。

## Commit & Pull Request Guidelines
- 提交信息遵循 Conventional Commits（由 `commitlint` + Husky 强制），示例：`feat(map): 集成高德地图`、`fix(auth): 修复 JWT 过期处理`。
- 推荐格式：`type(scope): 简短中文描述`；常用 `type`：`feat`、`fix`、`docs`、`refactor`、`chore`。
- PR 要求：
  - 清晰说明变更动机与影响范围；
  - 关联 Issue（如有）；
  - UI 改动附截图或录屏；
  - 列出本地验证命令与结果。

## Security & Configuration Tips
- 前端环境变量参考 `.env.example`，仅提交模板，不提交真实密钥。
- 后端当前使用 SQLite（`data/zawer.db`）；生产环境请关闭 `synchronize` 并使用迁移流程。
