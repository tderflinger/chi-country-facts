# chi-country-facts

![Chi logo](./docs/chi.png)

This projects takes the JSON data from the World Factbook and loads it into a MongoDB database.
Once loaded, you can query the country facts via the MongoDB API. 
Additionally, there is a GraphQL API to query the data. This opens up possibilities to
learn about the countries of the world.

This project uses the [https://github.com/factbook/factbook.json](https://github.com/factbook/factbook.json)
project as the source of the data.

## Why chi-country-facts

In Swahili, "nchi" means country. Since this project is about the facts of countries, we chose the name "chi-country-facts".

## Preliminaries

Clone the [https://github.com/factbook/factbook.json](https://github.com/factbook/factbook.json) project into the same directory as this project.

## Docker

There is a Docker Compose file in the project to run the GraphQL server together with the MongoDB database.

Start with:

```bash
docker compose up
```

At the first start the JSON factbook data is loaded into the MongoDB database.

Then you can access the Apollo Studio Sandbox by opening the following URL in your browser: http://localhost:4000

Inside the Apollo Studio Sandbox you can query the data.

## GraphQL API

If you want to start the GraphQL server without Docker, you can do so with the following command:

```bash
npm run start
```

Note, that you need to specify your MongoDB URL in the `MONGO_URL` environment variable (.env file).

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

## License

MIT License
