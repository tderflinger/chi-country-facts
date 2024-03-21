# chi-country-facts

This projects takes the JSON data from the World Factbook and loads it into a MongoDB database.
Once loaded, you can query the country facts via the MongoDB API. 
Additionally, there is a GraphQL API to query the data. This opens up possibilities to
learn about the countries of the world.

This project uses the [https://github.com/factbook/factbook.json](https://github.com/factbook/factbook.json)
project as the source of the data.

## Why chi-country-facts

In Swahili, "nchi" means country. Since this project is about the facts of countries, we chose the name "chi-country-facts".

## Preliminaries

You need an installation of MongoDB to use this project. One possibility is to install MongoDB locally on your machine with Docker:
[https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)

There also exist hosted versions of MongoDB on major cloud providers.

## Installation

Clone the [https://github.com/factbook/factbook.json](https://github.com/factbook/factbook.json) project into the same directory as this project.

Run the folling command to install the JavaScript dependencies:

```bash
npm install
```

## Loader Usage

Before running the loader, adjust the `MONGO_URL` constant in loader.mjs to your MongoDB URL.

Run the following command to start the server:

```bash
node loader.mjs
```

The loader application will load the data from the factbook.json project into your MongoDB database.
Then you can query all of the data from the World Factbook via the MongoDB API.

## GraphQL API

You can start the Apollo GraphQL server with the following command:

```bash
cd src
node graphql-server.mjs
```

Then you can access the Apollo Studio Sandbox by opening the following URL in your browser: http://localhost:4000

Note, that you need to adapt the `MONGO_URL` constant in `src/datasources/country-api.mjs` to your MongoDB URL.

## Exporting Data

Once the data is loaded in the MongoDB database you can export the data to a JSON file using the following command:

```bash
node export.mjs
```

There is also the possibility to export, clean and normalize some data about the economy of the countries using the following command:

```bash
node export-economy-csv.mjs
```

The resulting file is a CSV file (countries-economy.csv) which can be further analyzed, for example using Excel or Pandas.

## Querying Data

You can query the data using the MongoDB API. Alternatively, run the GraphQL server and query via the GraphQL API.
There also exists the Apollo Studio Sandbox to query the data.

## License

MIT License
