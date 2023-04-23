import { MongoClient } from "mongodb";

const DB = "TLU_C";
enum DbCollections {
  user = "user",
  course = "courses",
  lesson = "lesson",
  unit = "unit",
  enroll = "enroll",
  comment = "comment",
  chat = "chat",
}

function getClient(): Promise<MongoClient> {
  const {
    MONGO_HOST,
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_DATABASE,
    MONGO_PORT,
  } = process.env;
  // const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}?retryWrites=true&w=majority`;
  const AUTHEN =
    MONGO_USERNAME && MONGO_PASSWORD
      ? `${MONGO_USERNAME}:${MONGO_PASSWORD}@:`
      : "";
  // const uri = `mongodb://${AUTHEN}${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
  const uri = `mongodb+srv://tlu_C:Menu00d1@cluster0.cwpzpbe.mongodb.net/test`;

  const client: MongoClient = new MongoClient(uri);
  return client.connect();
}

export { DB, DbCollections, getClient };
