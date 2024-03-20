import { MongoClient } from "mongodb";

const MONGO_URL = "mongodb://dell-linux:27017";

const client = new MongoClient(MONGO_URL, {
  useUnifiedTopology: true,
});

export class CountryAPI {
  constructor() {
    this.setupMongo();
  }

  async setupMongo() {
    await client.connect();
    const database = client.db("CountryFacts");
    this.collection = database.collection("countries");
  }

  async getCountries() {
    let countries = [];
    const cursor = this.collection.find();

    // Print each document
    for await (const doc of cursor) {
      countries.push({
        name:
          doc?.Government?.["Country name"]?.["conventional short form"]
            ?.text || "",
        code: doc?.id,
        internetCountryCode:
          doc?.["Communications"]?.["Internet country code"]?.text || "",
        economy: {
          realGDP2021:
            doc?.Economy?.["Real GDP (purchasing power parity)"]?.[
              "Real GDP (purchasing power parity) 2021"
            ]?.text || "",
          realGDP2020:
            doc?.Economy?.["Real GDP (purchasing power parity)"]?.[
              "Real GDP (purchasing power parity) 2020"
            ]?.text || "",
          realGDP2019:
            doc?.Economy?.["Real GDP (purchasing power parity)"]?.[
              "Real GDP (purchasing power parity) 2019"
            ]?.text || "",
          gdpGrowthRate2021:
            doc?.Economy?.["Real GDP growth rate"]?.[
              "Real GDP growth rate 2021"
            ]?.text || "",
          gdpGrowthRate2020:
            doc?.Economy?.["Real GDP growth rate"]?.[
              "Real GDP growth rate 2020"
            ]?.text || "",
          gdpGrowthRate2019:
            doc?.Economy?.["Real GDP growth rate"]?.[
              "Real GDP growth rate 2019"
            ]?.text || "",
          fitchRating:
            doc?.Economy?.["Credit ratings"]?.["Fitch rating"]?.text || "",
          moodyRating:
            doc?.Economy?.["Credit ratings"]?.["Moody's rating"]?.text || "",
          standardAndPoorRating:
            doc?.Economy?.["Credit ratings"]?.["Standard & Poors rating"]
              ?.text || "",
          gdpPerCapita2019:
            doc?.Economy?.["Real GDP per capita"]?.["Real GDP per capita 2019"]
              ?.text || "",
          gdpPerCapita2020:
            doc?.Economy?.["Real GDP per capita"]?.["Real GDP per capita 2020"]
              ?.text || "",
          gdpPerCapita2021:
            doc?.Economy?.["Real GDP per capita"]?.["Real GDP per capita 2021"]
              ?.text || "",
        },
      });
    }

    return countries;
  }
}
