import { User } from "../../models/users.js";

export const makeTransaction2 = async (req, res) => {
  try {
    const { user_id, transaction } = req.body;

    const USER = await User.findById(user_id);

    const allFriendsExist = transaction.paidFor.every((id) =>
      USER.friends.some((friend) => friend.id.toString() === id)
    );

    if (!allFriendsExist) {
      return res
        .status(402)
        .json({ success: false, message: "Some friends may not exist!" });
    }

    const { amount, description, paidFor, friends } = transaction;

    const paidForList = [];

    await Promise.all(
      friends.map(async (friend) => {
        const myFriend = await User.findById(friend.id);
        if (!myFriend) {
          console.log(`Friend with ID ${friend.id} not found!`);
          return;
        }

        paidForList.push(myFriend.name);

        const mySelfInMyFriend = myFriend.friends.find(
          (f) => f.id.toString() === user_id
        );

        if (mySelfInMyFriend) {
          mySelfInMyFriend.amount -= friend.share;
          mySelfInMyFriend.transactions.push({
            share: friend.share,
            description: friend.description,
          });
          await myFriend.save();
        } else {
          console.log(`User with ID ${user_id} not found in friend's list.`);
        }

        const thatFriendInMyFriendList = USER.friends.find(
          (f) => f.id.toString() === friend.id
        );

        if (thatFriendInMyFriendList) {
          thatFriendInMyFriendList.amount += friend.share;
          thatFriendInMyFriendList.transactions.push({
            share: friend.share,
            description: friend.description,
          });
        } else {
          console.log(
            `Friend with ID ${friend.id} doesn't exist in the user's friend list!`
          );
        }
      })
    );

    USER.transactions.push({
      amount,
      description,
      paidBy: USER.name, // Assuming the user's name is stored in the "name" field
      paidFor: paidForList,
    });
    USER.totalBalance -= transaction.amount;
    await USER.save();
    return res.json({ USER });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
