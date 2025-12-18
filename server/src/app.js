import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./features/users/user.routes.js";
import propertyRoutes from "./features/properties/property.routes.js";
import roomRoutes from "./features/rooms/room.routes.js";
import bookingRoutes from "./features/bookings/booking.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rooms", roomRoutes);

app.use("/api/bookings", bookingRoutes);


export default app;

