import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js"

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Running on PORT: ${PORT}`);
});
