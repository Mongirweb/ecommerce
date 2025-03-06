"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";

import Footer from "../../../../components/footer";
import CircledIconBtn from "../../../../components/buttons/circledIconBtn";
import LoginInput from "../../../../components/inputs/loginInput";
import DotLoaderSpinner from "../../../../components/loaders/dotLoader";
import Header from "../../../../components/header";
import { toast } from "react-toastify";

import styles from "../../../../styles/forgot.module.scss";

export default function ResetForm({ userId }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [conf_password, setConf_password] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentResetURL = `http://${process.env.BASE_URL}/auth/reset/${userId}`;

  // 1) Validation schema for the form
  const passwordValidation = Yup.object({
    password: Yup.string()
      .required("Por favor, introduce una contraseña.")
      .min(6, "La contraseña debe tener al menos 6 caracteres.")
      .max(36, "La contraseña no puede superar los 36 caracteres."),
    conf_password: Yup.string()
      .required("Por favor, confirma tu contraseña.")
      .oneOf([Yup.ref("password")], "Las contraseñas no coinciden."),
  });

  // 2) Handler to send the PUT request to /api/auth/reset
  const resetHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put("/api/auth/reset", {
        user_id: userId,
        password,
      });

      setLoading(false);
      toast.success(data.message);
      setTimeout(() => {
        // 3) Construct sign-in URL with callback
        const callbackUrl = encodeURIComponent(currentResetURL);
        router.push(`/signin?callbackUrl=${callbackUrl}`);
      }, 2000);
    } catch (err) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Intenta de nuevo.");
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <Header country="" />
      <div className={styles.forgot}>
        <div>
          <div className={styles.forgot__header}>
            {/* <div className={styles.back__svg}>
              <BiLeftArrowAlt />
            </div> */}
            <span>Recuperar contraseña?</span>
          </div>

          {/* 4) Formik for password + confirm password */}
          <Formik
            enableReinitialize
            initialValues={{ password, conf_password }}
            validationSchema={passwordValidation}
            onSubmit={resetHandler}
          >
            {() => (
              <Form>
                <LoginInput
                  type="password"
                  name="password"
                  icon="password"
                  placeholder="Ingresa nueva contraseña"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <LoginInput
                  type="password"
                  name="conf_password"
                  icon="password"
                  placeholder="Confirma nueva contraseña"
                  onChange={(e) => setConf_password(e.target.value)}
                />

                <CircledIconBtn type="submit" text="Continuar" />
                {error && (
                  <div style={{ marginTop: "10px" }}>
                    <span className={styles.error}>{error}</span>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Footer country="" />
    </>
  );
}
