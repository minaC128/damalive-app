import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
async function testNano() {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = 'gemini-2.5-flash-image';
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Generate image of a cat" }] }] })
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
testNano();
