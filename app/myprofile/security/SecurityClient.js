"use client";
import Head from "next/head";
import Layout from "../../../components/profile/layout";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useState } from "react";
import CircledIconBtn from "../../../components/buttons/circledIconBtn";
import LoginInput from "../../../components/inputs/loginInput";
import styles from "../../../styles/profile.module.scss";
import axios from "axios";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

export default function SecurityClient({ user, tab, hasPassword }) {
  const [current_password, setCurrent_password] = useState("");
  const [password, setPassword] = useState("");
  const [conf_password, setConf_password] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  // Conditional validation: only require current_password if hasPassword = true
  const validate = Yup.object({
    ...(hasPassword && {
      current_password: Yup.string()
        .required(
          "Ingresa una combinación de al menos seis números, letras y signos de puntuación (p.ej., ! y &)."
        )
        .min(6, "La contraseña debe tener al menos 6 caracteres.")
        .max(36, "La contraseña no puede superar los 36 caracteres."),
    }),
    password: Yup.string()
      .required(
        "Ingresa una combinación de al menos seis números, letras y signos de puntuación (p.ej., ! y &)."
      )
      .min(6, "La contraseña debe tener al menos 6 caracteres.")
      .max(36, "La contraseña no puede superar los 36 caracteres."),
    conf_password: Yup.string()
      .required("Confirma tu contraseña.")
      .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir."),
  });

  const changePasswordHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put("/api/user/changePassword", {
        current_password,
        password,
      });
      setError("");
      setSuccess(data.message);
      await update({ role: "bussines" });
      // Reload the page after a short delay
      toast.success(data.message);
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      setLoading(false);
      setSuccess("");
      setError(error.response?.data?.message || "Error desconocido.");
    }
  };

  return (
    <Layout session={user} tab={tab}>
      <Head>
        <title>Perfil - Seguridad</title>
      </Head>
      <Formik
        enableReinitialize
        initialValues={{
          current_password,
          password,
          conf_password,
        }}
        validationSchema={validate}
        onSubmit={() => {
          changePasswordHandler();
        }}
      >
        {(form) => (
          <Form>
            {/* If the user does NOT have a password, show a notice box */}
            {!hasPassword && (
              <div className={styles.noticeBox}>
                <AiOutlineInfoCircle className={styles.noticeIcon} />
                <p className={styles.noticeMessage}>
                  No tienes una contraseña asignada todavía.
                  <br />
                  Si deseas, puedes configurar una nueva contraseña a
                  continuación.
                </p>
              </div>
            )}

            {/* Only render "Contraseña actual" if hasPassword is true */}
            {hasPassword && (
              <div className={styles.formGroup}>
                <LoginInput
                  type="password"
                  name="current_password"
                  icon="password"
                  placeholder="Contraseña actual"
                  onChange={(e) => setCurrent_password(e.target.value)}
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <LoginInput
                type="password"
                name="password"
                icon="password"
                placeholder="Nueva contraseña"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <LoginInput
                type="password"
                name="conf_password"
                icon="password"
                placeholder="Confirmar nueva contraseña"
                onChange={(e) => setConf_password(e.target.value)}
              />
            </div>

            <CircledIconBtn
              type="submit"
              text="Cambiar"
              disabled={loading}
              loading={loading}
            />

            <br />

            {error && <span className={styles.error}>{error}</span>}
            {success && <span className={styles.success}>{success}</span>}
          </Form>
        )}
      </Formik>
    </Layout>
  );
}
