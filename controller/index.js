import { register } from "./users/register.js";
import { login } from "./users/login.js";
import { getAllUsers } from "./users/getAllUsers.js";
import { makeTransaction } from "./transactions/makeTransaction.js";
import { sendFriendRequest } from "./friends/sendFriendRequest.js";
import { acceptFriendRequest } from "./friends/acceptFriendRequest.js";
import { deleteAllUser } from './users/deleteAllUser.js';
import { removeAllTransactions } from './transactions/removeAllTransactions.js';

export {
  register,
  login,
  getAllUsers,
  makeTransaction,
  sendFriendRequest,
  acceptFriendRequest,
  deleteAllUser,
  removeAllTransactions
};
