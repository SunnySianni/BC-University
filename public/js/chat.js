/**
 * @typedef {Object} Character
 * @property {string} _id - Character's unique identifier
 * @property {string} characterName - Character's name
 * @property {string} personality - Character's personality description
 * @property {string} startingMessage - Initial message from character
 * @property {Array<Message>} conversations - Array of conversation messages
 */

/**
 * @typedef {Object} Message
 * @property {string} id - Message unique identifier
 * @property {('user'|'bot')} sender - Message sender type
 * @property {string} content - Message content
 */

/**
 * @constant {Object} DOM - DOM element references
 */
const DOM = {

    containers: {
        setup: document.getElementById('setup-container'),
        chat: document.getElementById('chat-container'),
        messages: document.getElementById('chat-messages')
    },
    inputs: {
        user: document.getElementById('user-input')
    },
    buttons: {
        send: document.getElementById('send-btn'),
        setup: document.getElementById('setup-btn')
    },
    botName: document.getElementById('bot-name')
};

const CONFIG = {
    ENDPOINTS: {
        CHAT: '/chat/message'
    },
    TIMEOUTS: {
        TYPING: 1000,
        ERROR_DISPLAY: 5000
    }
};


class ChatUI {

    static elements = {
    
        messages: document.getElementById('chat-messages'),
        input: document.getElementById('user-input'),
        sendButton: document.getElementById('send-btn'),
        botName: document.getElementById('bot-name')
    };

    static init() {

        // Validate all elements exist
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) throw new Error(`Required UI element not found: ${key}`);
        });
    }

    static addMessage(sender, content) {

        const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            messageDiv.textContent = content;

        this.elements.messages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    static scrollToBottom() {
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }

    static setLoading(isLoading) {

        this.elements.sendButton.disabled = isLoading;
        this.elements.input.disabled = isLoading;
    }

    static addTypingIndicator() {

        const indicator = document.createElement('div');
            indicator.className = 'message bot-message typing-indicator';
            indicator.innerHTML = '<span></span><span></span><span></span>';

        this.elements.messages.appendChild(indicator);
        this.scrollToBottom();

        return indicator;
    }

    static showError(message) {

        const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger alert-dismissible fade show mt-2';
            errorDiv.innerHTML = `
                ${this.escapeHtml(message)}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;

        this.elements.messages.parentElement.insertBefore(errorDiv, this.elements.messages);

        setTimeout(() => errorDiv.remove(), CONFIG.TIMEOUTS.ERROR_DISPLAY);
    }

    static escapeHtml(unsafe) {

        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

class ChatManager {

    static async sendMessage(message, characterId) {

        try {

            const response = await fetch(CONFIG.ENDPOINTS.CHAT, {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: message.trim(),
                    characterId: characterId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Server error: ${response.status}`);
            }

            return data;

        } catch (error) {

            console.error('Message send error:', error);
            throw new Error(error.message || 'Failed to send message');
        }
    }
}

/**
 * @type {Character|null}
 */
let currentCharacter = null;

/**
 * Adds a message to the chat display
 * @param {('user'|'bot')} sender - Message sender type
 * @param {string} message - Message content
 */
function addMessageToChat(sender, message) {

    const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = message;
    
    DOM.containers.messages.appendChild(messageElement);
    scrollToBottom();
}

/**
 * Scrolls chat to the bottom
 */
function scrollToBottom() {
    DOM.containers.messages.scrollTop = DOM.containers.messages.scrollHeight;
}

async function handleSendMessage(characterId) {

    const message = ChatUI.elements.input.value.trim();
    
    if (!message) return;

    try {

        ChatUI.setLoading(true);
        ChatUI.elements.input.value = '';

        // Show user message immediately
        ChatUI.addMessage('user', message);

        // Show typing indicator
        const typingIndicator = ChatUI.addTypingIndicator();

        // Get bot response
        const response = await ChatManager.sendMessage(message, characterId);
        
        // Remove typing indicator and show response
        setTimeout(() => {
            typingIndicator.remove();
            ChatUI.addMessage('bot', response.message);
        }, CONFIG.TIMEOUTS.TYPING);

    } catch (error) {
        console.error('Send message error:', error);
        ChatUI.showError(error.message);
    } finally {
        ChatUI.setLoading(false);
    }
}

// Send a message to the bot
async function sendMessage() {

    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();

    if (!message) {

        alert('Please enter a message');
        
        return;
    }

    // Add the user's message to the chat
    addMessageToChat('user', message);

    try {
        // Fetch the bot's response
        const botResponse = await fetchBotResponse(message);

        // Add the bot's response to the chat
        addMessageToChat('bot', botResponse);
    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToChat('bot', 'Sorry, I encountered an error while processing your message.');
    }

    // Clear the input field
    userInput.value = '';
}

// Regenerate a bot message
async function regenerateMessage(event, messageId) {

    event.preventDefault();
    
    const messageElement = event.target.closest('.message');
    const messageContent = messageElement.querySelector('.message-content');

    currentCharacter.conversations = currentCharacter.conversations.filter(msg => msg.id !== messageId);

    try {

        const lastUserMessage = currentCharacter.conversations[currentCharacter.conversations.length - 1].content;
        const response = await fetchBotResponse(lastUserMessage);
        messageContent.textContent = response;

        const newMessageId = Date.now();
        currentCharacter.conversations.push({ sender: 'bot', content: response, id: newMessageId });
        await saveCharacter(currentCharacter);

        updateMessageActions(messageElement, newMessageId);

    } catch (error) {

        console.error('Error regenerating message:', error);
        messageContent.textContent = 'Sorry, I encountered an error while regenerating the message.';
    }
}

// Update message actions
function updateMessageActions(messageElement, newMessageId) {

    const actionsContainer = messageElement.querySelector('.message-actions');

    actionsContainer.innerHTML = `
        <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            Actions
        </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item regenerate-btn" href="#" data-message-id="${newMessageId}">Regenerate</a></li>
            <li><a class="dropdown-item edit-btn" href="#" data-message-id="${newMessageId}">Edit</a></li>
        </ul>
    `;

    const regenerateBtn = actionsContainer.querySelector('.regenerate-btn');
    const editBtn = actionsContainer.querySelector('.edit-btn');

        regenerateBtn.addEventListener('click', (e) => regenerateMessage(e, newMessageId));
    editBtn.addEventListener('click', (e) => editMessage(e, newMessageId));
}

// Edit a message
function editMessage(event, messageId) {
    event.preventDefault();
    const messageElement = event.target.closest('.message');
    const messageContent = messageElement.querySelector('.message-content');
    const currentText = messageContent.textContent;

    messageContent.innerHTML = `
        <textarea class="form-control edit-textarea">${currentText}</textarea>
        <button class="btn btn-sm btn-primary save-edit-btn mt-2">Save</button>
        <button class="btn btn-sm btn-secondary cancel-edit-btn mt-2 ms-2">Cancel</button>
    `;

    const saveBtn = messageContent.querySelector('.save-edit-btn');
    const cancelBtn = messageContent.querySelector('.cancel-edit-btn');

    saveBtn.addEventListener('click', () => saveEdit(messageElement, messageId));
    cancelBtn.addEventListener('click', () => cancelEdit(messageContent, currentText));
}

// Save an edited message
async function saveEdit(messageElement, messageId) {
    const textarea = messageElement.querySelector('.edit-textarea');
    const newText = textarea.value.trim();

    if (newText) {
        messageElement.querySelector('.message-content').textContent = newText;

        const messageIndex = currentCharacter.conversations.findIndex(msg => msg.id === messageId);
        if (messageIndex !== -1) {
            currentCharacter.conversations[messageIndex].content = newText;
            await saveCharacter(currentCharacter);
        }
    }
}

// Cancel editing a message
function cancelEdit(messageContent, originalText) {
    messageContent.textContent = originalText;
}

// Initialize chat functionality
async function initializeChat() {

    try {

        ChatUI.init();

        const urlParams = new URLSearchParams(window.location.search);
        const characterId = urlParams.get('character');

        if (!characterId) {
            throw new Error('No character ID provided');
        }

        // Event listeners
        ChatUI.elements.sendButton.addEventListener('click', () => handleSendMessage(characterId));
        ChatUI.elements.input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSendMessage(characterId);
            }
        });

    } catch (error) {
        console.error('Chat initialization error:', error);
        ChatUI.showError('Failed to initialize chat');
    }
}


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeChat);

