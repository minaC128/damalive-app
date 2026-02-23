import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt } = req.body;
        const apiKey = process.env.GEMINI_API_KEY!;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Stable model

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Note: Edge case, simplified for demo.
        // In a real app we'd handle images, but since this is a text proxy for a demo, we respond with status.
        res.json({ text });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
