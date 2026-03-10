import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listAllModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('MISSING_API_KEY');
        return;
    }
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            console.log('--- MODELS ---');
            data.models.forEach((m: any) => {
                console.log(m.name);
            });
            console.log('--- END ---');
        } else {
            console.log('No models found or error:', JSON.stringify(data));
        }
    } catch (error: any) {
        console.error('FETCH_ERROR:', error.message);
    }
}

listAllModels();
