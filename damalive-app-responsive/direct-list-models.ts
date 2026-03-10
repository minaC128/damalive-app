import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.models) {
            console.error('ERROR:', JSON.stringify(data));
            return;
        }
        data.models.forEach((m: any) => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
                console.log('MODEL:', m.name);
            }
        });
    } catch (error: any) {
        console.error('FETCH_ERROR:', error.message);
    }
}

listModels();
