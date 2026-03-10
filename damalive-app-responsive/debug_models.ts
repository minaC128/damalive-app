import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function debugModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('MISSING_API_KEY');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTest = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

    for (const modelName of modelsToTest) {
        console.log(`--- Testing ${modelName} ---`);
        const model = genAI.getGenerativeModel({ model: modelName });
        try {
            const result = await model.generateContent('Hi');
            const response = await result.response;
            console.log(`SUCCESS: ${modelName} -> ${response.text().substring(0, 50)}`);
        } catch (error: any) {
            console.error(`FAILURE: ${modelName} -> ${error.message}`);
        }
    }
}

debugModels();
