import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const { query, history } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
            return new Response(JSON.stringify({
                text: '⚠️ 伺服器端尚未設定有效的 GEMINI_API_KEY。'
            }), { status: 500 });
        }

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

        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(query);
        const responseText = result.response.text();

        return new Response(JSON.stringify({ text: responseText, isEmergency: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Chat error:', error);
        let errorMsg = '連線中斷，請稍後再試。';
        if (error?.message?.includes('API key not valid')) {
            errorMsg = '❌ API Key 無效，請確認環境變數設定。';
        }
        return new Response(JSON.stringify({ text: errorMsg }), { status: 500 });
    }
}
