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
                contents: [{ parts: [{ text: "Generate an image of a sunflower. Output the image as raw pixel data." }] }]
            })
        });

        const data = await response.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

testImageGen();
