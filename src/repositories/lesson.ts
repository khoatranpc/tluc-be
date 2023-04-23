import { DB, DbCollections, getClient } from "../database";
import { Lesson } from "../model/lesson";
import { ObjectId } from "bson";

const lessonRepositories = {
  create: async (lesson: Lesson) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.lesson);
    const result = await collection.insertOne(lesson);
    client.close();
    return result;
  },
  getDraw: async (id: string) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.lesson);
    const result = await collection.findOne({
      _id: new ObjectId(id),
    });
    client.close();
    return result;
  },
  update: async (id: string, data: any) => {
    const client = await getClient();
    const collection = client.db(DB).collection(DbCollections.lesson);
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
    const collection = client.db(DB).collection(DbCollections.lesson);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    client.close();
    return result;
  },
};
export default lessonRepositories;
