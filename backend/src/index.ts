import express from "express";
import authRoutes from "./routes/auth.route"; // No .ts extension
import messageRoutes from "./routes/message.route"; // No .ts extension

const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
