import { User } from "../../models/users.js";

export const removeAllTransactions = async (req, res) => {
  const { id } = req.body;
  const user = await User.findById(id);

  if (!user)
    return res.status(402).json({ sucess: false, message: "User not found!" });

  if (user.transactions.length > 1) {
    user.transactions = [];
    await user.save();
    return res.status(200).json({ sucess: true, user });
  }

  else {
   return res.status(402).json({sucess: false, message: "No transaction found!" });
  }
};
