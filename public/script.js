const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  const botMessageElement = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', text: userMessage }],
      }),
    });

    if (!response.ok) {
      console.log('error not ok', response);
      throw new Error('Failed to get response from server.');
    }

    const data = await response.json();

    if (data.result) {
      botMessageElement.textContent = data.result;
    } else {
      botMessageElement.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.log('error catch', error);
    botMessageElement.textContent = 'Failed to get response from server.';
    console.error('Error:', error);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  const msgContent = document.createElement('div');
  msgContent.classList.add('message-content');
  msgContent.textContent = text;

  msg.appendChild(msgContent);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msgContent; // Return the inner div so its text can be updated
}
