import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

async function listModelsVerbose() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        fs.writeFileSync('models_debug.json', JSON.stringify({ error: 'MISSING_API_KEY' }));
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        fs.writeFileSync('models_debug.json', JSON.stringify(data, null, 2));
        console.log('SUCCESS: Models written to models_debug.json');
    } catch (error: any) {
        fs.writeFileSync('models_debug.json', JSON.stringify({ error: error.message }));
    }
}

listModelsVerbose();
