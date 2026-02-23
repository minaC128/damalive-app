import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function findOneWorking() {
    const apiKey = process.env.GEMINI_API_KEY;
    const models = ['gemini-2.0-flash-exp', 'gemini-1.5-flash-8b', 'gemini-1.5-pro-latest', 'gemini-1.5-flash-latest'];
    for (const m of models) {
        console.log(`Testing ${m}...`);
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
        });
        if (res.ok) {
            console.log(`✅ ${m} WORKS!`);
            return;
        } else {
            const d = await res.json();
            console.log(`❌ ${m} failed: ${d.error.message}`);
        }
    }
}

findOneWorking();
