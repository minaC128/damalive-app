import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testTargetModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = 'gemini-2.5-flash';
    console.log(`Testing ${modelName} with API Key...`);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hi, respond with only one word: OK" }] }]
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('❌ REST Chat Failed:', JSON.stringify(data, null, 2));
        } else {
            console.log('✅ REST Chat SUCCESS!', JSON.stringify(data, null, 2));
        }
    } catch (error: any) {
        console.error('Diagnostic error:', error.message);
    }
}

testTargetModel();
