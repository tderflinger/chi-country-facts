export const resolvers = {
    Query: {
      country: async (_, __, { dataSources }) => {
        return await dataSources.countryAPI.getCountries();
      },
    },
  };
  