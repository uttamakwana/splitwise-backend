import { User } from "../models/users.js";
// importing bcrypt for encrypting the password
import bcrypt from "bcrypt";

// POST
// register API
export const register = async (req, res) => {
  try {
    const { name, email, number, password } = req.body;
    // find user with it's email
    let user = await User.findOne({ email });
    // if exist then give an error or already registered!
    if (user)
      return res.json({ sucess: false, message: "User already registered" });

    // convert password into hashed password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    // create user
    user = await User.create({ name, email, number, password: hashedPassword });
    res.json({ sucess: true, message: "User created successfully", user });
  } catch (error) {
    console.log(error);
  }
};

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

    return res.json({ sucess: true, message: "Login sucessfull!", user });
  } catch (error) {
    console.log(error);
  }
};

// GET
// get all the users
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

// POST
// send a friend a request to create a friend
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
      sucess: true,
      message: "Friend request send successfully!",
      friend,
    });
  } catch (error) {
    console.log(error);
  }
};

// POST
// accept a friend's request
export const acceptFriendRequest = async (req, res) => {
  const { user_id, friend_id } = req.body;

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
  });

  friend.friends.push({
    id: user_id,
    name: user.name,
    number: user.number,
    email: user.email,
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

// POST
// make a transaction and split expense
export const makeTransaction = async (req, res) => {
  try {
    const { user_id, transaction } = req.body;

    // in the transaction:-
    // 1. amount
    // 2. description
    // 3. friends: [{id: "",  share: "", description: ""}]
    // let friends = [
    //   {
    //     friendId: "65506cea74a2d5053b67ae70",
    //     name: "Uttam",
    //     number: "00000000",
    //     email: "uttam@gmail.com",
    //   },
    // 4. paidFor: ["", ...]
    // ];

    let user = await User.findById(user_id);

    // the person making transaction is not found!
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    if (transaction.friends) {
      const allFriendExists = transaction.paidFor.every((f) => {
        const friend = user.friends.find(({ fr }) => fr.id === f);

        return f === friend.id;
      });

      let totalGain;
      if (allFriendExists) {
        transaction.friends.map(async (friend) => {
          let f = await User.findById(friend.id);
          totalGain = totalGain + friend.share;
          f.transactions.push({
            description: friend.description,
            amount: friend.share * -1,
            paidBy: user.name,
          });

          let uH = f.friends.find(user_id);
          uH.amount = uH.amount + friend.share * -1;

          let fH = user.friends.find(f.id);
          fH.amount = fH.amount + friend.share;
          await f.save();
          await user.save();
        });
      } else {
        return res
          .status(402)
          .json({ sucess: false, message: "Some friend may not exist!" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// POST
// make a transaction and split expense
// export const makeTransaction = async (req, res) => {
//   try {
//     const { user_id, transaction } = req.body;

//     let user = await User.findById(user_id);

//     // the person making the transaction is not found!
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found!" });

//     if (transaction.friends) {
//       const allFriendsExist = transaction.friends.every((friend) =>
//         user.friends.some((f) => f.id.equals(friend.id))
//       );

//       if (allFriendsExist) {
//         let totalGain = 0;

//         for (const friend of transaction.friends) {
//           let f = await User.findById(friend.id);

//           totalGain += friend.share;

//           f.transactions.push({
//             description: friend.description,
//             amount: friend.share * -1,
//             paidBy: user.name,
//           });

//           let userFriend = user.friends.find((uFriend) =>
//             uFriend.id.equals(friend.id)
//           );
//           userFriend.amount += friend.share;

//           let friendUser = f.friends.find((fFriend) =>
//             fFriend.id.equals(user_id)
//           );
//           friendUser.amount -= friend.share;

//           await f.save();
//         }

//         // Update the user's totalBalance with totalGain
//         user.totalBalance += totalGain;
//         await user.save();

//         return res.status(200).json({
//           success: true,
//           message: "Transaction completed successfully!",
//         });
//       } else {
//         return res
//           .status(402)
//           .json({ success: false, message: "Some friends may not exist!" });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, message: "Internal server error." });
//   }
// };
