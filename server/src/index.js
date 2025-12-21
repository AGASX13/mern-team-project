
import "dotenv/config";

import connectDB from "./config/db.js";
import app from "./app.js";



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
    process.exit(1);
});