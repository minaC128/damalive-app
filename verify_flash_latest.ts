import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verifyFlashLatest() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    console.log('Testing gemini-flash-latest...');
    try {
        const result = await model.generateContent('Hi');
        console.log('SUCCESS:', (await result.response).text().substring(0, 20));
    } catch (error: any) {
        console.error('FAILURE:', error.message);
    }
}

verifyFlashLatest();
