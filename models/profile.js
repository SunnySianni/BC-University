import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    
    // User's display name with a maximum length of 50 characters
    name: { 
        type: String, 
        required: true,
        trim: true,
        maxlength: 50
    },
    
    // User's persona/personality description with a maximum length of 200 characters
    persona: { 
        type: String, 
        default: 'A friendly person',
        trim: true,
        maxlength: 200
    },
    
    // Timestamp for when the profile was created
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    // Timestamp for when the profile was last updated
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Add a pre-save middleware to update the 'updatedAt' timestamp
profileSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create a model from the schema
const Profile = mongoose.model('Profile', profileSchema);

// Export the model for use in other parts of the application
export default Profile;