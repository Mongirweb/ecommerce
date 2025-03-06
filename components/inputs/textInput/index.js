import { ErrorMessage, useField } from "formik";
import React, { useRef, useEffect, useState } from "react";
import styles from "./styles.module.scss"; // Assuming you have styles defined

export default function TextInput({ placeholder, label, ...props }) {
  const [field, meta] = useField(props);
  const textareaRef = useRef(null);
  // Local state to track cursor position
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // Restore the cursor position after each render/update
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.selectionStart = selection.start;
      textareaRef.current.selectionEnd = selection.end;
    }
  }, [field.value, selection]);

  useEffect(() => {
    // Function to adjust the height of the textarea

    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // Reset the height
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scrollHeight
      }
    };

    // Adjust height on mount and when the value changes
    adjustHeight();
  }, [field.value]);

  return (
    <div>
      <label
        className={`${styles.label} ${
          meta.touched && meta.error ? styles.inputError : ""
        }`}
      >
        <span>{label}</span>
        <textarea
          ref={textareaRef}
          name={field.name}
          placeholder={placeholder}
          {...field}
          {...props}
          rows={1} // Minimum rows
          className={`${styles.textarea} ${
            meta.touched && meta.error ? styles.textareaError : ""
          }`}
          onInput={(e) => {
            // Adjust the height dynamically on input
            setSelection({
              start: e.target.selectionStart,
              end: e.target.selectionEnd,
            });
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
