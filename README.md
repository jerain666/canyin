# 店铺投资计算器 (Cloudflare Pages / Vercel 可部署)

一个零依赖、纯前端的店铺投资分析网页应用。依据模板包含：
- 建店成本汇总（押金/固定成本/经营成本）
- 毛利率计算
- 盈亏平衡点（按月/按日营业额）
- 回本周期（以“开业前总成本 / 每月净利润”为基准）

> 模板来源：`店铺投资计算公式.xlsx`（已在网页中抽象化为统一输入表单，无需上传 Excel）。

## 快速开始

### 方式 A：直接部署到 Cloudflare Pages（推荐）
1. 将本仓库 **Fork** 或 **Clone** 到你的 GitHub 账号。
2. 在 **Cloudflare Pages** 新建项目，**选择此 GitHub 仓库**。
3. 构建设置：
   - Framework preset: **None**
   - Build command: **(留空)**
   - Build output directory: **/** 或 **/public**（本项目文件位于根目录；如选择 `/public`，请把文件放到 `public` 目录并在设置中指向）
4. 完成后即可访问自动生成的域名。

### 方式 B：部署到 Vercel
1. 将本仓库推送至 GitHub。
2. 在 **Vercel** 新项目，导入该仓库。
3. Framework: **Other**
4. Build & Output：**Static**（无构建命令），Output Directory：**/** 或 **/public**。

> **提示**：当前项目为 *纯静态*，不依赖服务端代码；Cloudflare Pages 与 Vercel 都能直接从 GitHub 拉取并部署。

## 本地预览
直接用浏览器打开 `index.html`（或将所有文件放入 `public/` 并通过静态服务器预览）。

## 文件结构
```
.
├── index.html         # 主页面（若用 /public，请将其移动到 public/ 下）
├── styles.css         # 样式
├── app.js             # 计算逻辑
├── README.md
├── LICENSE
└── .gitignore
```

## 公式说明
- **毛利率** = （营业额 - 食材成本 - 包装） / 营业额
- **盈亏平衡点**（月）= （每日房租 + 人工 + 能源 + 其他）× 每月营业天数 ÷ 毛利率
- **盈亏平衡点**（日）= 盈亏平衡点（月） ÷ 每月营业天数
- **回本周期**（月）= **开业前总成本（不含押金/转让费）** ÷ 每月净利润

> 其中“食材+包装占比（%）”可直接使用毛利率反推（未填时自动采用 `1 - 毛利率`）。

## 常见问题
- **是否需要 Tailwind/打包工具？** 不需要，项目零依赖，任何静态主机均可。
- **如何保存参数？** 页面右下角提供保存/载入（localStorage）、导入/导出 JSON。

## 许可证
MIT
