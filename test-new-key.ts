import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testWorking() {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = 'gemini-2.0-flash'; // 試試清單上的這個
    console.log(`Testing ${modelName} with NEW API Key...`);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "OK" }] }]
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('❌ Failed:', JSON.stringify(data, null, 2));
        } else {
            console.log('✅ SUCCESS!', JSON.stringify(data, null, 2));
        }
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

testWorking();
