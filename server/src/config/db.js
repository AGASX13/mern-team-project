const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Attempt to connect to the database
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

        // Log success message with the host to know where we are connected
        console.log(`\n✅ MongoDB Connected! DB Host: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        // If connection fails, log the error and kill the process
        console.error("❌ MONGODB Connection FAILED: ", error);
        
        // Exit process with failure (1)
        process.exit(1);
    }
};

module.exports = connectDB;