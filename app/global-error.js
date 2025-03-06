"use client";
import styles from "../styles/error.module.scss";

export default function Error({ error, reset }) {
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorTitle}>¡Ups ocurrio un error!</h2>
      <p className={styles.errorMessage}>
        Ocurrió un error inesperado. Por favor, inténtalo de nuevo.
      </p>
      {/* On click, call reset() to attempt to recover from the error boundary */}
      <button onClick={reset} className={styles.errorButton}>
        Reintentar
      </button>
    </div>
  );
}
