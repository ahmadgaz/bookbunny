import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
// import { createServer } from "http";
// import { Server } from "socket.io";

// CONFIGURATIONS: Package and Middleware configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json()); // JSON Parser
app.use(helmet()); // Sets security-related HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common")); // Logs HTTP requests and errors
app.use(bodyParser.json({ limit: "30mb", extended: true })); // Parser for images
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); // Cross-origin compatibility
// app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // File storage

// // FILE STORAGE
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "public/assets");
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });
// const upload = multer({ storage });

// ROUTES
app.post("/test", (req, res) => {
    try {
        console.log(req.body);
        res.status(200).json(req.body);
    } catch (err) {
        res.status(500).json({ msg: "error!" });
    }
});
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// // WEB SOCKET SETUP
// const httpServer = createServer();
// const io = new Server(3001);
// io.on("connection", (socket) => {
//     console.log(socket.id)
//   });

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose
    .connect(process.env.MONGO_URL, {
        dbName: "bookbunny",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    })
    .catch((error) => console.log(`${error} did not connect!`));
