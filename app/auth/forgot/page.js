"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

import styles from "../../../styles/forgot.module.scss"; // Adjust path if needed

import Footer from "../../../components/footer";
import CircledIconBtn from "../../../components/buttons/circledIconBtn";
import LoginInput from "../../../components/inputs/loginInput";
import DotLoaderSpinner from "../../../components/loaders/dotLoader";
import Header from "../../../components/header";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation schema with Yup
  const emailValidation = Yup.object({
    email: Yup.string()
      .required("Ingresa tu correo electronico.")
      .email("Ingresa un correo electronico valido."),
  });

  // Handler for form submission
  const forgotHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/forgot", {
        email,
      });
      setError("");
      setSuccess(data.message);
      setLoading(false);
      setEmail("");
      toast.success(data.message);
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response?.data?.message || "Intenta de nuevo.");
      toast.error(error.response?.data?.message || "Intenta de nuevo.");
    }
  };

  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <Header country="" />
      <div className={styles.forgot}>
        <div>
          <div className={styles.forgot__header}>
            {/* <div className={styles.back__svg} onClick={() => signIn()}>
              <BiLeftArrowAlt />
            </div> */}
            <span>
              Olvidaste tu contraseña ?{" "}
              <div className={styles.back} onClick={() => signIn()}>
                Regresar
              </div>
            </span>
            <p>
              Ingresa el correo electronico con el que <br /> creaste tu cuenta.
            </p>
          </div>
          <Formik
            enableReinitialize
            initialValues={{ email }}
            validationSchema={emailValidation}
            onSubmit={forgotHandler}
          >
            {(form) => (
              <Form>
                <LoginInput
                  type="text"
                  name="email"
                  icon="email"
                  placeholder="Correo electrónico"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <CircledIconBtn type="submit" text="Recuperar" />
                <div style={{ marginTop: "10px" }}>
                  {error && <span className={styles.error}>{error}</span>}
                  {success && <span className={styles.success}>{success}</span>}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Footer country="" />
    </>
  );
}
