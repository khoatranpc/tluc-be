import { DB, DbCollections, getClient } from "../database";

import { ObjectId } from "bson";

const pipeline = [
  {
    $unwind: {
      path: "$student",
    },
  },
  {
    $lookup: {
      from: "user",
      localField: "student.userId",
      foreignField: "_id",
      as: "alo",
    },
  },
  {
    $group: {
      _id: "$_id",
      idClass: {
        $first: "$idClass",
      },
      listStudent: {
        $push: {
          user: {
            $first: "$alo",
          },
          time: "$student.time",
          access: "$student.access",
        },
      },
    },
  },
  {
    $project: {
      _id: 1,
      idComment: 1,
      listStudent: {
        user: {
          _id: 1,
          username: 1,
          role: 1,
          status: 1,
          img: 1,
          email: 1,
          phone: 1,
          lastModified: 1,
        },
        time: 1,
        access: 1,
      },
    },
  },
];
const enrollRepositories = {
  create: async (enroll: any) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.enroll);
    const result = await collection.insertOne(enroll);
    client.close();
    return result;
  },
  getAll: async (id: ObjectId) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.enroll);

    const result = await collection
      .aggregate([
        {
          $match: {
            idClass: id,
          },
        },
        ...pipeline,
      ])
      .toArray();
    client.close();
    return result;
  },
  addEnrollWaiting: async (id: string, info: any) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.enroll);

    const result = await collection.updateOne(
      { idClass: new ObjectId(id) },
      {
        $push: {
          student: info,
        },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
  addEnroll: async (id: string, studentId: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.enroll);
    const result = await collection.updateOne(
      { idClass: new ObjectId(id), "student.userId": new ObjectId(studentId) },
      {
        $set: { "student.$.access": true },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
  removeEnroll: async (id: string, studentId: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.enroll);
    const result = await collection.updateOne(
      { idClass: new ObjectId(id) },
      {
        $pull: { student: { userId: new ObjectId(studentId) } },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
};
export default enrollRepositories;
