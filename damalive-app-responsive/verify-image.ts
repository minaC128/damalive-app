import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function verifyImageCapability() {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = 'gemini-2.0-flash-exp-image-generation';
    console.log(`Verifying image capability for model: ${model}`);

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: "Generate a small image of a heart. Your output must be an image." }]
            }]
        })
    });

    const data = await res.json();
    if (!res.ok) {
        console.log('❌ Failed:', JSON.stringify(data, null, 2));
    } else {
        const hasImage = data.candidates?.[0]?.content?.parts?.some((p: any) => p.inlineData);
        if (hasImage) {
            console.log('✅ SUCCESS! Image found in response.');
        } else {
            console.log('❌ Model returned success but NO image data. Text was:', data.candidates?.[0]?.content?.parts?.[0]?.text);
        }
    }
}

verifyImageCapability();
