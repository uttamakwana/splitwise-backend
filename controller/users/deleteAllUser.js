import { User } from "../../models/users.js";

export const deleteAllUser = async (req, res) => {
  const users = await User.find({});

  if (users) {
    await User.deleteMany({});
    return res
      .status(200)
      .json({ sucess: true, message: "Users deleted successfully!" });
  }

  return res.status(402).json({ sucess: false, message: "Users not found!" });
};
