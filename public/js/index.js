/**
 * @typedef {Object} Character
 * @property {string} _id - Character's unique identifier
 * @property {string} characterName - Character's name
 * @property {string} personality - Character's personality
 */

document.addEventListener('DOMContentLoaded', async () => {

    try {

        await loadCharacters();

    } catch (error) {
        console.error('Failed to load characters:', error);
        showError('Failed to load characters');
    }
});

/**
 * Loads and displays characters
 * @async
 */
async function loadCharacters() {

    const response = await fetch('/characters');

    if (!response.ok) throw new Error('Failed to fetch characters');
    
    const characters = await response.json();

    renderCharacters(characters);
}

/**
 * Renders character cards
 * @param {Character[]} characters - Array of characters to display
 */
function renderCharacters(characters) {

    const botList = document.getElementById('bot-list');
    
    if (characters.length === 0) {

        botList.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">No characters found. Create one to get started!</p>
            </div>`;
        return;
    }

    botList.innerHTML = characters.map(character => `
        <div class="col-md-4 mb-3">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${escapeHtml(character.characterName)}</h5>
                    <p class="card-text">${escapeHtml(character.personality)}</p>
                </div>
                <div class="card-footer bg-transparent border-top-0">
                    <a href="/chatRoom?character=${character._id}" 
                       class="btn btn-primary w-100"
                       data-character-id="${character._id}">
                        Chat with ${escapeHtml(character.characterName)}
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Shows error message
 * @param {string} message - Error message to display
 */
function showError(message) {

    const container = document.querySelector('.container');
    const alert = document.createElement('div');

    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = 
    `
        ${escapeHtml(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    container.insertBefore(alert, container.firstChild);
}

/**
 * Escapes HTML to prevent XSS
 * @param {string} unsafe - Unsafe string
 * @returns {string} Escaped string
 */
function escapeHtml(unsafe) {
    
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}