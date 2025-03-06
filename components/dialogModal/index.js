"use client"; // Needed for Next.js 13 App Router with hooks

import { useSelector, useDispatch } from "react-redux";
import { hideDialog } from "../../store/DialogSlice";
import Link from "next/link";
import styles from "./styles.module.scss";
import { DialogContentText } from "@mui/material";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoMdArrowRoundForward } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function CustomDialog() {
  const dispatch = useDispatch();
  const dialog = useSelector((state) => state.dialog);
  const router = useRouter();

  const handleClose = () => {
    dispatch(hideDialog());
  };

  if (!dialog.show) {
    return null; // Hide if show = false
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <IoIosCheckmarkCircle />
            <h2>{dialog.header}</h2>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            &times;
          </button>
        </div>

        {/* Body: Loop over msgs */}
        <div className={styles.modalBody}>
          {dialog.msgs?.map((msg, i) => (
            <DialogContentText
              className={styles.msg}
              id="alert-dialog-slide-description"
              key={i}
            >
              <span>{msg.msg}</span>
            </DialogContentText>
          ))}
        </div>

        {/* Footer / Actions */}
        <div className={styles.modalFooter}>
          {/* If we have custom actions */}
          {dialog.actions?.length > 0 && (
            <div className={styles.actionsWrapper}>
              {dialog.actions.map((action, i) => (
                <button
                  key={i}
                  style={action.style}
                  onClick={action.onClick}
                  className={styles.btn}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* If we also have a link-based button in addition to actions */}
          {dialog.link?.link && (
            <Link href={dialog.link.link}>
              <button className={styles.btn} onClick={handleClose}>
                {dialog.link.text} <IoMdArrowRoundForward />
              </button>
            </Link>
          )}

          {dialog.link?.link2 && (
            <button
              className={styles.btn_continue}
              onClick={() => {
                handleClose();
                // If there's browser history, go back
                if (
                  typeof window !== "undefined" &&
                  window.history.length > 1
                ) {
                  router.back();
                } else {
                  // Fallback
                  router.push("/");
                }
              }}
            >
              {dialog.link.text2}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
