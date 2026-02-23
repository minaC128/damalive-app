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

        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: {
                role: 'system',
                parts: [{ text: "你是「小達」，溫柔可愛的 AI 護理顧問。1. 你的回答必須基於衛教知識，語氣溫柔、加上表情符號 (🧸, ✨)。2. 若遇到緊急醫療關鍵字 (出血/發燒等)，請優先回答：⚠️ 這可能是緊急情況，請立即就醫！" }],
            },
        });

        const KNOWLEDGE_BASE = `
# 衛教資料庫 (重要參考)
- 產後憂鬱：接受不完美，尋求支持。
- 新生兒睡眠：每天約16-18小時。
- 哭泣語言：分辨肚子餓、尿布濕、想睡覺。
- 哺乳技巧：親餵、瓶餵都有技巧，爸爸也可協助。
- 緊急狀況：若寶寶發燒、活動力極差，請立即就醫。
`;

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
        console.error('Gemini API Error details:', JSON.stringify(error, null, 2) || error);

        let errorMsg = '哎呀，小達連線稍微斷了，請稍後再試！🧸';
        if (error?.message?.includes('API key not valid')) {
            errorMsg = '❌ API Key 無效，請確認 .env.local 中的設定。';
        }

        res.status(500).json({
            text: errorMsg,
            isEmergency: false,
        });
    }
});

// ---------- Gemini Image Generation Proxy ----------
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;

        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-001' });

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
