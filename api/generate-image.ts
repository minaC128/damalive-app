import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
    maxDuration: 60, // Extend for image generation
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY!;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });

        const result = await model.generateContent([prompt]);

        for (const part of result.response.candidates?.[0]?.content?.parts || []) {
            if ((part as any).inlineData) {
                return res.json({
                    data: (part as any).inlineData.data,
                    mimeType: (part as any).inlineData.mimeType || 'image/png',
                });
            }
        }

        res.status(404).json({ error: 'No image generated in response' });
    } catch (error: any) {
        console.error('Image generation error:', error);
        res.status(500).json({ error: error.message });
    }
}
