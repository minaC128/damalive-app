import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler = async (event: any) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    text: '⚠️ 後端尚未設定 GEMINI_API_KEY。請檢查 Vercel/Netlify 的環境變數設定。🧸',
                    isEmergency: false
                })
            };
        }

        const { query, history } = JSON.parse(event.body);

        const genAI = new GoogleGenerativeAI(apiKey);
        const modelNames = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'];
        let lastError: any = null;
        let responseText = '';
        let successfulModel = '';

        const systemPrompt = "你是「小達」，溫柔可愛的 AI 護理顧問。1. 你的回答必須基於衛教知識，語氣溫柔、加上表情符號 (🧸, ✨)。2. 若遇到緊急醫療關鍵字 (出血/發燒等)，請優先回答：⚠️ 這可能是緊急情況，請立即就醫！\n\n";

        const chatHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts?.[0]?.text || msg.text || '' }],
        }));

        for (const modelName of modelNames) {
            try {
                console.log(`Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1' });
                const chat = model.startChat({ history: chatHistory });
                const result = await chat.sendMessage(systemPrompt + query);
                responseText = result.response.text();
                if (responseText) {
                    successfulModel = modelName;
                    break;
                }
            } catch (err: any) {
                lastError = err;
                console.warn(`Model ${modelName} failed:`, err.message);
                continue;
            }
        }

        if (!responseText && lastError) {
            throw new Error(`${lastError.message} (Tried models: ${modelNames.join(', ')})`);
        }

        const isEmergency = /出血|痛|發燒|破水|不動|急診/.test(query);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: responseText, isEmergency, debugModel: successfulModel })
        };
    } catch (error: any) {
        console.error('Chat API Error:', error);

        const errorMsg = `哎呀，小達連線稍微斷了：${error.message || '未知錯誤'} 🧸\n\n[系統診斷：請確認 API Key 是否有效，或在 Google AI Studio 測試該金鑰。]`;

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: errorMsg, isEmergency: false })
        };
    }
};
