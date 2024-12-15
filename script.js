const sendButton = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const apiKey = "6c4fdfa0a3fd4838a69fdccf5bbff068"; // Your API key

// Function to append a message to the chat
function appendMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
}

// Send user message to the chat and call AI API
async function sendMessage() {
    const message = userInput.value;
    if (!message) return;

    // Show user message
    appendMessage(message, 'user-message');
    userInput.value = ''; // Clear input field

    // Call AI/ML API
    const response = await fetch('https://api.example.com/chat', {  // Replace with your API URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    const botMessage = data.response || 'Sorry, I didn\'t understand that.';  // Adjust based on API response

    // Show bot response
    appendMessage(botMessage, 'bot-message');
}

// Event listener for the send button
sendButton.addEventListener('click', sendMessage);

// Optional: Send message when user presses Enter
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
