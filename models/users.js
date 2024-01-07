import mongoose from "mongoose";

// transaction schema
const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  // category: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String, required: true },
  // paidFor: [
  //   {
  //     id: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "User",
  //       required: true,
  //     },
  //     name: {
  //       type: String,
  //       name: true,
  //     },
  //     share: { type: Number, required: true },
  //   },
  // ],
  paidFor: [{ type: String }],
});

// friends schema
const friendSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
    // required: true,
  },
  transactions: [
    {
      share: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      },
    },
  ],
});

// friend request schema
const friendRequestSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

// user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
  },
  number: {
    type: String,
    required: [true, "Number is required!"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  totalBalance: {
    type: Number,
    default: 0,
  },
  transactions: [transactionSchema],
  friends: [friendSchema],
  friendRequests: [friendRequestSchema],
  gain: {
    type: Number,
  },
  loss: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const User = mongoose.model("users", userSchema);
