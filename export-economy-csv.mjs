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

const parseNumber = (str) => {
  if (!str) return "";
  if (str === "") return "";

  let [num, unit] = str.split(" ");

  num = parseFloat(num);

  switch (unit?.toLowerCase()) {
    case "trillion":
      num *= 1e12;
      break;
    case "billion":
      num *= 1e9;
      break;
    case "million":
      num *= 1e6;
      break;
    case "thousand":
      num *= 1e3;
      break;
    default:

    // add more cases if needed
  }

  if (isNaN(num)) {
    return "";
  }

  return num;
}

const cleanBsp = (text) => {
  if (!text) {
    return "";
  }
  return text.replace(/\&nbsp;/g, "");
};

const getData = (doc, level1, level2 = null) => {
  return cleanData(level2 ? doc?.Economy?.[level1]?.[level2]?.text : doc?.Economy?.[level1]?.text);
}

const run = async () => {
  try {
    await client.connect();
    const database = client.db("CountryFacts");
    const collection = database.collection("countries");

    // Query all documents in the collection
    const cursor = collection.find();

    let csvData =
      "Country;Country Name;Real GDP (purchasing power parity) 2021 [USD];Real GDP (purchasing power parity) 2020 [USD];Real GDP (purchasing power parity) 2019 [USD];Real GDP Growth Rate 2021 [%];Real GDP Growth Rate 2020 [%];Real GDP Growth Rate 2019 [%];Real GDP per capita 2022 [USD];Real GDP per capita 2021 [USD];Inflation rate (consumer prices) 2020 [%];Fitch Rating;GDP Composition Agro;GDP Composition Industry;GDP Composition Services;Unemployment Rate 2021;Budget Revenue;Budget Expenditures;Exports 2020;Population below Poverty Line\n";

    // Print each document
    for await (const doc of cursor) {
      let realGDPPP2021 = getData(doc, "Real GDP (purchasing power parity)", "Real GDP (purchasing power parity) 2021");
      realGDPPP2021 = realGDPPP2021.replace(/\$/g, "");
      realGDPPP2021 = parseNumber(realGDPPP2021);

      let realGDPPP2020 = getData(doc, "Real GDP (purchasing power parity)", "Real GDP (purchasing power parity) 2020");
      realGDPPP2020 = realGDPPP2020.replace(/\$/g, "");
      realGDPPP2020 = parseNumber(realGDPPP2020);

      let realGDPPP2019 = getData(doc, "Real GDP (purchasing power parity)", "Real GDP (purchasing power parity) 2019");
      realGDPPP2019 = realGDPPP2019.replace(/\$/g, "");
      realGDPPP2019 = parseNumber(realGDPPP2019);

      let realGDPGrowthRate2021 = getData(doc, "Real GDP growth rate", "Real GDP growth rate 2021");
      realGDPGrowthRate2021 = realGDPGrowthRate2021.replace(/%/g, "");

      let realGDPGrowthRate2020 = getData(doc, "Real GDP growth rate", "Real GDP growth rate 2020");
      realGDPGrowthRate2020 = realGDPGrowthRate2020.replace(/%/g, "");

      let realGDPGrowthRate2019 = getData(doc, "Real GDP growth rate", "Real GDP growth rate 2019");
      realGDPGrowthRate2019 = realGDPGrowthRate2019.replace(/%/g, "");

      let realGDPCapita2022 = getData(doc, "Real GDP per capita", "Real GDP per capita 2022");
      realGDPCapita2022 = realGDPCapita2022.replace(/\$/g, "");

      let realGDPCapita2021 = getData(doc, "Real GDP per capita", "Real GDP per capita 2021");
      realGDPCapita2021 = realGDPCapita2021.replace(/\$/g, "");

      let inflationRate2020 = getData(doc, "Inflation rate (consumer prices)", "Inflation rate (consumer prices) 2020");
      inflationRate2020 = inflationRate2020.replace(/%/g, "");

      let fitchRating = getData(doc, "Credit ratings", "Fitch rating");

      let gdpCompositionAgro = getData(doc, "GDP - composition, by sector of origin", "agriculture");
      gdpCompositionAgro = gdpCompositionAgro.replace(/%/g, "");

      let gdpCompositionIndustry = getData(doc, "GDP - composition, by sector of origin", "industry");
      gdpCompositionIndustry = gdpCompositionIndustry.replace(/%/g, "");

      let gdpCompositionServices = getData(doc, "GDP - composition, by sector of origin", "services");
      gdpCompositionServices = gdpCompositionServices.replace(/%/g, "");

      let unemploymentRate = getData(doc, "Unemployment rate", "Unemployment rate 2021");
      unemploymentRate = unemploymentRate.replace(/%/g, "");

      let budgetRevenue = getData(doc, "Budget", "revenues");
      budgetRevenue = budgetRevenue.replace(/\$/g, "");
      budgetRevenue = parseNumber(budgetRevenue);

      let budgetExpenditures = getData(doc, "Budget", "expenditures");
      budgetExpenditures = budgetExpenditures.replace(/\$/g, "");
      budgetExpenditures = parseNumber(budgetExpenditures);

      let exports2020 = getData(doc, "Exports", "Exports 2020");
      exports2020 = exports2020.replace(/\$/g, "");
      exports2020 = parseNumber(exports2020);

      let populationBelowPoverty = getData(doc, "Population below poverty line");
      populationBelowPoverty = populationBelowPoverty.replace(/%/g, "");

      let countryName =
        doc?.Government?.["Country name"]?.["conventional short form"]?.text;
      countryName = cleanData(countryName);
      countryName = cleanBsp(countryName);

      const country = doc?.id;
      console.log(countryName);
      console.log(doc?.id);
      // Append the data to the CSV string
      csvData += `${country};${countryName};${realGDPPP2021};${realGDPPP2020};${realGDPPP2019};${realGDPGrowthRate2021};${realGDPGrowthRate2020};${realGDPGrowthRate2019};${realGDPCapita2022};${realGDPCapita2021};${inflationRate2020};${fitchRating};${gdpCompositionAgro};${gdpCompositionIndustry};${gdpCompositionServices};${unemploymentRate};${budgetRevenue};${budgetExpenditures};${exports2020};${populationBelowPoverty}\n`;
    }
    // Write the CSV data to a file
    await fs.writeFile("countries-economy.csv", csvData);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
