![Chi logo](./docs/chi.png)

# chi-country-facts

This projects takes the JSON data from the World Factbook and loads it into a MongoDB database.
Once loaded, you can query the country facts via the MongoDB API. 
Additionally, there is a GraphQL API to query the data. This opens up possibilities to
learn about the countries of the world.

This project uses the [https://github.com/factbook/factbook.json](https://github.com/factbook/factbook.json)
project as the source of the data.

## Why chi-country-facts

In Swahili, "nchi" means country. Since this project is about the facts of countries, we chose the name "chi-country-facts".

## Running

There is a Docker image available on Docker Hub. You can run the application using the following docker-compose-prod.yml file:

docker-compose-prod.yml:
```yaml
version: '3'
services:
  app:
    image: tderflinger/chi-country-facts:0.1.0
    ports:
      - "4000:4000"
    depends_on:
      - db
    environment:
      - MONGO_URL=mongodb://db:27017/CountryFacts
  db:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data: 
```

Run it with the following command:

```bash
docker compose -f ./docker-compose-prod.yml up
```

This will retrieve the image from Docker Hub and create a local Mongo DB database. Then you can access the Apollo GraphQL Sandbox via the following URL: [http://localhost:4000](http://localhost:4000).

## Development

Clone the [https://github.com/factbook/factbook.json](https://github.com/factbook/factbook.json) project into the same directory as this project.

## Mongo DB Database

There is a Docker Compose file (docker-compose.yml) in the project to run the GraphQL server together with the MongoDB database.

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
