import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
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

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dodjzv1tm/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1734628995/hand-drawn-anonymous-hacker-concept_23-2147897289_yhcv2s.jpg",
    },
    rank: {
      type: Number,
      default: 0,
    },
    totalSolved: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    problemSolved: {
      type: [
        {
          problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
          },
          solvedAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    friends: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    streak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

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
    console.log("Incoming Request Body:", req.body); // Debugging

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