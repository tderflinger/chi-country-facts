import { MongoClient } from "mongodb";

const MONGO_URL = "mongodb://dell-linux:27017";

const client = new MongoClient(MONGO_URL, {
  useUnifiedTopology: true,
});

async function run() {
    try {
      await client.connect();
      const database = client.db("CountryFacts");
      const collection = database.collection("countries");
  
      // Query all documents in the collection
      const cursor = collection.find({ "Communications.Internet users.percent of population.text": { $lte: "15%" }});
  
      // Print each document
      for await (const doc of cursor) {
        console.log(JSON.stringify(doc?.Government["Country name"]["conventional short form"].text));
        console.log(doc?.id);
    }
    } finally {
      await client.close();
    }
  }
  
  run().catch(console.dir);
