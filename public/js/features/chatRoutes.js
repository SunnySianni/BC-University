import express from 'express';
import fetch from 'node-fetch';
import Character from '../models/character.js';
import dotenv from 'dotenv/config';

/**
 * @typedef {import('../models/character').Character} Character
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} role - Message role ('system'|'user'|'assistant')
 * @property {string} content - Message content
 */

/**
 * @typedef {Object} ChaiAPIResponse
 * @property {Array<{message: {content: string}}>} choices - Array of possible responses
 */

const router = express.Router();

// Environment variable validation
const CHAI_API_KEY = process.env.CHAI_API_KEY;

if (!CHAI_API_KEY) {
    console.error('CHAI_API_KEY is not set in the environment variables');
    process.exit(1);
}

/**
 * Configuration constants
 * @constant {Object}
 */
const CONFIG = {
    API_URL: 'https://api.chai-research.com/v1/chat/completions',
    MAX_MESSAGE_LENGTH: 1000,
    MODEL: 'chai_v1',
    TEMPERATURE: 0.7
};

/**
 * Validates chat input middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {void}
 */
const validateChatInput = (req, res, next) => {
    const { message, characterId } = req.body;
    
    if (!message || message.length > CONFIG.MAX_MESSAGE_LENGTH) {
        return res.status(400).json({ 
            error: `Message must be between 1 and ${CONFIG.MAX_MESSAGE_LENGTH} characters` 
        });
    }
    
    if (!characterId) {
        return res.status(400).json({ error: 'Character ID is required' });
    }
    
    next();
};

/**
 * Creates the roleplay context for the AI
 * @param {Character} character - Character object
 * @param {string} userName - User's name
 * @returns {string} Formatted context string
 */
const createRoleplayContext = (character, userName) => `
    You are roleplaying as ${character.characterName}.
    Your personality: ${character.personality}
    The user you're talking to is named ${userName}.
    Always stay in character and maintain the established scenario.
    Current scenario: ${character.startingMessage}
`.trim();

/**
 * Handles chat API interaction
 * @async
 * @param {Character} character - Character object
 * @param {string} message - User message
 * @param {string} context - Roleplay context
 * @returns {Promise<string>} Bot response
 * @throws {Error} API or processing error
 */
async function handleChatAPI(character, message, context) {
    const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-API-KEY': CHAI_API_KEY
        },
        body: JSON.stringify({
            model: CONFIG.MODEL,
            messages: [
                { role: 'system', content: context },
                ...character.conversations.map(conv => ({
                    role: conv.sender === 'user' ? 'user' : 'assistant',
                    content: conv.content
                })),
                { role: 'user', content: message }
            ],
            temperature: CONFIG.TEMPERATURE
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`API responded with status ${response.status}: ${JSON.stringify(data)}`);
    }

    const botResponse = data.choices[0]?.message?.content;
    if (!botResponse) {
        throw new Error('Invalid response from Chai API');
    }

    return botResponse.startsWith(`${character.characterName}:`) 
        ? botResponse 
        : `${character.characterName}: ${botResponse}`;
}

// Route handlers
router.get('/chat', async (req, res) => {
    const { character: characterId } = req.query;
    
    if (!characterId) {
        return res.status(400).send('Character ID is required');
    }

    try {
        const character = await Character.findById(characterId);
        if (!character) {
            return res.status(404).send('Character not found');
        }
        res.render('chat', { character });
    } catch (error) {
        console.error('Error loading character:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/chat', validateChatInput, async (req, res) => {
    const { message, characterId } = req.body;

    try {
        const character = await Character.findById(characterId);
        if (!character) {
            return res.status(404).json({ error: 'Character not found' });
        }

        const context = createRoleplayContext(character, req.user?.name || 'User');
        const botResponse = await handleChatAPI(character, message, context);

        res.json({ message: botResponse });
    } catch (error) {
        console.error('Error in chat processing:', error);
        res.status(500).json({
            error: 'An error occurred while processing your request.',
            details: error.message
        });
    }
});

export default router;