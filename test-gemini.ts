import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: '.env.local' });

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Testing with API Key beginning with:', apiKey?.substring(0, 8));

    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
        console.error('❌ Error: API Key is missing or using placeholder');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: {
                role: 'system',
                parts: [{ text: "You are a helpful assistant." }]
            }
        });

        console.log('Sending test message...');
        const result = await model.generateContent("Hello, are you there?");
        console.log('✅ Success! Response:', result.response.text());
    } catch (error: any) {
        console.error('❌ Gemini Test Failed!');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);
        if (error.response) {
            console.error('Full Response Error:', JSON.stringify(error.response, null, 2));
        }
    }
}

testGemini();
