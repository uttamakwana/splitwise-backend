import express from "express";
import {
  register,
  login,
  getAllUsers,
  sendFriendRequest,
  acceptFriendRequest,
  makeTransaction,
  deleteAllUser,
  removeAllTransactions,
} from "../controller/index.js";
import { makeTransaction2 } from "../controller/transactions/makeTransaction2.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUsers);

// send a friend request
router.post("/send/request", sendFriendRequest);
router.post("/accept/request", acceptFriendRequest);
router.post("/make/transaction", makeTransaction);
router.post("/make/transaction/v2", makeTransaction2);
router.delete("/delete/all", deleteAllUser);

// transaction
router.delete("/remove/transaction/all", removeAllTransactions);

export default router;
