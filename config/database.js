import mongoose from 'mongoose';
import 'dotenv/config';

/**
 * MongoDB connection options
 * @constant {Object}
 */
const DB_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};

/**
 * Establishes connection to MongoDB
 * @async
 * @returns {Promise<typeof mongoose>}
 * @throws {Error} Database connection error
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, DB_OPTIONS);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

// Mongoose connection event handlers
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
});

// Handle application termination
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Mongoose connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error during database disconnection:', err);
        process.exit(1);
    }
});

export default connectDB;
