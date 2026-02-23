import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function findModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        const flashModels = data.models.filter((m: any) => m.name.includes('flash'));
        console.log('Flash Models found:', JSON.stringify(flashModels, null, 2));
    } catch (e: any) {
        console.error(e.message);
    }
}

findModels();
