import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { User } from "./src/user.model.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

async function generateUniqueUsername(baseUsername) {
  let username = baseUsername.toLowerCase();
  let exists = await User.findOne({ username });

  while (exists) {
    const randomStr = Math.random().toString(36).substring(2, 5);
    username = `${baseUsername.toLowerCase()}${randomStr}`;
    exists = await User.findOne({ username });
  }
  return username;
}

app.post("/api/users", async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body); 

    const { clerkId, email, fullname, avatar } = req.body;
    if (!email || !clerkId) {
      return res
        .status(400)
        .json({ message: "Email and Clerk ID are required" });
    }

    let user = await User.findOne({ clerkId });
    if (!user) {
      const baseUsername = email.split("@")[0];
      const username = await generateUniqueUsername(baseUsername);

      user = new User({ clerkId, email, fullname, username, avatar });
      await user.save();
      console.log(user);
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error saving user:", error);
    res
      .status(500)
      .json({ message: "Error saving user", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));