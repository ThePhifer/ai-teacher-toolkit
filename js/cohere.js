// js/cohere.js
import { CohereClientV2 } from 'https://unpkg.com/cohere-ai@7.14.0/dist/ClientV2.js';

const generateBtn    = document.getElementById('generate-btn');
const exampleSelect = document.getElementById('example-select');
const customPrompt  = document.getElementById('custom-prompt');
const outputDiv     = document.getElementById('output');

// initialize
const client = new CohereClientV2({ token: 'KmuG70nThcv3XVePPkSFguSdd7L5AG7IffscPeqk' });

const systemMessage = {
  role: 'system',
  content: `You are an expert educational designer.
Produce detailed lesson plans in Understanding by Design (UbD) format…`
};

const chatHistory = [ systemMessage ];

async function sendPrompt(promptText) {
  chatHistory.push({ role: 'user', content: promptText });
  const resp = await client.chat({
    model:       'command-a-03-2025',
    messages:    chatHistory,
    temperature: 0.3,
    max_tokens:  800
  });
  const reply = resp.message.content;
  chatHistory.push({ role: 'assistant', content: reply });
  return reply;
}

generateBtn.addEventListener('click', async () => {
  const p = customPrompt.value.trim() || exampleSelect.value;
  if (!p) return outputDiv.textContent = 'Enter a prompt.';
  outputDiv.textContent = 'Generating…';
  generateBtn.disabled = true;
  try {
    outputDiv.textContent = await sendPrompt(p);
  } catch (e) {
    outputDiv.textContent = `Error: ${e.message}`;
  } finally {
    generateBtn.disabled = false;
  }
});
