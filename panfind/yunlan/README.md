# 云览 YUNLAN · PanFind 前端

本目录为 [hellbow20120323-cmyk/yunlan](https://github.com/hellbow20120323-cmyk/yunlan) 设计稿，已接入 **PanFind 网关**（`panfind/api`）。

## 本地开发

在 `panfind/` 根目录：

```bash
npm install
npm run dev
```

- 前端：http://localhost:5173（Vite 将 `/api` 代理到 `:8787`）
- 网关：http://localhost:8787

## 与后端对接

默认配置（可在 UI「接口对接」中修改）：

| 项 | 值 |
|----|-----|
| 搜索 | `GET /api/search?kw=…&cloud_types=baidu,quark,xunlei,uc` |
| 健康 | `GET /api/health` |
| 微博配置 | `GET/PUT /api/config/weibo` |

适配逻辑见 `src/services/panfindAdapter.ts`。上游失败时可回退前端模拟引擎（`mockFallbackOnError`）。

## 生产构建

```bash
npm run build -w yunlan
npm run start -w api   # 静态文件来自 yunlan/dist
```
