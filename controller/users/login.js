import { User } from "../../models/users.js";
import bcrypt from "bcrypt";

// POST
// login API
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.json({
        sucess: false,
        message: "email or password may be wrong!",
      });

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      return res.json({
        sucess: false,
        message: "email or password may be wrong!",
      });

    return res.json({ success: true, message: "Login sucessfull!", user });
  } catch (error) {
    console.log(error);
  }
};
