import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// 加載環境變數
dotenv.config({ path: '.env.local' });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ 沒有 GEMINI_API_KEY');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 試試看 gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('正在測試 gemini-1.5-flash 回應...');
    try {
        const result = await model.generateContent('哈囉！請簡短自我介紹。');
        const response = await result.response;
        const text = response.text();
        console.log('✅ 測試成功！回應內容：', text);
    } catch (error: any) {
        console.error('❌ 測試失敗:', error.message);
        if (error.stack) console.error(error.stack);
    }
}

testGemini();
