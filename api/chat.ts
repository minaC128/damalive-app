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
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: {
                role: 'system',
                parts: [{ text: "你是「小達」，溫柔可愛的 AI 護理顧問。1. 你的回答必須基於衛教知識，語氣溫柔、加上表情符號 (🧸, ✨)。2. 若遇到緊急醫療關鍵字 (出血/發燒等)，請優先回答：⚠️ 這可能是緊急情況，請立即就醫！" }],
            },
        });

        const chatHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts?.[0]?.text || msg.text || '' }],
        }));

        const chat = model.startChat({ history: chatHistory });
        const result = await chat.sendMessage(query);
        const responseText = result.response.text();

        const isEmergency = /出血|痛|發燒|破水|不動|急診/.test(query);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: responseText, isEmergency })
        };
    } catch (error: any) {
        console.error('Chat API Error:', error);

        let errorMsg = `哎呀，小達連線稍微斷了：${error.message || '未知錯誤'} 🧸`;
        if (error?.message?.includes('API key not valid')) {
            errorMsg = '❌ Gemini API Key 無效，請檢查環境變數設定。';
        } else if (error?.message?.includes('model') && error?.message?.includes('not found')) {
            errorMsg = '❌ 找不到或不支援的 AI 模型，請確認模型名稱是否正確。';
        }

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: errorMsg, isEmergency: false })
        };
    }
};
