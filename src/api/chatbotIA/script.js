document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatBox = document.getElementById('chat-box');

    chatForm.addEventListener('submit', async (event) => {
        // Prevent the form from reloading the page
        event.preventDefault();

        // Get the user's message
        const userMessage = messageInput.value.trim();
        if (!userMessage) return;

        // Display the user's message in the chat box
        addMessage(userMessage, 'user');

        // Clear the input field
        messageInput.value = '';

        try {
            // Send the message to our backend API
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const botReply = data.reply;

            // Display the bot's reply
            addMessage(botReply, 'bot');

        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, something went wrong.', 'bot');
        }
    });

    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatBox.appendChild(messageElement);
        // Scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});