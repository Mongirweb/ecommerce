import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  page: 0,
  scrollPosition: 0,
};

const infiniteScrollSlice = createSlice({
  name: "infiniteScroll",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    addProducts: (state, action) => {
      state.products = [...state.products, ...action.payload];
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
    resetScrollData: (state) => {
      state.products = [];
      state.page = 0;
      state.scrollPosition = 0;
    },
  },
});

export const {
  setProducts,
  addProducts,
  setPage,
  setScrollPosition,
  resetScrollData,
} = infiniteScrollSlice.actions;
export default infiniteScrollSlice.reducer;
