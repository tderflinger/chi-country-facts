# country-facts

This projects takes the JSON data from the World Factbook and loads it into a MongoDB database.
Once loaded, you can query the country facts via the MongoDB API. This opens up possibilities to
learn about the countries of the world.

This project uses the [https://github.com/factbook/factbook.json](https://github.com/factbook/factbook.json)
project as the source of the data.

## Preliminaries

You need an installation of MongoDB to use this project.

## Installation

Clone the [https://github.com/factbook/factbook.json](https://github.com/factbook/factbook.json) project into the same directory as this project.

## Loader Usage

Before running the loader, adjust the `MONGO_URL` constant in loader.mjs to your MongoDB URL.

Run the following command to start the server:

```bash
node loader.mjs
```

The loader application will load the data from the factbook.json project into your MongoDB database.
Then you can query all of the data from the World Factbook via the MongoDB API.

## License

MIT License
