/**
 * @typedef {Object} Character
 * @property {string} characterName - Character's name
 * @property {string} personality - Character's personality description
 * @property {string} startingMessage - Initial message from character
 */

const CONFIG = {

    TIMEOUTS: {
        MESSAGE: 5000,
        REDIRECT: 2000
    },
    ENDPOINTS: {
        CHARACTERS: '/characters'
    },
    VALIDATION: {
        NAME_MAX_LENGTH: 50,
        PERSONALITY_MAX_LENGTH: 1000,
        MESSAGE_MAX_LENGTH: 1000
    }
};

class UIState {

    static elements = {};
    static isSubmitting = false;

    static init() {

        this.elements = {
            form: document.getElementById('character-form'),
            nameInput: document.getElementById('character-name'),
            personalityInput: document.getElementById('personality'),
            messageInput: document.getElementById('starting-message'),
            submitButton: document.getElementById('submit-btn'),
            personalityCounter: document.getElementById('personality-counter'),
            messageCounter: document.getElementById('message-counter'),
            messageContainer: document.getElementById('message-container')
        };

        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) throw new Error(`Required UI element not found: ${key}`);
        });
    }

    static setLoading(isLoading) {
        this.isSubmitting = isLoading;
        this.elements.submitButton.disabled = isLoading;
    }
}

class CharacterManager {

    static async saveCharacter(character) {
        const response = await fetch(CONFIG.ENDPOINTS.CHARACTERS, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(character)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to save character');
        }
        return data;
    }
}

const UIHelpers = {

    showMessage(message, type = 'error') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        UIState.elements.messageContainer.appendChild(alert);
        setTimeout(() => alert.remove(), CONFIG.TIMEOUTS.MESSAGE);
    },

    updateCharacterCount(input, counter) {

        const current = input.value.length;
        const max = input.getAttribute('maxlength');
        counter.textContent = `${current}/${max}`;
        counter.classList.toggle('text-danger', current >= max * 0.9);
    }
};

async function handleSubmit(event) {

    event.preventDefault();
    
    if (!UIState.elements.form.checkValidity()) {
        event.stopPropagation();
        UIState.elements.form.classList.add('was-validated');
        return;
    }

    UIState.setLoading(true);
    
    try {
        const character = {
            characterName: UIState.elements.nameInput.value.trim(),
            personality: UIState.elements.personalityInput.value.trim(),
            startingMessage: UIState.elements.messageInput.value.trim()
        };

        await CharacterManager.saveCharacter(character);
        UIHelpers.showMessage('Character created successfully!', 'success');
        setTimeout(() => window.location.href = '/', CONFIG.TIMEOUTS.REDIRECT);
        
    } catch (error) {
        console.error('Character save error:', error);
        UIHelpers.showMessage(error.message);
    } finally {
        UIState.setLoading(false);
    }
}

async function initializeApp() {

    try {
        UIState.init();
        
        // Set up character counters
        UIState.elements.personalityInput.addEventListener('input', () => 
            UIHelpers.updateCharacterCount(
                UIState.elements.personalityInput, 
                UIState.elements.personalityCounter
            )
        );

        UIState.elements.messageInput.addEventListener('input', () => 
            UIHelpers.updateCharacterCount(
                UIState.elements.messageInput, 
                UIState.elements.messageCounter
            )
        );

        UIState.elements.form.addEventListener('submit', handleSubmit);

        // Initialize counters
        UIHelpers.updateCharacterCount(
            UIState.elements.personalityInput, 
            UIState.elements.personalityCounter
        );
        UIHelpers.updateCharacterCount(
            UIState.elements.messageInput, 
            UIState.elements.messageCounter
        );

    } catch (error) {
        console.error('Initialization error:', error);
        UIHelpers.showMessage('Failed to initialize application');
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);