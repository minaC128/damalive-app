import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function findWorkingModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    const candidates = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-2.0-flash-exp',
        'gemini-2.0-flash-001',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite-preview-02-05'
    ];

    for (const model of candidates) {
        console.log(`Testing ${model}...`);
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hi" }] }]
                })
            });
            const data = await response.json();
            if (response.ok) {
                console.log(`✅ ${model} WORKS!`);
                process.exit(0);
            } else {
                console.log(`❌ ${model} failed: ${data.error.message}`);
            }
        } catch (e: any) {
            console.log(`❌ ${model} error: ${e.message}`);
        }
    }
}

findWorkingModel();
