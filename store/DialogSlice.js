import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
  header: "",
  msgs: [],
  actions: [], // <-- We'll store custom dialog actions here
  link: {
    link: "",
    link_text: "",
    link2: "", // second link's url
    text2: "",
  },
};

export const DialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    showDialog(state, action) {
      const { header, msgs, actions, link } = action.payload;
      state.show = true;
      state.header = header || "";
      state.msgs = msgs || [];
      state.actions = actions || [];
      state.link = link || {};
    },
    hideDialog(state) {
      state.show = false;
      state.header = "";
      state.msgs = [];
      state.actions = []; // reset actions
      state.link = {};
    },
  },
});

export const { showDialog, hideDialog } = DialogSlice.actions;
export default DialogSlice.reducer;
