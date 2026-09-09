import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const locationApi = createApi({
  reducerPath: "locationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.bigdatacloud.net/data/",
  }),

  endpoints: (builder) => ({
    getLocation: builder.query({
      query: ({ latitude, longitude }) =>
        `reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    }),
    getCitySuggestions: builder.query({
      query: ({ query }) =>
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query,
        )}&count=8&language=en&format=json`,
    }),
  }),
});

export const { useGetLocationQuery, useGetCitySuggestionsQuery } = locationApi;
