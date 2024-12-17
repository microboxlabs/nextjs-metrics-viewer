import { initializeDatabase } from '@/lib/db';

(async () => {
    try {
        await initializeDatabase();
        console.log("SQLite database initialized successfully on server startup.");
    } catch (error) {
        console.error("Failed to initialize the database:", error);
    }
})();