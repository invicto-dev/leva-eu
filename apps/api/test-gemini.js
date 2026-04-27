'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const generative_ai_1 = require('@google/generative-ai');
async function listModels() {
  const apiKey = process.argv[2];
  if (!apiKey) {
    console.error('Please provide API key as argument');
    return;
  }
  const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
  const models = [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-pro',
    'gemini-flash',
  ];
  console.log('Testing models...');
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent('Hi');
      console.log(`✅ ${m}: OK`);
    } catch (e) {
      console.log(`❌ ${m}: ${e.message}`);
    }
  }
}
listModels();
//# sourceMappingURL=test-gemini.js.map
