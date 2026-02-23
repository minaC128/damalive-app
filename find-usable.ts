import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function findUsableModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        const usable = data.models.filter((m: any) =>
            m.supportedGenerationMethods.includes('generateContent') &&
            !m.name.includes('vision') // skip vision-only if they exist
        );

        console.log('Usable Models for generateContent:');
        usable.forEach((m: any) => console.log(`- ${m.name} (${m.displayName})`));
    } catch (e: any) {
        console.error(e.message);
    }
}

findUsableModels();
