import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { readFileSync } from "fs";
import path from "path";
import { gql } from "graphql-tag";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { CountryAPI } from "./datasources/country-api.mjs";
import { resolvers } from "./resolvers.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./schema.graphql"), {
    encoding: "utf-8",
  })
);

/*
const mocks = {
  Query: () => ({
    country: () => [...new Array(6)],
  }),
  Country: () => ({
    id: () => "gem",
    name: () => "Germany",
    code: () => "DE",
  }),
  Economy: () => ({
    realGDP2021: () => "4.2 trillion",
    realGDP2020: () => "4.5 trillion",
  }),
}; */

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;
      return {
        dataSources: {
          countryAPI: new CountryAPI(),
        },
      };
    },
  });
/*
  const server = new ApolloServer({
    schema: addMocksToSchema({
      schema: makeExecutableSchema({ typeDefs }),
      mocks,
    }),
  });
  const { url } = await startStandaloneServer(server); */
  console.log(`
      🚀  Server is running!
      📭  Query at ${url}
    `);
}

startApolloServer();