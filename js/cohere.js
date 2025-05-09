// js/cohere.js
// Plain fetch‐based Cohere Chat integration for your UbD lesson-plan chatbot

const API_ENDPOINT = 'https://api.cohere.ai/v1/chat';
const API_KEY      = 'KmuG70nThcv3XVePPkSFguSdd7L5AG7IffscPeqk'; // ← replace with your Cohere API key

// UI elements
const generateBtn   = document.getElementById('generate-btn');
const exampleSelect = document.getElementById('example-select');
const customPrompt  = document.getElementById('custom-prompt');
const outputDiv     = document.getElementById('output');

// System instruction for UbD lesson-plan format
const systemPreamble = `You are an expert educational designer.
Produce detailed lesson plans in Understanding by Design (UbD) format, including:
1. Desired Results (Enduring Understandings & Essential Questions)
2. Assessment Evidence (Performance Tasks & Other Evidence)
3. Learning Plan (Learning Activities & Instructional Sequence)
Make it clear, structured, and teacher-friendly.`;

// In-memory chat history (records only USER and ASSISTANT turns)
const chatHistory = [];

async function sendPrompt(promptText) {
  if (!promptText.trim()) {
    throw new Error('Please enter a prompt.');
  }

  // Record the user turn
  chatHistory.push({ role: 'USER', message: promptText });

  // Build payload—including the required `message` field
  const payload = {
    model:        'command-a-03-2025',
    preamble:     systemPreamble,
    chat_history: chatHistory,
    message:      promptText,    // ← must include for at least 1 token
    temperature:  0.3,
    max_tokens:   1600
  };

  console.log('→ Cohere payload:', payload);

  const response = await fetch(API_ENDPOINT, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (response.status === 429) {
    const ra = response.headers.get('Retry-After') || '60';
    throw new Error(`Rate limit exceeded. Try again in ${ra} seconds.`);
  }

  if (!response.ok) {
    const errText = await response.text();
    console.error('Cohere error body:', errText);
    throw new Error(`Cohere API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  console.log('← Cohere response:', data);

  // **PULL the assistant reply from `data.text`**
  const assistantMsg = data.text;
  if (!assistantMsg || !assistantMsg.trim()) {
    throw new Error('Empty response from Cohere.');
  }

  // Record and return
  chatHistory.push({ role: 'ASSISTANT', message: assistantMsg });
  return assistantMsg;
}

// Wire up the Generate button
generateBtn.addEventListener('click', async () => {
  const prompt = customPrompt.value.trim() || exampleSelect.value;
  if (!prompt) {
    outputDiv.textContent = 'Please enter or select a prompt.';
    return;
  }

  outputDiv.textContent    = 'Generating…';
  generateBtn.disabled     = true;

  try {
    const reply = await sendPrompt(prompt);
    outputDiv.textContent = reply;
  } catch (err) {
    outputDiv.textContent = `Error: ${err.message}`;
  } finally {
    generateBtn.disabled = false;
  }
});
