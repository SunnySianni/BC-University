import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
    
    // Character's name with a maximum length of 50 characters
    characterName: { 
        type: String, 
        required: true, 
        maxlength: 50 
    },
    
    // Character's personality description with a maximum length of 1000 characters
    personality: { 
        type: String, 
        required: true, 
        maxlength: 1000 
    },
    
    // The initial message from the character with a maximum length of 1000 characters
    startingMessage: { 
        type: String, 
        required: true, 
        maxlength: 1000 
    },
    
    // Array of conversation objects
    conversations: [{
        // Sender of the message, can be either 'user' or 'bot'
        sender: { 
            type: String, 
            enum: ['user', 'bot'], 
            required: true 
        },
        
        // Content of the message
        content: { 
            type: String, 
            required: true 
        },
        
        // Timestamp of when the message was sent, defaults to the current date and time
        timestamp: { 
            type: Date, 
            default: Date.now 
        }
    }]
});

// Create a model from the schema
const Character = mongoose.model('Character', characterSchema);

// Export the model for use in other parts of the application
export default Character;