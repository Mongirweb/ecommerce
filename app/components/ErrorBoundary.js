"use client";

import { Component } from "react";
import styles from "../../styles/error.module.scss";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>¡Ups ocurrió un error!</h2>
          <p className={styles.errorMessage}>
            Ocurrió un error inesperado. Por favor, inténtalo de nuevo.
          </p>
          <button onClick={this.handleReset} className={styles.errorButton}>
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
