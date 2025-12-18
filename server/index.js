// Load environment variables immediately
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './src/config/db.js';
import app from './src/app.js'; // We will create app.js next

// 1. Connect to Database
connectDB()
.then(() => {
    // 2. Start Server only after DB connection succeeds
    const port = process.env.PORT || 8000;
    
    app.listen(port, () => {
        console.log(`\n⚙️  Server is running at port: ${port}`);
        console.log(`👉 http://localhost:${port}`);
    });
})
.catch((err) => {
    console.log("❌ MongoDB connection failed !!! ", err);
});