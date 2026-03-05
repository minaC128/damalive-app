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
            model: 'gemini-flash-latest',
        });

        const systemPrompt = "你是「小達」，溫柔可愛的 AI 護理顧問。1. 你的回答必須基於衛教知識，語氣溫柔。2. 雖然可以使用表情符號 (🧸, ✨) 來增加親切感，但請嚴格控制用量，平均每段落只使用 1-2 個即可，不要過度堆疊。3. 若遇到緊急醫療關鍵字 (出血/發燒等)，請優先回答：⚠️ 這可能是緊急情況，請立即就醫！\n\n";

        const chatHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts?.[0]?.text || msg.text || '' }],
        }));

        const chat = model.startChat({ history: chatHistory });

        let result;
        let retries = 3;
        while (retries > 0) {
            try {
                result = await chat.sendMessage(systemPrompt + query);
                break;
            } catch (err: any) {
                retries--;
                if (retries === 0 || !err.message?.includes('503')) throw err;
                console.log(`Gemini 503 error, retrying... (${3 - retries})`);
                await new Promise(resolve => setTimeout(resolve, 1500)); // 等待 1.5 秒後重試
            }
        }

        const responseText = result.response.text();
        const isEmergency = /出血|痛|發燒|破水|不動|急診/.test(query);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: responseText, isEmergency })
        };
    } catch (error: any) {
        console.error('Chat API Error:', error);

        const errorMsg = `哎呀，小達的連線暫時有些擁擠，請稍等幾秒鐘再試試看喔！🧸✨`;

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: errorMsg, isEmergency: false })
        };
    }
};
