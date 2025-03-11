import mongoose from "mongoose";

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
        default : process.env.DEFAULT_AVATAR, 
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
  
 export const User = mongoose.model("User", userSchema);