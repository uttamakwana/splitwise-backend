import { User } from "../../models/users.js";
import bcrypt from "bcrypt";
// POST
// register API
export const register = async (req, res) => {
  try {
    const { name, email, number, password, totalBalance } = req.body;
    // find user with it's email
    let user = await User.findOne({ email });
    // if exist then give an error or already registered!
    if (user)
      return res.status(402).json({ sucess: false, message: "User already registered" });

    // convert password into hashed password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user
    user = await User.create({
      name,
      email,
      number,
      password: hashedPassword,
      totalBalance
    });
    res.status(200).json({ sucess: true, message: "User created successfully", user });
  } catch (error) {
    console.log(error);
  }
};
