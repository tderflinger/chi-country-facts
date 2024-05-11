/*
  Loads JSON files from factbook.json project into a Mongo database.
*/
import fs from "fs/promises";
import path from "path";

// const MONGO_URL = "mongodb://localhost:27017";

/*
const client = new MongoClient(MONGO_URL, {
  useUnifiedTopology: true,
});
*/

export async function load(client) {
  try {
    await client.connect();
    const database = client.db("CountryFacts");
    const collection = database.collection("countries");

    async function insertFile(fileName, id) {
      const data = await fs.readFile(fileName, "utf8");
      const jsonData = JSON.parse(data);
      jsonData["id"] = id;
      let result = await collection.insertOne(jsonData);
      console.log("Inserted document: ", result.insertedId);
    }

    async function findJsonFiles(dir) {
      const files = await fs.readdir(dir);
      for (const file of files) {
        const absolute = path.join(dir, file);
        const stat = await fs.stat(absolute);
        if (stat.isDirectory()) {
          await findJsonFiles(absolute);
        } else if (path.extname(absolute) === ".json") {
          const filenameWithoutExtension = path.basename(absolute, ".json");
          console.log("filenameWithoutExtension: ", filenameWithoutExtension);
          console.log(absolute);
          await insertFile(absolute, filenameWithoutExtension);
        }
      }
    }

    await findJsonFiles("./factbook.json");
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
