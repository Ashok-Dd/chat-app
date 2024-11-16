import { User } from "../models/UserModel.js";
import Messages from "../models/MessageModel.js";
import mongoose from "mongoose";
export const getAllUsers = async (req , res) => {
    try {
        const {searchTerm = ""} = req.body;


        const sanitizedSearchTerm = searchTerm.replace(
            /[.*?^${}()|[\]\\]/g ,
            '\\$&'
        );

        const regx = RegExp(sanitizedSearchTerm , "i");

        const contacts = searchTerm ?  await User.find({
            $and : [
                {_id : {$ne : req.userId}} ,
                {$or : [
                    {name : regx},
                    {email : regx}
                ]}
            ]
        }) : await User.find({_id : {$ne : req.userId}})

        return res.status(200).json({contacts})
    } catch (error) {
        console.log("Error in filtering " , error.message);
        return res.status(500).json("Internal server Error");
    }
}

export const getAllDmMessages = async (req, res, next) => {
  try {
    let { userId } = req;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Messages.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 }, // Sort messages by timestamp in descending order
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
          lastMessageContent: { $first: "$content" }, // Get the latest message content
        },
      },
      {
        $lookup: {
          from: "users",  // Ensure the collection name matches your actual User collection (check for pluralization)
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          lastMessageContent: 1,
          email: "$contactInfo.email",
          name: "$contactInfo.name",
          profileImage : "$contactInfo.profileImage"
        },
      },
      {
        $sort: { lastMessageTime: -1 }, // Sort contacts by latest message timestamp
      },
    ]);

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

  export const getPreviousMessages = async  (req , res) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.userId;

        const messages = await Messages.find(
            {$or : [
                {sender : user1 , recipient : user2},
                {sender : user2 , recipient : user1}
            ]}
        ).populate("parentMessage");

        return res.status(200).json({success : true , messages})
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
  }