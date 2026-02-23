import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: '.env.local' });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Testing with API Key beginning with:', apiKey?.substring(0, 8));

    try {
        const genAI = new GoogleGenerativeAI(apiKey!);
        // 明確指定使用的模型 (從剛才 list 可能支援的清單中挑選一個最基礎的)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });

        console.log('Sending test message to gemini-1.5-flash-8b...');
        const result = await model.generateContent("Hello!");
        console.log('✅ Success! Response:', result.response.text());
    } catch (error: any) {
        console.error('❌ Failed with gemini-1.5-flash-8b:', error.message);

        try {
            console.log('Trying gemini-1.5-pro...');
            const genAI = new GoogleGenerativeAI(apiKey!);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
            const result = await model.generateContent("Hello!");
            console.log('✅ Success! Response:', result.response.text());
        } catch (e: any) {
            console.error('❌ Failed with gemini-1.5-pro:', e.message);
        }
    }
}

testGemini();
