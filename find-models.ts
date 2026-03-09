import fs from 'fs';
const data = JSON.parse(fs.readFileSync('models_out.txt', 'utf8'));
data.models.forEach((m: any) => {
    if (m.supportedGenerationMethods.includes('generateContent')) {
        console.log(m.name);
    }
});
