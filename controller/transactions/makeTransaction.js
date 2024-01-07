// import { User } from "../../models/users.js";
// import bcrypt from "bcrypt";

// export const makeTransaction = async (req, res) => {
//   try {
//     const { user_id, transaction } = req.body;

//     // in the transaction:-
//     // 1. amount
//     // 2. description
//     // 3. friends: [{id: "",  share: "", description: ""}]
//     // let friends = [
//     //   {
//     //     id: "65506cea74a2d5053b67ae70",
//     //     name: "Uttam",
//     //     number: "00000000",
//     //     email: "uttam@gmail.com",
//     //   },
//     // 4. paidFor: ["", ...]
//     // ];

//     let user = await User.findById(user_id);

//     // the person making transaction is not found!
//     if (!user)
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found!" });

//     let friendList = [];
//     if (transaction.paidFor) {
//       const allFriendExists = transaction.paidFor.every((paidUser) => {
//         friendList = [
//           ...user.friends.find((fr) => fr.id.toString() === paidUser),
//         ];
//       });

//       return res.json({ friendList });
//       // console.log(friendList);

//       // let totalGain;
//       // if (allFriendExists) {
//       //   transaction.friends.map(async (friend) => {
//       //     // let f = await User.findById(friend.id);
//       //     let f = user.friends.find(({ fr }) => fr.id === friend.id);
//       //     totalGain = totalGain + friend.share;
//       //     f.transactions.push({
//       //       description: friend.description,
//       //       amount: friend.share * -1,
//       //       paidBy: user.name,
//       //     });

//       //     let uH = f.friends.find(user_id);
//       //     uH.amount = uH.amount + friend.share * -1;

//       //     let fH = user.friends.find(f.id);
//       //     fH.amount = fH.amount + friend.share;
//       //     await f.save();
//       //     await user.save();
//       //   });
//       // } else {
//       //   return res
//       //     .status(402)
//       //     .json({ sucess: false, message: "Some friend may not exist!" });
//       // }
//     } else {
//       return res.json({
//         success: false,
//         message: "Some friend may not exist!",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

import { User } from "../../models/users.js";
import bcrypt from "bcrypt";

export const makeTransaction = async (req, res) => {
  try {
    const { user_id, transaction } = req.body;

    const user = await User.findById(user_id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const { amount, description, friends, paidFor } = transaction;

    if (!amount || !description || !friends || !paidFor) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid transaction data!" });
    }

    const allFriendsExist = paidFor.every((paidUserId) =>
      user.friends.some((friend) => friend.id.toString() === paidUserId)
    );

    if (!allFriendsExist) {
      return res
        .status(402)
        .json({ success: false, message: "Some friends may not exist!" });
    }

    let totalGain = 0;

    await Promise.all(
      transaction.friends.map(async (friend) => {
        const friendObject = user.friends.find(
          ({ id }) => id.toString() === friend.id
        );

        if (friendObject) {
          totalGain += friend.share;

          if (!friendObject.transactions) {
            friendObject.transactions = [];
          }

          friendObject.transactions.push({
            description: friend.description,
            amount: friend.share * -1,
            paidBy: user.name,
          });
          const userFriendToUpdate = user.friends.find(
            (uH) => uH.id === user._id
          );
          userFriendToUpdate.amount += friend.share * -1;
          const friendToUpdate = user.friends.find(
            (fH) => fH.id.toString() === friend.id
          );
          friendToUpdate.amount += friend.share;

          await friendObject.save();
        }
      })
    );

    user.totalBalance += totalGain;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Transaction successful!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
