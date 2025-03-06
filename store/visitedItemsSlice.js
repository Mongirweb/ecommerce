import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  visitedProducts: [],
};
export const visitedItemSlice = createSlice({
  name: "userVisitedProducts",
  initialState,
  reducers: {
    addToVisited(state, action) {
      state.visitedProducts.push(action.payload);
    },
    updateVisited(state, action) {
      state.visitedProducts = action.payload;
    },
    emptyVisited(state, action) {
      state.visitedProducts = [];
    },
  },
});

export const { addToVisited, updateVisited, emptyVisited } =
  visitedItemSlice.actions;

export default visitedItemSlice.reducer;
