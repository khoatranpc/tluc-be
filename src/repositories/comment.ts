import { DB, DbCollections, getClient } from "../database";

import { ObjectId } from "bson";

const pipeline = [
  {
    $unwind: {
      path: "$comment",
    },
  },
  {
    $lookup: {
      from: "user",
      localField: "comment.userId",
      foreignField: "_id",
      as: "alo",
    },
  },
  {
    $group: {
      _id: "$_id",
      idComment: {
        $first: "$idComment",
      },
      listComment: {
        $push: {
          user: {
            $first: "$alo",
          },
          content: "$comment.content",
          time: "$comment.time",
        },
      },
    },
  },
  {
    $project: {
      _id: 1,
      idComment: 1,
      listComment: {
        user: {
          _id: 1,
          username: 1,
          role: 1,
          status: 1,
          img: 1,
          email: 1,
          phone: 1,
          createTime:1,
          lastModified: 1,
        },
        content: 1,
        time: 1,
      },
    },
  },
];
const commentRepositories = {
  create: async (comment: any) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.comment);
    const result = await collection.insertOne(comment);
    client.close();
    return result;
  },
  getAll: async (id: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.comment);

    const result = await collection
      .aggregate([
        {
          $match: {
            idComment: new ObjectId(id),
          },
        },
        ...pipeline,
      ])
      .toArray();
    client.close();
    return result;
  },
  addComment: async (id: string, info: any) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.comment);

    const result = await collection.updateOne(
      { idComment: new ObjectId(id) },
      {
        $push: {
          comment: info,
        },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
};
export default commentRepositories;
