import { DB, DbCollections, getClient } from "../database";
import { Unit } from "../model/unit";
import { ObjectId } from "bson";

const unitRepositories = {
  create: async (unit: Unit) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.unit);
    const result = await collection.insertOne(unit);
    client.close();
    return result;
  },
  getDrawUnit: async (id: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.unit);
    const result = await collection.findOne({
      _id: new ObjectId(id),
    });
    client.close();
    return result;
  },
  addLessonToUnit: async (id: string, data: ObjectId) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.unit);
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          lesson: data,
        },
        $currentDate: { lastModified: true },
      }
    );
    client.close();
    return result;
  },
  getDraw: async (id: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.unit);
    const result = await collection.findOne({
      _id: new ObjectId(id),
    });
    client.close();
    return result;
  },
  update: async (id: string, data: any) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.unit);
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
  delete: async (id: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.unit);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    client.close();
    return result;
  },
};
export default unitRepositories;
