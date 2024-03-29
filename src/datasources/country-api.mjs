import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { load } from "./loader.mjs";

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL, {
  useUnifiedTopology: true,
});

await client.connect();
// await load(client);

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
};

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
    return cleanData(
      subKey
        ? doc?.Economy?.[key]?.[subKey]?.text || ""
        : doc?.Economy?.[key]?.text || ""
    );
  }

  getGeoData(doc, key, subKey) {
    return subKey
      ? doc?.Geography?.[key]?.[subKey]?.text || ""
      : doc?.Geography?.[key]?.text || "";
  }

  getSocietyData(doc, key, subKey) {
    return subKey
      ? doc?.["People and Society"]?.[key]?.[subKey]?.text || ""
      : doc?.["People and Society"]?.[key]?.text || "";
  }

  getGovData(doc, key, subKey) {
    return subKey
      ? doc?.["Government"]?.[key]?.[subKey]?.text || ""
      : doc?.["Government"]?.[key]?.text || "";
  }

  getEnvData(doc, key, subKey) {
    return subKey
      ? doc?.["Environment"]?.[key]?.[subKey]?.text || ""
      : doc?.["Environment"]?.[key]?.text || "";
  }

  getEnergyData(doc, key, subKey) {
    return subKey
      ? doc?.["Energy"]?.[key]?.[subKey]?.text || ""
      : doc?.["Energy"]?.[key]?.text || "";
  }

  getComData(doc, key, subKey) {
    return subKey
      ? doc?.["Communications"]?.[key]?.[subKey]?.text || ""
      : doc?.["Communications"]?.[key]?.text || "";
  }

  async getCountries() {
    let countries = [];
    const cursor = this.collection.find();

    // Print each document
    for await (const doc of cursor) {
      let realGDP2021 = this.getEconomyData(
        doc,
        "Real GDP (purchasing power parity)",
        "Real GDP (purchasing power parity) 2021"
      );
      realGDP2021 = realGDP2021.replace(/\$/g, "");
      realGDP2021 = parseNumber(realGDP2021);

      let realGDP2020 = this.getEconomyData(
        doc,
        "Real GDP (purchasing power parity)",
        "Real GDP (purchasing power parity) 2020"
      );
      realGDP2020 = realGDP2020.replace(/\$/g, "");
      realGDP2020 = parseNumber(realGDP2020);

      let realGDP2019 = this.getEconomyData(
        doc,
        "Real GDP (purchasing power parity)",
        "Real GDP (purchasing power parity) 2019"
      );
      realGDP2019 = realGDP2019.replace(/\$/g, "");
      realGDP2019 = parseNumber(realGDP2019);

      countries.push({
        name:
          doc?.Government?.["Country name"]?.["conventional short form"]
            ?.text || "",
        code: doc?.id,
        internetCountryCode:
          doc?.["Communications"]?.["Internet country code"]?.text || "",
        economy: {
          realGDP2021,
          realGDP2020,
          realGDP2019,
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
          gdpPerCapita2019: this.getEconomyData(
            doc,
            "Real GDP per capita",
            "Real GDP per capita 2019"
          ),
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
          debt2017: this.getEconomyData(
            doc,
            "Debt - external",
            "Debt - external 31 December 2017"
          ),
          debt2016: this.getEconomyData(
            doc,
            "Debt - external",
            "Debt - external 31 December 2016"
          ),
          exchangeCurrency: this.getEconomyData(
            doc,
            "Exchange rates",
            "Currency"
          ),
          exchangeRates2021: this.getEconomyData(
            doc,
            "Exchange rates",
            "Exchange rates 2021"
          ),
          exchangeRates2020: this.getEconomyData(
            doc,
            "Exchange rates",
            "Exchange rates 2020"
          ),
          exchangeRates2019: this.getEconomyData(
            doc,
            "Exchange rates",
            "Exchange rates 2019"
          ),
          exchangeRates2018: this.getEconomyData(
            doc,
            "Exchange rates",
            "Exchange rates 2018"
          ),
        },
        geography: {
          location: this.getGeoData(doc, "Location"),
          mapReferences: this.getGeoData(doc, "Map references"),
          area: this.getGeoData(doc, "Area", "total"),
          landBoundaries: this.getGeoData(doc, "Land boundaries", "total"),
          borderCountries: this.getGeoData(
            doc,
            "Land boundaries",
            "border countries"
          ),
          coastline: this.getGeoData(doc, "Coastline"),
          climate: this.getGeoData(doc, "Climate"),
          geoNote: this.getGeoData(doc, "Geography - note"),
          terrain: this.getGeoData(doc, "Terrain"),
          elevationHighest: this.getGeoData(doc, "Elevation", "highest point"),
          elevationLowest: this.getGeoData(doc, "Elevation", "lowest point"),
          naturalResources: this.getGeoData(doc, "Natural resources"),
          landUseAgriculture: this.getGeoData(
            doc,
            "Land use",
            "agricultural land"
          ),
          landUseArableLand: this.getGeoData(
            doc,
            "Land use",
            "agricultural land: arable land"
          ),
          landUseForest: this.getGeoData(doc, "Land use", "forest"),
          landUseOther: this.getGeoData(doc, "Land use", "other"),
          irrigatedLand: this.getGeoData(doc, "Irrigated land"),
          majorWatersheds: this.getGeoData(
            doc,
            "Major watersheds (area sq km)"
          ),
          populationDistribution: this.getGeoData(
            doc,
            "Population distribution"
          ),
          naturalHazards: this.getGeoData(doc, "Natural hazards"),
        },
        society: {
          population: this.getSocietyData(doc, "Population"),
          nationalityNoun: this.getSocietyData(doc, "Nationality", "noun"),
          nationalityAdjective: this.getSocietyData(
            doc,
            "Nationality",
            "adjective"
          ),
          ethnicGroups: this.getSocietyData(doc, "Ethnic groups"),
          languages: this.getSocietyData(doc, "Languages", "Languages"),
          religions: this.getSocietyData(doc, "Religions"),
          ageStructure14: this.getSocietyData(
            doc,
            "Age structure",
            "0-14 years"
          ),
          ageStructure64: this.getSocietyData(
            doc,
            "Age structure",
            "15-64 years"
          ),
          ageStructure65: this.getSocietyData(
            doc,
            "Age structure",
            "65 years and over"
          ),
          medianAgeTotal: this.getSocietyData(doc, "Median age", "total"),
          populationGrowthRate: this.getSocietyData(
            doc,
            "Population growth rate"
          ),
          birthRate: this.getSocietyData(doc, "Birth rate"),
          deathRate: this.getSocietyData(doc, "Death rate"),
          urbanization: this.getSocietyData(
            doc,
            "Urbanization",
            "urban population"
          ),
          urbanizationRate: this.getSocietyData(
            doc,
            "Urbanization",
            "rate of urbanization"
          ),
          majorUrbanAreas: this.getSocietyData(
            doc,
            "Major urban areas - population"
          ),
          sexRatioTotal: this.getSocietyData(
            doc,
            "Sex ratio",
            "total population"
          ),
          infantMortalityTotal: this.getSocietyData(
            doc,
            "Infant mortality rate",
            "total"
          ),
          lifeExpectancyTotal: this.getSocietyData(
            doc,
            "Life expectancy at birth",
            "total population"
          ),
          totalFertility: this.getSocietyData(doc, "Total fertility rate"),
          drinkingWaterImprovedUrban: this.getSocietyData(
            doc,
            "Drinking water source",
            "improved: urban"
          ),
          drinkingWaterImprovedRural: this.getSocietyData(
            doc,
            "Drinking water source",
            "improved: rural"
          ),
          healthExpenditure: this.getSocietyData(
            doc,
            "Current health expenditure"
          ),
          physiciansDensity: this.getSocietyData(doc, "Physicians density"),
          sanitationAccessImprovedUrban: this.getSocietyData(
            doc,
            "Sanitation facility access",
            "improved: urban"
          ),
          obesityRate: this.getSocietyData(
            doc,
            "Obesity - adult prevalence rate"
          ),
          alcoholPerCapitaTotal: this.getSocietyData(
            doc,
            "Alcohol consumption per capita",
            "total"
          ),
          tobaccoUseTotal: this.getSocietyData(doc, "Tobacco use", "total"),
          educationExpenditure: this.getSocietyData(
            doc,
            "Education expenditures"
          ),
          literacyDefinition: this.getSocietyData(
            doc,
            "Literacy",
            "definition"
          ),
          literacyTotal: this.getSocietyData(
            doc,
            "Literacy",
            "total population"
          ),
          schoolLifeTotal: this.getSocietyData(
            doc,
            "School life expectancy (primary to tertiary education)",
            "total"
          ),
        },
        government: {
          countryNameLong: this.getGovData(
            doc,
            "Country name",
            "conventional long form"
          ),
          countryNameShort: this.getGovData(
            doc,
            "Country name",
            "conventional short form"
          ),
          countryNameLocalLong: this.getGovData(
            doc,
            "Country name",
            "local long form"
          ),
          countryNameLocalShort: this.getGovData(
            doc,
            "Country name",
            "local short form"
          ),
          countryNameEtymology: this.getGovData(
            doc,
            "Country name",
            "etymology"
          ),
          governmentType: this.getGovData(doc, "Government type"),
          capitalName: this.getGovData(doc, "Capital", "name"),
          capitalCoordinates: this.getGovData(doc, "Capital", "geographic coordinates"),
          capitalEtymology: this.getGovData(doc, "Capital", "etymology"),
          adminDivisions: this.getGovData(doc, "Administrative divisions"),
          independence: this.getGovData(doc, "Independence"),
          nationalHoliday: this.getGovData(doc, "National holiday"),
          constitutionHistory: this.getGovData(doc, "Constitution", "history"),
          legalSystem: this.getGovData(doc, "Legal system"),
          suffrage: this.getGovData(doc, "Suffrage"),
          chiefOfState: this.getGovData(doc, "Executive branch", "chief of state"),
          headOfGov: this.getGovData(doc, "Executive branch", "head of government"),
          cabinet: this.getGovData(doc, "Executive branch", "cabinet"),
          elections: this.getGovData(doc, "Executive branch", "elections/appointments"),
          electionResults: this.getGovData(doc, "Executive branch", "election results"),
          legislativeDescription: this.getGovData(doc, "Legislative branch", "description"),
          legislativeElections: this.getGovData(doc, "Legislative branch", "elections"),
          judicialCourt: this.getGovData(doc, "Judicial branch", "highest court(s)"),
          judicialSelection: this.getGovData(doc, "Judicial branch", "judge selection and term of office"),
          politicalParties: this.getGovData(doc, "Political parties and leaders"),
          intOrgs: this.getGovData(doc, "International organization participation"),
          flagDescription: this.getGovData(doc, "Flag description"),
          nationalSymbol: this.getGovData(doc, "National symbol(s)"),
          nationalAnthem: this.getGovData(doc, "National anthem", "name"),
          nationalHeritage: this.getGovData(doc, "National heritage", "total World Heritage Sites"),
        },
        environment: {
          currentIssues: this.getEnvData(doc, "Environment - current issues"),
          intAgreements: this.getEnvData(doc, "Environment - international agreements", "party to"),
          climate: this.getEnvData(doc, "Climate"),
          landUseAgriculture: this.getEnvData(doc, "Land use", "agricultural land"),
          revenueForest: this.getEnvData(doc, "Revenue from forest resources"),
          revenueCoal: this.getEnvData(doc, "Revenue from coal"),
          particulateMatter: this.getEnvData(doc, "Air pollutants", "particulate matter emissions"),
          carbonDioxide: this.getEnvData(doc, "Air pollutants", "carbon dioxide emissions"),
          methane: this.getEnvData(doc, "Air pollutants", "methane emissions"),
          wasteGenerated: this.getEnvData(doc, "Waste and recycling", "municipal solid waste generated annually"),
          wasteRecycled: this.getEnvData(doc, "Waste and recycling", "municipal solid waste recycled annually"),
          majorRivers: this.getEnvData(doc, "Major rivers (by length in km)"),
          municipalWater: this.getEnvData(doc, "Total water withdrawal", "municipal"),
          industrialWater: this.getEnvData(doc, "Total water withdrawal", "industrial"),
          agriculturalWater: this.getEnvData(doc, "Total water withdrawal", "agricultural"),
          totalRenewableWater: this.getEnvData(doc, "Total renewable water resources"),
        },
        energy: {
            electricityAccess: this.getEnergyData(doc, "Electricity access", "electrification - total population"),
            electricityInstalled: this.getEnergyData(doc, "Electricity", "installed generating capacity"),
            electricityConsumption: this.getEnergyData(doc, "Electricity", "consumption"),
            electricityExports: this.getEnergyData(doc, "Electricity", "exports"),
            electricityImports: this.getEnergyData(doc, "Electricity", "imports"),
            electricitySourceFossil: this.getEnergyData(doc, "Electricity generation sources", "fossil fuels"),
            electricitySourceNuclear: this.getEnergyData(doc, "Electricity generation sources", "nuclear"),
            electricitySourceSolar: this.getEnergyData(doc, "Electricity generation sources", "solar"),
            electricitySourceWind: this.getEnergyData(doc, "Electricity generation sources", "wind"),
            electricitySourceTideWave: this.getEnergyData(doc, "Electricity generation sources", "tide and wave"),
            electricitySourceGeothermal: this.getEnergyData(doc, "Electricity generation sources", "geothermal"),
            electricitySourceHydro: this.getEnergyData(doc, "Electricity generation sources", "hydroelectricity"),
            coalProduction: this.getEnergyData(doc, "Coal", "production"),
            coalConsumption: this.getEnergyData(doc, "Coal", "consumption"),
            coalExports: this.getEnergyData(doc, "Coal", "exports"),
            coalImports: this.getEnergyData(doc, "Coal", "imports"),
            coalReserves: this.getEnergyData(doc, "Coal", "proven reserves"),
            petrolProduction: this.getEnergyData(doc, "Petroleum", "total petroleum production"),
            petrolConsumption: this.getEnergyData(doc, "Petroleum", "refined petroleum consumption"),
            petrolCrudeExports: this.getEnergyData(doc, "Petroleum", "crude oil and lease condensate exports"),
            petrolCrudeImports: this.getEnergyData(doc, "Petroleum", "crude oil and lease condensate imports"),
            petrolCrudeReserves: this.getEnergyData(doc, "Petroleum", "crude oil estimated reserves"),
            gasProduction: this.getEnergyData(doc, "Natural gas", "production"),
            gasConsumption: this.getEnergyData(doc, "Natural gas", "consumption"),
            gasExports: this.getEnergyData(doc, "Natural gas", "exports"),
            gasImports: this.getEnergyData(doc, "Natural gas", "imports"),
            gasReserves: this.getEnergyData(doc, "Natural gas", "proven reserves"),
            carbonDioxideEmissions: this.getEnergyData(doc, "Carbon dioxide emissions", "total emissions"),
            energyConsumptionPerCapita: this.getEnergyData(doc, "Energy consumption per capita", "Total energy consumption per capita 2019"),
        },
        communications: {
            phoneFixedTotal: this.getComData(doc, "Telephones - fixed lines", "total subscriptions"),
            phoneFixedPer100: this.getComData(doc, "Telephones - fixed lines", "subscriptions per 100 inhabitants"),
            phoneMobileTotal: this.getComData(doc, "Telephones - mobile cellular", "total subscriptions"),
            phoneMobilePer100: this.getComData(doc, "Telephones - mobile cellular", "subscriptions per 100 inhabitants"),
            telecomSystemsAssessment: this.getComData(doc, "Telecommunication systems", "general assessment"),
            telecomSystemsInternational: this.getComData(doc, "Telecommunication systems", "international"),
            broadcastMedia: this.getComData(doc, "Broadcast media"),
            internetCountryCode: this.getComData(doc, "Internet country code"),
            internetUsersTotal: this.getComData(doc, "Internet users", "total"),
            internetUsersPer100: this.getComData(doc, "Internet users", "percent of population"),
            broadbandSubscriptionsTotal: this.getComData(doc, "Broadband - fixed subscriptions", "total"),
            broadbandSubscriptionsPer100: this.getComData(doc, "Broadband - fixed subscriptions", "subscriptions per 100 inhabitants"),
        }
      });
    }

    return countries;
  }
}
