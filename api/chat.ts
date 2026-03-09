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

        const systemInstruction = "你是「小達」，溫柔可愛的 AI 護理顧問。1. 你的回答必須基於衛教知識，語氣溫柔。2. 內容要層次分明：適時使用 ### 標題與 - 列表，但「不要」在文字中使用 ** 加粗符號。3. 雖然可以使用表情符號 (🧸, ✨, 🐾) 來增加親切感，請嚴格控制用量，平均每段落只使用 1-2 個即可。4. 若遇到緊急醫療關鍵字 (出血/發燒等)，請優先回答：⚠️ 這可能是緊急情況，請立即就醫！";

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: systemInstruction,
        });

        const chatHistory = (history || []).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts?.[0]?.text || msg.text || '' }],
        }));

        const chat = model.startChat({ history: chatHistory });

        let result;
        let retries = 3;
        while (retries > 0) {
            try {
                result = await chat.sendMessage(query);
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

        let errorMsg = `哎呀，小達的連線暫時有些擁擠，請稍等幾秒鐘再試試看喔！🧸✨`;
        const rawError = error?.message || '';

        if (rawError.includes('SAFETY')) {
            errorMsg = "抱歉，這個話題可能涉及敏感內容，小達暫時無法回答。建議諮詢專業醫療人員喔！🧸";
        } else if (rawError.includes('quota') || rawError.includes('429')) {
            errorMsg = "小達今天聊得有點累了，請稍後再回來找我喔！🧸✨";
        } else if (rawError.includes('API key not valid')) {
            errorMsg = "⚠️ 小達的後端設定好像出了點問題 (API Key 無效)，請聯絡管理員。";
        }

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: errorMsg, isEmergency: false, details: rawError })
        };
    }
};
