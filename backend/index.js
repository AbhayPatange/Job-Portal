import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const allowedOrigins = [
    "http://localhost:5173",
    "https://jobportal-two-xi.vercel.app",
    "https://jobportal-abhayproject.vercel.app",
    "https://jobportal-5ebdrgxku-abhays-projects-16a72075.vercel.app",
    ...(process.env.CLIENT_URL || "").split(","),
]
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

const corsOptions = {
    origin(origin, callback) {
        // Requests without an Origin header (health checks, curl, etc.) are safe
        // to allow; browsers must match one of the configured frontend origins.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);



const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running at port ${PORT}`);
    });
};

startServer().catch((error) => {
    console.error("Unable to start server", error);
    process.exit(1);
});
