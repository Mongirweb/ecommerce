import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  header: "",
  msgs: [],
  link: {
    link: "",
    link_text: "",
    link2: "", // second link's url
    text2: "",
  },
};

export const CreateProductDialogSlice = createSlice({
  name: "dialogCreateProduct",
  initialState,
  reducers: {
    showCreateProductDialog(state, action) {
      state.show = true;
      state.header = action.payload.header;
      state.msgs = action.payload.msgs;
      state.link = action.payload.link;
    },
    hideCreateProductDialog(state, action) {
      state.show = false;
      state.header = "";
      state.msgs = [];
      state.link = {};
    },
  },
});

export const { showCreateProductDialog, hideCreateProductDialog } =
  CreateProductDialogSlice.actions;

export default CreateProductDialogSlice.reducer;
