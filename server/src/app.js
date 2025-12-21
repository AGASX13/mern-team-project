import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Feature Routes Imports
import authRoutes from "./features/auth/auth.routes.js";
import userRoutes from "./features/users/user.routes.js";
import propertyRoutes from "./features/properties/property.routes.js";
import roomRoutes from "./features/rooms/room.routes.js";
import bookingRoutes from "./features/bookings/booking.routes.js";
import reviewRoutes from "./features/reviews/review.routes.js";

const app = express();

// 1. Global Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Frontend URL
    credentials: true // Crucial for cookies to work
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser()); // Parses cookies for auth
app.use(express.static("public"));

// 2. Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

// Health Check
app.get("/", (req, res) => {
    res.send("PG Accommodation API is running...");
});

export default app;