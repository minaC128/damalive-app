import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler = async (event: any) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY!;

        const genAI = new GoogleGenerativeAI(apiKey);
        // 使用目前最穩定的 Gemini 2.0 Flash 模型
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const result = await model.generateContent([prompt]);

        for (const part of result.response.candidates?.[0]?.content?.parts || []) {
            if ((part as any).inlineData) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        data: (part as any).inlineData.data,
                        mimeType: (part as any).inlineData.mimeType || 'image/png',
                    })
                };
            }
        }

        return { statusCode: 404, body: JSON.stringify({ error: 'No image generated' }) };
    } catch (error: any) {
        console.error('Image generation error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
