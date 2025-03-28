"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideDialog } from "../../../store/DialogSlice";
import DialogModal from "../../dialogModal";
import Sidebar from "./sidebar";
import styles from "./styles.module.scss";
import Header from "./header";

export default function Layout({ children }) {
  const expandSidebar = useSelector((state) => state.expandSidebar);
  const showSidebar = expandSidebar.expandSidebar;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(hideDialog());
  }, []);

  return (
    <div className={styles.layout}>
      <DialogModal />
      <Header />
      <Sidebar />

      <div
        style={{ marginLeft: `${showSidebar ? "280px" : "80px"}` }}
        className={styles.layout__main}
      >
        {children}
      </div>
    </div>
  );
}
