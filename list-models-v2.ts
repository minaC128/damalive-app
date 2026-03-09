import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('HTTP_ERROR:', response.status, response.statusText);
            const data = await response.json();
            console.error(JSON.stringify(data, null, 2));
            return;
        }
        const data = await response.json();
        console.log('--- MODELS ---');
        data.models.forEach((m: any) => {
            console.log(m.name, m.supportedGenerationMethods);
        });
        console.log('--- END ---');
    } catch (error: any) {
        console.error('ERROR:', error.message);
    }
}

listModels();
