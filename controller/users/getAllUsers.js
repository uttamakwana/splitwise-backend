import { User } from "../../models/users.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.json({
      sucess: true,
      message: "All users gathered successfully!",
      users,
    });
  } catch (error) {
    console.log(error);
  }
};
