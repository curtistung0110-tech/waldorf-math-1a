# 華德福一上數學家學本

對照翰林版國小數學一年級上學期九個單元，用華德福的故事、律動與雙手經驗，在家陪孩子學數學。手機、平板、電腦都能看。

## 內容

| 頁面 | 內容 |
|---|---|
| 首頁 | 九個單元卡片、活動進度、繼續上次看的單元 |
| 開始之前 | 每天 20 分鐘的節奏、經驗→回想→符號三階段、數數詩、寶物籃 |
| 單元頁（九個） | 核心意象、故事、一週怎麼排、在家活動（可打勾）、主課本、準備材料、接回課本與常見錯誤 |
| 說故事模式 | 全螢幕大字，一次一段，最後一頁是講完可以問孩子的問題 |
| 給爸媽的叮嚀 | 在體制內與華德福之間拿捏分寸的五件事 |

- 活動勾選和「上次看到哪個單元」存在瀏覽器的 localStorage，不會跨裝置同步。
- 插畫用 SVG 基本形狀加水彩濾鏡繪製，程式在 `site/art.js`。
- 單元與小節名稱參考均一教育平台「類翰林版」一年級數學，翰林每年可能微調。

## 專案結構

```
site/          靜態網站（不需要建置）
  index.html
  style.css
  art.js       水彩插畫
  data.js      九個單元的教學內容
  app.js       頁面切換、活動勾選、說故事模式
.github/workflows/deploy.yml   推到 main 後自動部署
```

## 修改內容

教學文字都在 `site/data.js`，每個單元的欄位：

| 欄位 | 說明 |
|---|---|
| `story` | 故事段落，說故事模式一次顯示一段 |
| `ask` | 講完可以問孩子的問題 |
| `week` | 一週安排，`[階段, 做什麼]`，階段為 經驗／回想／符號／延伸／課本 |
| `acts` | 在家活動 `[名稱, 說明]` |
| `book`、`mats` | 主課本畫什麼、要準備的東西 |
| `bridge`、`watch` | 接回課本的題型、常見錯誤 |

## 圖示與分享圖

`site/` 裡的 favicon、App 圖示和 `og-image.png` 都由 `scripts/build-brand.mjs` 產生（需要本機有 Chrome 或 Edge）：

```bash
node scripts/build-brand.mjs
```

- 分享圖版面：`design/og-image.html`（插畫取自 `site/art.js` 的首頁圖）

## 本機預覽

```bash
npx http-server site -p 8080
```

## 部署

推送到 `main` 分支時，GitHub Actions 會同時部署到：

1. **GitHub Pages**：儲存庫 Settings → Pages 的來源需設為「GitHub Actions」。
2. **Cloudflare Pages**：需要在儲存庫設定以下值，沒設定時會自動略過這一步。Pages 專案不存在時會自動建立。

| 名稱 | 類型 | 說明 |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Secret | Cloudflare API Token，權限：Account → Cloudflare Pages → Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Variable | Cloudflare 帳戶 ID |
| `CLOUDFLARE_PROJECT_NAME` | Variable（選填） | Pages 專案名稱，預設 `waldorf-math-1a` |
