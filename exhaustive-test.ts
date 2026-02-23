import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function findTheOne() {
    const apiKey = process.env.GEMINI_API_KEY;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    for (const m of data.models) {
        if (m.supportedGenerationMethods.includes('generateContent')) {
            const shortName = m.name.split('/')[1];
            console.log(`Testing ${shortName}...`);
            const test = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${shortName}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
            });
            if (test.ok) {
                console.log(`🚀 FOUND WORKING MODEL: ${shortName}`);
                return;
            }
        }
    }
}
// 修正一下上面的程式碼 (response -> res)
async function findTheOneFixed() {
    const apiKey = process.env.GEMINI_API_KEY;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    if (!data.models) { console.log('No models found'); return; }
    for (const m of data.models) {
        if (m.supportedGenerationMethods.includes('generateContent')) {
            const shortName = m.name.replace('models/', '');
            console.log(`Testing ${shortName}...`);
            const test = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${shortName}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
            });
            if (test.ok) {
                console.log(`🚀 FOUND WORKING MODEL: ${shortName}`);
                return;
            }
        }
    }
}

findTheOneFixed();
