import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  interests: [],
  location: {
    city: "",
    latitude: null,
    longitude: null,
  },
  onboardingCompleted: false,
};

const preferenceSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },

    setInterests: (state, action) => {
      state.interests = action.payload;
    },

    setLocation: (state, action) => {
      state.location = action.payload;
    },

    completeOnboarding: (state) => {
      state.onboardingCompleted = true;
    },

    resetPreferences: (state) => {
      state.name = "";
      state.interests = [];
      state.location = {
        city: "",
        latitude: null,
        longitude: null,
      };
      state.onboardingCompleted = false;
    },
  },
});

export const {
  setName,
  setInterests,
  setLocation,
  completeOnboarding,
  resetPreferences,
} = preferenceSlice.actions;

export default preferenceSlice.reducer;