import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testImageGen() {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = 'gemini-2.0-flash-exp-image-generation';
    console.log(`Testing ${modelName}...`);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Generate a simple icon of a red apple." }] }]
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('❌ Failed:', JSON.stringify(data, null, 2));
        } else {
            console.log('✅ SUCCESS!');
            const hasImage = data.candidates?.[0]?.content?.parts?.some((p: any) => p.inlineData);
            console.log('Has Image Data:', hasImage);
        }
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

testImageGen();
