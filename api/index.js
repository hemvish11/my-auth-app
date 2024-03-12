import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config();

const app = express();

//To take input as JSON in backend's request body
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
})

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to Mongo");
    })
    .catch((err) => {
        console.log("Error connecting to Mongo:", err);
    });

app.listen(3000, () => {
    console.log("Server chalu h... jao dhoom machao...")
})

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);


// middleware to handle errors
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
})