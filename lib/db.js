import {MongoClient} from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://hoomanramin:h2296360981HM@cluster0.k03kg.mongodb.net/?retryWrites=true&w=majority"
  );

  return client;
}
