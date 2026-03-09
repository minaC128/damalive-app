import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// 加載環境變數
dotenv.config({ path: '.env.local' });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('MISSING_API_KEY');
        return;
    }

    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    console.log('Testing...');
    try {
        const result = await model.generateContent('Hi');
        console.log('SUCCESS:', (await result.response).text().substring(0, 20));
    } catch (error: any) {
        console.error('ERROR_START');
        console.error(error.message);
        console.error('ERROR_END');
    }
}

testGemini();
