import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

app.use(express.json({ limit: '10mb' }));

// ---------- Gemini Chat Proxy ----------
app.post('/api/chat', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
            console.warn('⚠️ Gemini API Key is missing or using placeholder.');
            res.json({
                text: '⚠️ 目前尚未設定有效的 Gemini API Key。請在 .env.local 檔案中設定您的 GEMINI_API_KEY，然後重啟伺服器！🧸',
                isEmergency: false
            });
            return;
        }

        const { query, history } = req.body;

        const systemInstruction = "你是「小達」，溫柔可愛的 AI 護理顧問。1. 你的回答必須基於衛教知識，語氣溫柔、加上表情符號 (🧸, ✨)。2. 若遇到緊急醫療關鍵字 (出血/發燒等)，請優先回答：⚠️ 這可能是緊急情況，請立即就醫！\n\n# 衛教資料庫 (重要參考)\n- 產後憂鬱：接受不完美，尋求支持。\n- 新生兒睡眠：每天約16-18小時。\n- 哭泣語言：分辨肚子餓、尿布濕、想睡覺。\n- 哺乳技巧：親餵、瓶餵都有技巧，爸爸也可協助。\n- 緊急狀況：若寶寶發燒、活動力極差，請立即就醫。";

        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: systemInstruction,
        });

        const isEmergency = /出血|痛|發燒|破水|不動|急診/.test(query);

        // 建構對話歷史 (配合 SDK 格式)
        const chatHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts?.[0]?.text || msg.text || '' }],
        }));

        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(query);
        const responseText = result.response.text();

        res.json({ text: responseText, isEmergency });
    } catch (error: any) {
        console.error('Gemini API Error:', error);

        let errorMsg = '哎呀，小達連線稍微斷了，請稍後再試！🧸';
        const rawError = error?.message || '';

        if (rawError.includes('SAFETY')) {
            errorMsg = "抱歉，這個話題可能涉及敏感內容，小達暫時無法回答。建議諮詢專業醫療人員喔！🧸";
        } else if (rawError.includes('quota') || rawError.includes('429')) {
            errorMsg = "小達今天聊得有點累了，請稍後再回來找我喔！🧸✨";
        } else if (rawError.includes('API key not valid')) {
            errorMsg = '❌ API Key 無效，請確認 .env.local 中的設定。';
        } else if (rawError.includes('not found')) {
            errorMsg = `❌ 模型錯誤: ${rawError}`;
        }

        res.status(500).json({
            text: errorMsg,
            isEmergency: false,
            details: rawError
        });
    }
});

// ---------- Gemini Image Generation Proxy ----------
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;

        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        // 使用經測試可產生圖像的模型
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

        const response = await model.generateContent([prompt]);

        for (const part of response.response.candidates?.[0]?.content?.parts || []) {
            if ((part as any).inlineData) {
                res.json({
                    data: (part as any).inlineData.data,
                    mimeType: (part as any).inlineData.mimeType || 'image/png',
                });
                return;
            }
        }

        res.status(404).json({ error: 'No image generated' });
    } catch (error: any) {
        console.error('Image generation error:', error?.message || error);
        res.status(500).json({ error: 'Image generation failed' });
    }
});

// ---------- Production: Serve static files ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

app.use(express.static(distPath));
app.get('*path', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ DAMALIVE API Server running on http://localhost:${PORT}`);
});
