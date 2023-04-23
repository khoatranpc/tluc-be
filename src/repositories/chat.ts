import { DB, DbCollections, getClient } from "../database";
import { Unit } from "../model/unit";
import { ObjectId } from "bson";

const chatRepositories = {
  create: async (data: any) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.chat);
    const result = await collection.insertOne(data);
    client.close();
    return result;
  },
  getAll: async (id: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.chat);
    const result = await collection
      .aggregate([
        // {
        //   $match: {
        //     me: new ObjectId(id),
        //   },
        // },
        {
          $lookup: {
            from: "user",
            localField: "me",
            foreignField: "_id",
            as: "me",
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "friendUserId",
            foreignField: "_id",
            as: "friendUserId",
          },
        },
        {
          $addFields: {
            myInfo: {
              name: {
                $arrayElemAt: ["$me.username", 0],
              },
              _id: {
                $arrayElemAt: ["$me._id", 0],
              },
              img: {
                $arrayElemAt: ["$me.img", 0],
              },
            },
          },
        },
        {
          $addFields: {
            myFriendInfo: {
              name: {
                $arrayElemAt: ["$friendUserId.username", 0],
              },
              _id: {
                $arrayElemAt: ["$friendUserId._id", 0],
              },
              img: {
                $arrayElemAt: ["$friendUserId.img", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            chatName: 1,
            message: 1,
            createTime: 1,
            myInfo: 1,
            myFriendInfo: 1,
          },
        },
      ])
      .toArray();
    client.close();
    return result;
  },
  addChat: async (chatId: string, data: any) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.chat);
    const result = await collection.updateOne(
      { _id: new ObjectId(chatId) },
      {
        $push: {
          message: data,
        },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
};
export default chatRepositories;
