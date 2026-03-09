import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModelsV1() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!data.models) {
            console.error('ERROR_V1:', JSON.stringify(data));
            return;
        }
        data.models.forEach((m: any) => {
            if (m.supportedGenerationMethods.includes('generateContent')) {
                console.log('MODEL_V1:', m.name);
            }
        });
    } catch (error: any) {
        console.error('FETCH_ERROR_V1:', error.message);
    }
}

listModelsV1();
