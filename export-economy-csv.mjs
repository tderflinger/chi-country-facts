import { MongoClient } from "mongodb";
import fs from "fs/promises";

const MONGO_URL = "mongodb://dell-linux:27017";

const client = new MongoClient(MONGO_URL, {
  useUnifiedTopology: true,
});

const cleanData = (text) => {
  if (!text) {
    return "";
  }
  return text.split("(")[0].trim();
};

function parseNumber(str) {
    if (!str) return "";
    if (str === "") return "";

    let [num, unit] = str.split(' ');

    num = parseFloat(num);

    switch (unit.toLowerCase()) {
        case 'trillion':
            num *= 1e12;
            break;
        case 'billion':
            num *= 1e9;
            break;
        case 'million':
            num *= 1e6;
            break;
        case 'thousand':
            num *= 1e3;
            break;
        // add more cases if needed
    }

    return num;
}

async function run() {
  try {
    await client.connect();
    const database = client.db("CountryFacts");
    const collection = database.collection("countries");

    // Query all documents in the collection
    const cursor = collection.find();

    let csvData =
      "Country;Country Name;Real GDP (purchasing power parity) 2021 [USD];Real GDP (purchasing power parity) 2020 [USD];Real GDP (purchasing power parity) 2019 [USD];Real GDP Growth Rate 2021 [%];Real GDP Growth Rate 2020 [%];Real GDP Growth Rate 2019 [%];Real GDP per capita 2022 [USD];Real GDP per capita 2021 [USD]\n";

    // Print each document
    for await (const doc of cursor) {
      let realGDPPP2021 =
        doc?.Economy?.["Real GDP (purchasing power parity)"]?.[
          "Real GDP (purchasing power parity) 2021"
        ]?.text;
      // Remove data in parentheses
      realGDPPP2021 = cleanData(realGDPPP2021);
      realGDPPP2021 = realGDPPP2021.replace(/\$/g, '');
      realGDPPP2021 = parseNumber(realGDPPP2021);

      let realGDPPP2020 =
        doc?.Economy?.["Real GDP (purchasing power parity)"]?.[
          "Real GDP (purchasing power parity) 2020"
        ]?.text;
      // Remove data in parentheses
      realGDPPP2020 = cleanData(realGDPPP2020);
      realGDPPP2020 = realGDPPP2020.replace(/\$/g, '');
      realGDPPP2020 = parseNumber(realGDPPP2020);

      let realGDPPP2019 =
        doc?.Economy?.["Real GDP (purchasing power parity)"]?.[
          "Real GDP (purchasing power parity) 2019"
        ]?.text;
      realGDPPP2019 = cleanData(realGDPPP2019);
      realGDPPP2019 = realGDPPP2019.replace(/\$/g, '');
      realGDPPP2019 = parseNumber(realGDPPP2019);

      let realGDPGrowthRate2021 = doc?.Economy?.["Real GDP growth rate"]?.[
        "Real GDP growth rate 2021"
      ]?.text;
      realGDPGrowthRate2021 = cleanData(realGDPGrowthRate2021);
      realGDPGrowthRate2021 = realGDPGrowthRate2021.replace(/%/g, '');

      let realGDPGrowthRate2020 = doc?.Economy?.["Real GDP growth rate"]?.[
        "Real GDP growth rate 2020"
      ]?.text;
      realGDPGrowthRate2020 = cleanData(realGDPGrowthRate2020);
      realGDPGrowthRate2020 = realGDPGrowthRate2020.replace(/%/g, '');

      let realGDPGrowthRate2019 = doc?.Economy?.["Real GDP growth rate"]?.[
        "Real GDP growth rate 2019"
      ]?.text;
      realGDPGrowthRate2019 = cleanData(realGDPGrowthRate2019);
      realGDPGrowthRate2019 = realGDPGrowthRate2019.replace(/%/g, '');

      let realGDPCapita2022 = cleanData(doc?.Economy?.["Real GDP per capita"]?.[
        "Real GDP per capita 2022"
      ]?.text);
      realGDPCapita2022 = realGDPCapita2022.replace(/\$/g, '');

      let realGDPCapita2021 = cleanData(doc?.Economy?.["Real GDP per capita"]?.[
        "Real GDP per capita 2021"
      ]?.text);
      realGDPCapita2021 = realGDPCapita2021.replace(/\$/g, '');

      let countryName = doc?.Government?.["Country name"]?.["conventional short form"]?.text;
      countryName = cleanData(countryName);

      const country = doc?.id;
      console.log(countryName);
      console.log(doc?.id);
      // Append the data to the CSV string
      csvData += `${country};${countryName};${realGDPPP2021};${realGDPPP2020};${realGDPPP2019};${realGDPGrowthRate2021};${realGDPGrowthRate2020};${realGDPGrowthRate2019};${realGDPCapita2022};${realGDPCapita2021}\n`;
    }
    // Write the CSV data to a file
    await fs.writeFile("countries-economy.csv", csvData);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
