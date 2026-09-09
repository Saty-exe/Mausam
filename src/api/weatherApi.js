import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.open-meteo.com/v1/",
  }),
  endpoints: (builder) => ({
    getWeather: builder.query({
      query: ({ latitude, longitude }) =>
        `forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,visibility,dew_point_2m,pressure_msl&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`,
    }),
  }),
});

export const { useGetWeatherQuery } = weatherApi;