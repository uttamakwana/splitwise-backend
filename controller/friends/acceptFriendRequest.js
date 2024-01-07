import { User } from "../../models/users.js";
import bcrypt from "bcrypt";

export const acceptFriendRequest = async (req, res) => {
  const { user_id, friend_id } = req.body;

  if (user_id === friend_id)
    return res
      .status(402)
      .json({ sucess: false, message: "User can't be friend of theirself." });
  // here user is that person who is accepting friend request
  let user = await User.findById(user_id);
  // and friend is the person who has sent request to him/her
  let friend = await User.findById(friend_id);

  // we are checking if that user is already it's friend
  const existingFriend = user.friends.find(
    (friend) => friend.id.toString() === friend_id
  );

  // user is already its friend
  if (existingFriend)
    return res
      .status(402)
      .json({ sucess: false, message: "User is already a friend!" });

  // Add the friend to the user's friend list
  user.friends.push({
    id: friend_id,
    name: friend.name,
    number: friend.number,
    email: friend.email,
    amount: 0,
  });

  friend.friends.push({
    id: user_id,
    name: user.name,
    number: user.number,
    email: user.email,
    amount: 0,
  });

  // Remove the friend request from the user's friend requests
  user.friendRequests = user.friendRequests.filter(
    (friendRequest) => friendRequest.id.toString() !== friend_id
  );

  // saving both user and friend to update the friend list in both of them
  await user.save();
  await friend.save();

  return res.json({
    success: true,
    message: "Friend request accepted successfully!",
  });
};
