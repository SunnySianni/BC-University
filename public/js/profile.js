/**
 * @typedef {Object} UserProfile
 * @property {string} name - User's display name
 * @property {string} persona - User's personality description
 */

/**
 * Configuration constants
 */
const CONFIG = {
    TIMEOUTS: {
        MESSAGE: 5000,
        REDIRECT: 2000
    },
    ENDPOINTS: {
        PROFILE: '/profile',           // Changed from '/get-profile'
        SAVE_PROFILE: '/save-profile'  // Matches the server route
    },
    VALIDATION: {
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 50,
        PERSONA_MAX_LENGTH: 200
    }
};

/**
 * UI State management class
 */
class UIState {

    static elements = {};
    static isSubmitting = false;

    /**
     * Initialize UI elements and state
     */
    static init() {
        this.elements = {
            form: document.getElementById('profile-form'),
            nameInput: document.getElementById('user-name'),
            personaInput: document.getElementById('user-persona'),
            submitButton: document.getElementById('submit-btn'),
            personaCounter: document.getElementById('persona-counter'),
            messageContainer: document.getElementById('message-container')
        };

        // Validate all elements exist
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) throw new Error(`Required UI element not found: ${key}`);
        });
    }

    /**
     * Set loading state
     * @param {boolean} isLoading - Loading state
     */
    static setLoading(isLoading) {

        this.isSubmitting = isLoading;
        this.elements.submitButton.disabled = isLoading;
    }
}

/**
 * Profile data management class
 */
class ProfileManager {

    /**
     * Fetch user profile from server
     * @returns {Promise<UserProfile>}
     */
    static async fetchProfile() {

        const response = await fetch(CONFIG.ENDPOINTS.PROFILE);

        if (!response.ok) throw new Error('Failed to fetch profile');

        return response.json();
    }

    /**
     * Save profile to server
     * @param {UserProfile} profile - Profile data
     * @returns {Promise<Object>} Server response
     * @throws {Error} If save fails
     */
    static async saveProfile(profile) {
        const response = await fetch(CONFIG.ENDPOINTS.SAVE_PROFILE, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(profile)
        });

        // Handle non-JSON responses (like redirects)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to save profile');
            }
            return data;
        }

        if (!response.ok) {
            throw new Error('Failed to save profile');
        }

        return { success: true };
    }
}

/**
 * UI Helper functions
 */
const UIHelpers = {
    /**
     * Show user message
     * @param {string} message - Message to display
     * @param {'success' | 'error'} type - Message type
     */
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

    /**
     * Update character counter
     */
    updateCharacterCount() {
        const input = UIState.elements.personaInput;
        const current = input.value.length;
        const max = CONFIG.VALIDATION.PERSONA_MAX_LENGTH;
        
        UIState.elements.personaCounter.textContent = `${current}/${max}`;
        UIState.elements.personaCounter.classList.toggle('text-danger', 
            current >= max * 0.9);
    }
};

/**
 * Form submission handler
 * @param {Event} event - Form event
 */
async function handleSubmit(event) {

    event.preventDefault();
    
    if (!UIState.elements.form.checkValidity()) {

        event.stopPropagation();
        
        UIState.elements.form.classList.add('was-validated');

        return;
    }

    UIState.setLoading(true);
    
    try {

        const profile = {
            
            name: UIState.elements.nameInput.value.trim(),
            persona: UIState.elements.personaInput.value.trim()
        };

        await ProfileManager.saveProfile(profile);
        UIHelpers.showMessage('Profile saved successfully!', 'success');
        setTimeout(() => window.location.href = '/', CONFIG.TIMEOUTS.REDIRECT);
        
    } catch (error) {
        
        console.error('Profile save error:', error);
        UIHelpers.showMessage(error.message);

    } finally {
        UIState.setLoading(false);
    }
}

/**
 * Initialize application
 */
async function initializeApp() {

    try {

        UIState.init();
        
        // Set up event listeners
        UIState.elements.personaInput.addEventListener('input', 
            UIHelpers.updateCharacterCount);

        UIState.elements.form.addEventListener('submit', handleSubmit);

        // Load existing profile
        const profile = await ProfileManager.fetchProfile();
        if (profile) {
            UIState.elements.nameInput.value = profile.name || '';
            UIState.elements.personaInput.value = profile.persona || '';
            UIHelpers.updateCharacterCount();
        }

    } catch (error) {

        console.error('Initialization error:', error);
        UIHelpers.showMessage('Failed to initialize application');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);