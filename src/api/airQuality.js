import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const airQualityApi = createApi({
  reducerPath: "airQualityApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.data.gov.in/resource/",
  }),

  endpoints: (builder) => ({
    getAirQuality: builder.query({
      async queryFn(args, _queryApi, _extraOptions, fetchWithBQ) {
        const { latitude, longitude, city } = args || {};
        const apiKey = import.meta.env.VITE_DATA_GOV_API_KEY;

        // 1. Try CPCB data.gov.in if city is known
        if (city && apiKey) {
          let searchCity = city.trim();
          if (/delhi/i.test(searchCity)) {
            searchCity = "Delhi";
          } else {
            searchCity = searchCity.charAt(0).toUpperCase() + searchCity.slice(1).toLowerCase();
          }

          try {
            const res = await fetchWithBQ({
              url: "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69",
              params: {
                "api-key": apiKey,
                format: "json",
                offset: 0,
                limit: 100,
                "filters[city]": searchCity,
              },
            });

            if (
              res.data &&
              Array.isArray(res.data.records) &&
              res.data.records.length > 0
            ) {
              return {
                data: {
                  source: "CPCB (data.gov.in)",
                  city: searchCity,
                  records: res.data.records,
                },
              };
            }
          } catch (err) {
            console.warn("data.gov.in request failed:", err);
          }
        }

        // 2. Fallback to Open-Meteo Air Quality (global coverage via lat/long)
        if (latitude != null && longitude != null) {
          try {
            const omRes = await fetch(
              `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`
            );
            if (omRes.ok) {
              const omData = await omRes.json();
              return {
                data: {
                  source: "Open-Meteo Air Quality",
                  city: city || "Current Location",
                  current: omData.current,
                },
              };
            }
          } catch (err) {
            console.warn("Open-Meteo fallback failed:", err);
          }
        }

        return {
          error: {
            status: 404,
            data: "Air quality data unavailable",
          },
        };
      },
    }),
  }),
});

export const { useGetAirQualityQuery } = airQualityApi;