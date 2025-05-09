// js/cohere.js
// Use Cohere's TypeScript/JavaScript SDK from Skypack as an ES module for your UbD chatbot

import { CohereClient } from 'https://cdn.skypack.dev/cohere-ai@7.17.1';

const generateBtn   = document.getElementById('generate-btn');
const exampleSelect = document.getElementById('example-select');
const customPrompt  = document.getElementById('custom-prompt');
const outputDiv     = document.getElementById('output');

// Initialize Cohere client (default export supports chat and generate)
const client = new CohereClient({ token: 'KmuG70nThcv3XVePPkSFguSdd7L5AG7IffscPeqk' });

// System prompt for UbD lesson plans
const systemMessage = {
  role: 'system',
  content: `You are an expert educational designer.
Produce detailed lesson plans in Understanding by Design (UbD) format, including:
1. Desired Results (Enduring Understandings & Essential Questions)
2. Assessment Evidence (Performance Tasks & Other Evidence)
3. Learning Plan (Learning Activities & Instructional Sequence)
Make it clear, structured, and teacher-friendly.`
};

const chatHistory = [ systemMessage ];

async function sendPrompt(promptText) {
  if (!promptText.trim()) throw new Error('Please enter a prompt.');
  chatHistory.push({ role: 'user', content: promptText });

  // Call Cohere chat endpoint
  const response = await client.chat({
    model:       'command-a-03-2025',
    messages:    chatHistory,
    temperature: 0.3,
    max_tokens:  800
  });

  const assistant = response.message?.content;
  if (!assistant) throw new Error('Empty response from Cohere');

  chatHistory.push({ role: 'assistant', content: assistant });
  return assistant;
}

generateBtn.addEventListener('click', async () => {
  const prompt = customPrompt.value.trim() || exampleSelect.value;
  if (!prompt) {
    outputDiv.textContent = 'Please enter or select a prompt.';
    return;
  }
  outputDiv.textContent    = 'Generating…';
  generateBtn.disabled     = true;
  try {
    outputDiv.textContent = await sendPrompt(prompt);
  } catch (err) {
    outputDiv.textContent = `Error: ${err.message}`;
  } finally {
    generateBtn.disabled = false;
  }
});
