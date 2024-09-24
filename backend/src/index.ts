import express from "express";
import cors from "cors"; // Importing the cors package
import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";

// using this code we can use environmental variables
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware to enable CORS
app.use(cors()); // This will allow cross-origin requests from all domains

// used for parsing application/json
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
