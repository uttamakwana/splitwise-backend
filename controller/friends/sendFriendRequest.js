import { User } from "../../models/users.js";
import bcrypt from "bcrypt";

export const sendFriendRequest = async (req, res) => {
  try {
    const { user_id, friend_id } = req.body;
    let user = await User.findById(user_id);
    let friend = await User.findById(friend_id);

    if (!user || !friend)
      return res
        .status(404)
        .json({ sucess: false, message: "User may not be available" });

    // checking if that friend is user's already friend or not
    const alreadyFriend = user.friends.some(
      (friend) => friend.id.toString() === friend_id
    );

    // if user has already that friend give an error!
    if (alreadyFriend) {
      return res
        .status(402)
        .json({ sucess: false, message: "This user is already your friend." });
    }

    // Check if you have already send the friend request to that friend!
    const isFriendRequestExists = friend.friendRequests.some(
      (request) => request.id.toString() === user_id.toString()
    );

    // if user has already sent the request to that friend
    if (isFriendRequestExists) {
      return res
        .status(402)
        .json({ success: false, message: "Friend request already exists!" });
    }

    // push the friend into the friend's friendRequest array
    friend.friendRequests.push({
      id: user._id,
      name: user.name,
      number: user.number,
      email: user.email,
    });

    await friend.save();
    return res.status(200).json({
      success: true,
      message: "Friend request send successfully!",
      friend,
    });
  } catch (error) {
    console.log(error);
  }
};
