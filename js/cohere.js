// cohere.js
// Use Cohere's official JS SDK to power your UbD lesson-plan chatbot

import { CohereClientV2 } from "cohere-ai";

// Grab your UI elements
const generateBtn   = document.getElementById('generate-btn');
const exampleSelect = document.getElementById('example-select');
const customPrompt  = document.getElementById('custom-prompt');
const outputDiv     = document.getElementById('output');

// ─── Initialize Cohere client ─────────────────────────────────────────
const API_KEY = 'KmuG70nThcv3XVePPkSFguSdd7L5AG7IffscPeqk';  // ← replace with your real key
const client  = new CohereClientV2({ token: API_KEY });

// ─── System instruction for UbD lesson-plan format ────────────────────
const systemMessage = {
  role: 'system',
  content: `You are an expert educational designer.
Produce detailed lesson plans in Understanding by Design (UbD) format, including:
1. Desired Results (Enduring Understandings & Essential Questions)
2. Assessment Evidence (Performance Tasks & Other Evidence)
3. Learning Plan (Learning Activities & Instructional Sequence)
Make it clear, structured, and teacher-friendly.`
};

// ─── In-memory chat history ────────────────────────────────────────────
const chatHistory = [ systemMessage ];

// ─── Send a chat request via Cohere SDK ─────────────────────────────────
async function sendPrompt(promptText) {
  if (!promptText?.trim()) {
    throw new Error('Please enter a prompt.');
  }

  // Append user message
  chatHistory.push({ role: 'user', content: promptText });

  // Use chat (non-streaming) if you prefer simplicity:
  const response = await client.chat({
    model: 'command-a-03-2025',        // e.g. the model from playground
    messages: chatHistory,
    temperature: 0.3,
    max_tokens: 800
  });

  // Extract the assistant’s reply
  const assistantMsg = response.message;
  if (!assistantMsg?.content) {
    throw new Error('Empty response from Cohere.');
  }

  // Record assistant message
  chatHistory.push({ role: 'assistant', content: assistantMsg.content });
  return assistantMsg.content;
}

// ─── Wire up the Generate button ───────────────────────────────────────
generateBtn.addEventListener('click', async () => {
  const promptText = customPrompt.value.trim() || exampleSelect.value;
  if (!promptText) {
    outputDiv.textContent = 'Please select or enter a prompt.';
    return;
  }

  outputDiv.textContent = 'Generating…';
  generateBtn.disabled = true;

  try {
    const reply = await sendPrompt(promptText);
    outputDiv.textContent = reply;
  } catch (err) {
    console.error(err);
    outputDiv.textContent = `Error: ${err.message}`;
  } finally {
    generateBtn.disabled = false;
  }
});

// ─── Auto-fill footer year ─────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
