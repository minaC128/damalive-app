import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkApiKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Using API Key beginning with:', apiKey?.substring(0, 8));

    try {
        // 第一步：檢查密鑰是否能獲取模型列表
        const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!listResponse.ok) {
            const err = await listResponse.json();
            console.error('❌ API Key Validation Failed:', JSON.stringify(err, null, 2));
            return;
        }
        console.log('✅ API Key is VALID (can list models)');

        // 第二步：檢查特定模型的詳細資訊
        const modelName = 'models/gemini-1.5-flash';
        const modelResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${modelName}?key=${apiKey}`);
        if (!modelResponse.ok) {
            const err = await modelResponse.json();
            console.error(`❌ Model ${modelName} NOT found/accessible:`, JSON.stringify(err, null, 2));
        } else {
            const modelInfo = await modelResponse.json();
            console.log(`✅ Model ${modelName} is ACCESSIBLE:`, JSON.stringify(modelInfo, null, 2));
        }

        // 第三部：嘗試最簡單的 REST API 調用
        console.log('Attempting simple REST chat...');
        const chatResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hi" }] }]
            })
        });

        if (!chatResponse.ok) {
            const err = await chatResponse.json();
            console.error('❌ REST Chat Failed:', JSON.stringify(err, null, 2));
        } else {
            console.log('✅ REST Chat SUCCESS!');
        }

    } catch (error: any) {
        console.error('Diagnostic error:', error.message);
    }
}

checkApiKey();
