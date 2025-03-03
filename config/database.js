import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
    process.env.DB_NAME,       // Your database name
    process.env.DB_USER,       // Your database username
    process.env.DB_PASSWORD,   // Your database password
    {
        host: process.env.DB_HOST,  // Your database host (e.g., localhost)
        dialect: 'mysql',           // Database dialect (MySQL)
        logging: false,             // Disable Sequelize logging for cleaner output
    }
);

// Default export
export default sequelize;

// Optionally, you can still export connectDB and syncDatabase if you need them elsewhere
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL Database Connected');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

export const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('Database synced successfully');
    } catch (err) {
        console.error('Error syncing database:', err.message);
    }
};
