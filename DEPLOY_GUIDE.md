# DAMALIVE 部署至 Vercel 指南 🚀

這份文檔將引導你如何將 DAMALIVE 專案部署到 Vercel。由於本專案包含前端 (React/Vite) 與後端 (Serverless Functions)，我們已經配置好 `vercel.json` 確保兩者能完美運行。

## 1. 準備工作

1.  **GitHub 倉庫**：確保你的最新代碼已推送到 GitHub（剛才我們已經推送到 `minaC128/damalive-app`）。
2.  **Vercel 帳號**：請前往 [Vercel](https://vercel.com/) 並使用 GitHub 登入。

## 2. 部署步驟

### A. 導入專案
1.  在 Vercel Dashboard 點擊 **"Add New"** -> **"Project"**。
2.  找到 `damalive-app` 倉庫，點擊 **"Import"**。

### B. 配置設定 (Configure Project)
*   **Framework Preset**: 選擇 `Vite`。
*   **Root Directory**: 保持預設 (`./`)。
*   **Build Command**: `npm run build`。
*   **Output Directory**: `dist`。

### C. 設定環境變數 (Environment Variables) ⚠️ 重要
在 **Environment Variables** 區塊中，你可以點擊左下角的 **「導入 .env (Import .env)」** 按鈕（如你截圖所示），然後直接複製並貼上以下內容：

```env
GEMINI_API_KEY=你的_GEMINI_API_KEY
SUPABASE_URL=你的_SUPABASE_URL
SUPABASE_ANON_KEY=你的_SUPABASE_ANON_KEY
```

> **提示**：直接點擊「導入 .env」並貼上以上整塊內容是最快的方法，Vercel 會自動幫你拆解好 Key 和 Value。

### D. 點擊 Deploy
點擊 **"Deploy"**，等待約 1-2 分鐘即可完成！

---

## 3. 常見問題排查

### 為什麼 API 無法連線？
本專案使用 Vercel 的 **Edge Runtime**（定義在 `api/chat.ts`）。如果部署後 API 報錯：
1.  請檢查 Vercel 控制台中的 **Logs** 標籤。
2.  確認環境變數 `GEMINI_API_KEY` 是否填寫正確。

### 資料庫連不通？
確保留在 Supabase 的 **Settings -> API** 中，將 Vercel 的網址加入允許的來源清單（如果不確定，通常預設是開啟的）。

---

## 4. 本地開發與同步
如果你在本地修改了代碼並想更新到 Vercel：
```bash
git add .
git commit -m "Update features"
git push origin main
```
Vercel 會偵測到 GitHub 的更新並**自動重新部署**。

---
祝部署順利！如果有任何錯誤訊息，隨時截圖給我。🧸✨
