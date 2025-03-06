import { ErrorMessage, useField } from "formik";
import styles from "./styles.module.scss";
import { useEffect, useRef, useState } from "react";

export default function AdminInput({ placeholder, label, ...props }) {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [field, meta] = useField(props);
  const textareaRef = useRef(null);
  const preventScroll = (e) => {
    e.target.blur(); // Temporarily unfocus the input to prevent scroll.
  };
  // Restore the cursor position after each render/update
  useEffect(() => {
    if (textareaRef.current) {
      // Only restore selection if NOT a numeric type:
      if (textareaRef.current.type !== "number") {
        textareaRef.current.selectionStart = selection.start;
        textareaRef.current.selectionEnd = selection.end;
      }
    }
  }, [field.value, selection]);
  return (
    <div>
      <label
        className={`${styles.label} ${
          meta.touched && meta.error ? styles.inputError : ""
        }`}
      >
        <span>{label}</span>
        <input
          ref={textareaRef}
          type={field.type}
          name={field.name}
          placeholder={placeholder}
          {...field}
          {...props}
          onWheel={preventScroll}
          onInput={(e) => {
            // Adjust the height dynamically on input
            setSelection({
              start: e.target.selectionStart,
              end: e.target.selectionEnd,
            });
          }}
        />
      </label>
      {meta.touched && meta.error && (
        <div className={styles.inputError__msg}>
          <span></span>
          <ErrorMessage name={field.name} />
        </div>
      )}
    </div>
  );
}
