# 華德福一上家學本

對照國小一年級上學期的數學（翰林版、南一版）與國語（南一版），用華德福的故事、律動與雙手經驗，在家陪孩子學習。手機、平板、電腦都能看。

- 網站：https://waldorf-math-1a.pages.dev/ （也可以用 https://curtistung0110-tech.github.io/waldorf-math-1a/ ）

## 內容

| 頁面 | 內容 |
|---|---|
| 首頁 | 選擇科目與課本版本、單元卡片、活動進度、繼續上次看的單元 |
| 開始之前 | 數學與國語的每日節奏、經驗→回想→符號三階段、數數詩、寶物籃 |
| 單元頁 | 核心意象、故事、字源或數字意象表、一週怎麼排、在家活動（可打勾）、主課本、準備材料、接回課本與常見錯誤 |
| 說故事模式 | 全螢幕大字，一次一段，最後一頁是講完可以問孩子的問題 |
| 給爸媽的叮嚀 | 在體制內與華德福之間拿捏分寸的五件事 |

| 課本 | 單元 |
|---|---|
| 數學・翰林版 | 九個單元（`u1`～`u9`） |
| 數學・南一版 | 九個單元（`n1`～`n9`），依南一的順序與小節重新編排 |
| 國語・南一版 | 首冊注音符號、魔法文字、第一課～第七課（`c0`～`c8`） |

- 國語課文受著作權保護，本站不收錄課文；每一課提供配合主題的延伸故事、活動、生字字源與筆順提醒。
- 注音單元連到 [ㄅㄆㄇ字卡樂園](https://zhuyin-card-games.pages.dev/) 練習符號。
- 選擇的課本、活動勾選和「上次看到哪個單元」存在瀏覽器的 localStorage，不會跨裝置同步。
- 插畫用 SVG 基本形狀加水彩濾鏡繪製，程式在 `site/art.js`。
- 資料來源：數學單元參考均一教育平台「類翰林版」「類南一版」；國語課次與生字參考教育雲「生字詞彙表」南一版一上。出版社每年可能微調。

## 專案結構

```
site/              靜態網站（不需要建置）
  index.html
  style.css
  art.js           水彩插畫
  data.js          數學・翰林版（u1～u9）
  data-nani.js     數學・南一版（n1～n9），並建立 window.EDITIONS
  data-chinese.js  國語・南一版（c0～c8）
  app.js           科目與版本切換、頁面切換、活動勾選、說故事模式
.github/workflows/deploy.yml   推到 main 後自動部署
```

## 修改內容

每個單元的欄位：

| 欄位 | 說明 |
|---|---|
| `id` | 單元網址，所有課本都不能重複 |
| `art` | 使用 `art.js` 裡哪一張插畫（沒填時用 `id`） |
| `mark`、`label` | 卡片上的大字與麵包屑上的課次（沒填時用「一、二…」與「單元一」） |
| `story`、`storyNote` | 故事段落（說故事模式一次顯示一段）、故事上方的說明 |
| `ask` | 講完可以問孩子的問題 |
| `table` | 表格：`{ title, head, rows }`，例如生字的故事（數學的 `numbers` 會自動轉成數字意象表） |
| `week` | 一週安排，`[階段, 做什麼]`，階段為 經驗／回想／符號／延伸／課本 |
| `acts` | 在家活動 `[名稱, 說明]` |
| `book`、`mats` | 主課本畫什麼、要準備的東西 |
| `bridge`、`watch` | 接回課本的重點、常見錯誤 |

新增一套課本：在 `data-*.js` 裡 `window.EDITIONS.push({ id, subject, name, note, units })`，並在 `index.html` 載入該檔（放在 `app.js` 之前）。

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

推送到 `main` 分支時會同時部署到：

1. **GitHub Pages**：https://curtistung0110-tech.github.io/waldorf-math-1a/ ，由 GitHub Actions 部署；儲存庫 Settings → Pages 的來源需設為「GitHub Actions」。
2. **Cloudflare Pages**：https://waldorf-math-1a.pages.dev/ ，由 Cloudflare Pages 的 Git 連線自動部署（Cloudflare 後台設定：Framework preset 選 None、不需要建置指令、Build output directory 填 `site`）。

GitHub Actions 裡的 Cloudflare Pages 工作是備用的 API Token 部署方式，目前沒有設定 Token，所以會自動略過。若改用這個方式，需在儲存庫設定以下值，Pages 專案不存在時會自動建立：

| 名稱 | 類型 | 說明 |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Secret | Cloudflare API Token，權限：Account → Cloudflare Pages → Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Variable | Cloudflare 帳戶 ID |
| `CLOUDFLARE_PROJECT_NAME` | Variable（選填） | Pages 專案名稱，預設 `waldorf-math-1a` |
