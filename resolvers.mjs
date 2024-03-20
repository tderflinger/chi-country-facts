export const resolvers = {
    Query: {
      country: async (_, __, { dataSources }) => {
        return await dataSources.countryAPI.getCountries();
      },

/*      // get a single track by ID, for the track page
      track: (_, { id }, { dataSources }) => {
        return dataSources.trackAPI.getTrack(id);
      }, */
    },
  };
  