import { MongoClient } from "mongodb";
import fs from 'fs/promises';

const MONGO_URL = "mongodb://dell-linux:27017";

const client = new MongoClient(MONGO_URL, {
  useUnifiedTopology: true,
});

async function run() {
  let countries = [];
  try {
    await client.connect();
    const database = client.db("CountryFacts");
    const collection = database.collection("countries");

    // Query all documents in the collection
    const cursor = collection.find();

    // Print each document
    for await (const doc of cursor) {
      countries.push(doc);
    }
  } finally {
    await client.close();
    // Convert the countries array to a JSON string
    const data = JSON.stringify(countries);

    // Write the data to a file
    await fs.writeFile("countries.json", data);
  }
}

run().catch(console.dir);
