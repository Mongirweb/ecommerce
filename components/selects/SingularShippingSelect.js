import { MenuItem, TextField } from "@mui/material";
import { ErrorMessage, useField } from "formik";
import styles from "./styles.module.scss";
import Image from "next/image";

export default function SingularShippingSelect({
  data,
  handleChange,
  placeholder,
  header,
  disabled,
  ...rest
}) {
  const [field, meta] = useField(rest);
  const id = `select-${field.name}`; // Unique ID for accessibility

  return (
    <div style={{ marginBottom: "1rem" }}>
      {header && (
        <div
          className={`${styles.header} ${
            meta.error ? styles.header__error : ""
          }`}
        >
          <div className={styles.flex}>
            {meta.error && (
              <Image
                width={100}
                height={100}
                src="/images/warning.png"
                alt="warning"
                loading="lazy"
              />
            )}
            {header}
          </div>
        </div>
      )}
      <TextField
        id={id} // Assign the unique ID
        variant="outlined"
        name={field.name}
        select
        label={placeholder}
        disabled={disabled}
        value={field.value}
        onChange={handleChange}
        className={`${styles.select} ${
          meta.touched && meta.error && styles.error__select
        }`}
        fullWidth // Optional: makes the select take full width
      >
        <MenuItem key="" value="">
          Selecciona una opción.
        </MenuItem>
        {data?.map((option, i) => (
          <MenuItem key={i} value={option._id || option.name}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
      {meta.touched && meta.error && (
        <p className={styles.error__msg}>
          <ErrorMessage name={field.name} />
        </p>
      )}
    </div>
  );
}
