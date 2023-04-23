import { ObjectId } from "bson";
import { DB, DbCollections, getClient } from "../database";
import { User } from "../model/user";
import { STATUS_USER } from "../Enum";

export enum OptionFind {
  ID = "_id",
  EMAIL = "email",
  NUMBERPHONE = "numberphone",
}

interface conditionsSearch extends Object {
  username: string;
  page: number;
  amount: number;
  status: string;
}
const userRepositories = {
  create: async (user: User) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.user);
    const result = await collection.insertOne(user);
    client.close();
    return result;
  },
  findOneBySingleField: async (option: OptionFind, field: string | number) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.user);
    const result = await collection.findOne({
      [option]: option === OptionFind.ID ? new ObjectId(field) : field,
    });
    client.close();
    return result;
  },
  updateUser: async (id: string, data: User) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.user);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          img: data.img,
          phone: data.phone,
          username: data.username,
        },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
  getUsers: async (conditions: conditionsSearch) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.user);

    const { username, page, amount, status } = conditions;

    const result = await collection
      .find({
        username: { $regex: new RegExp(username, "i") },
        status: status,
      })
      .skip(amount * (page - 1))
      .limit(amount)
      .toArray();
    client.close();
    return { data: result, quantity: result.length };
  },
  getUsersDashboard: async () => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.user);

    const result = await collection
      .aggregate([
        {
          $project: {
            _id: 1,
            role: 1,
            createTime: 1,
          },
        },
      ])
      .toArray();
    client.close();
    return result;
  },
  updateUserAdmin: async (id: string, data: User) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.user);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: data,
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
  deleteUserAdmin: async (id: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.user);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: STATUS_USER.DAT,
        },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
  addClass: async (id: string, data: ObjectId, option: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.user);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          [option]: data,
        },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
  removeClass: async (id: string, data: ObjectId, option: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.user);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $pull: {
          [option]: data,
        },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
  getUser: async (email: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.user);
    const result = await collection.findOne({ email }, {
      projection: {
        password: 0,
        salt: 0,
        classEnrollment: 0,
        classWaiting: 0,
        lessonDone: 0,
      }
    });
    client.close();
    return result;
  }
};
export default userRepositories;
