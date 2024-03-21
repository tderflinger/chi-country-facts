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

  getEconomyData(doc, key, subKey) {
    return subKey
      ? doc?.Economy?.[key]?.[subKey]?.text || ""
      : doc?.Economy?.[key]?.text || "";
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
          inflation2021: this.getEconomyData(
            doc,
            "Inflation rate (consumer prices)",
            "Inflation rate (consumer prices) 2021"
          ),
          inflation2020: this.getEconomyData(
            doc,
            "Inflation rate (consumer prices)",
            "Inflation rate (consumer prices) 2020"
          ),
          inflation2019: this.getEconomyData(
            doc,
            "Inflation rate (consumer prices)",
            "Inflation rate (consumer prices) 2019"
          ),
          gdpAgriculture: this.getEconomyData(
            doc,
            "GDP - composition, by sector of origin",
            "agriculture"
          ),
          gdpIndustry: this.getEconomyData(
            doc,
            "GDP - composition, by sector of origin",
            "industry"
          ),
          gdpServices: this.getEconomyData(
            doc,
            "GDP - composition, by sector of origin",
            "services"
          ),
          agriculturalProducts: this.getEconomyData(
            doc,
            "Agricultural products"
          ),
          industries: this.getEconomyData(doc, "Industries"),
          unemployment2021: this.getEconomyData(
            doc,
            "Unemployment rate",
            "Unemployment rate 2021"
          ),
          unemployment2020: this.getEconomyData(
            doc,
            "Unemployment rate",
            "Unemployment rate 2020"
          ),
          unemployment2019: this.getEconomyData(
            doc,
            "Unemployment rate",
            "Unemployment rate 2019"
          ),
          youthUnemploymentTotal: this.getEconomyData(
            doc,
            "Youth unemployment rate (ages 15-24)",
            "total"
          ),
          belowPovertyLine: this.getEconomyData(
            doc,
            "Population below poverty line"
          ),
          budgetRevenues: this.getEconomyData(doc, "Budget", "revenues"),
          budgetExpenditures: this.getEconomyData(
            doc,
            "Budget",
            "expenditures"
          ),
          taxesRevenues: this.getEconomyData(doc, "Taxes and other revenues"),
          currentAccount2021: this.getEconomyData(
            doc,
            "Current account balance",
            "Current account balance 2021"
          ),
          currentAccount2020: this.getEconomyData(
            doc,
            "Current account balance",
            "Current account balance 2020"
          ),
          currentAccount2019: this.getEconomyData(
            doc,
            "Current account balance",
            "Current account balance 2019"
          ),
          exports2021: this.getEconomyData(doc, "Exports", "Exports 2021"),
          exports2020: this.getEconomyData(doc, "Exports", "Exports 2020"),
          exports2019: this.getEconomyData(doc, "Exports", "Exports 2019"),
          exportsPartners: this.getEconomyData(doc, "Exports - partners"),
          exportsCommodities: this.getEconomyData(doc, "Exports - commodities"),
          imports2021: this.getEconomyData(doc, "Imports", "Imports 2021"),
          imports2020: this.getEconomyData(doc, "Imports", "Imports 2020"),
          imports2019: this.getEconomyData(doc, "Imports", "Imports 2019"),
          importsPartners: this.getEconomyData(doc, "Imports - partners"),
          importsCommodities: this.getEconomyData(doc, "Imports - commodities"),
          forexReserves2021: this.getEconomyData(
            doc,
            "Reserves of foreign exchange and gold",
            "Reserves of foreign exchange and gold 31 December 2021"
          ),
          forexReserves2020: this.getEconomyData(
            doc,
            "Reserves of foreign exchange and gold",
            "Reserves of foreign exchange and gold 31 December 2020"
          ),
          forexReserves2019: this.getEconomyData(
            doc,
            "Reserves of foreign exchange and gold",
            "Reserves of foreign exchange and gold 31 December 2019"
          ),
          debt2017: this.getEconomyData(doc, "Debt - external", "Debt - external 31 December 2017"),
          debt2016: this.getEconomyData(doc, "Debt - external", "Debt - external 31 December 2016"),
          exchangeCurrency: this.getEconomyData(doc, "Exchange rates", "Currency"),
          exchangeRates2021: this.getEconomyData(doc, "Exchange rates", "Exchange rates 2021"),
          exchangeRates2020: this.getEconomyData(doc, "Exchange rates", "Exchange rates 2020"),
          exchangeRates2019: this.getEconomyData(doc, "Exchange rates", "Exchange rates 2019"),
          exchangeRates2018: this.getEconomyData(doc, "Exchange rates", "Exchange rates 2018"),
        },
      });
    }

    return countries;
  }
}
