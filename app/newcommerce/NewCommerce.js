"use client";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react"; // Keep for signIn function
import { useRouter } from "next/navigation"; // App router's useRouter
import { Formik, Form } from "formik";
import * as Yup from "yup";
import styles from "./styles.module.scss";
import LoginInput from "../../components/inputs/loginInput";
import CircledIconBtn from "../../components/buttons/circledIconBtn";
import { changeUserRole } from "../../requests/user";
import Header from "../../components/newcommerce/header";

const initialValues = {
  code: "",
};

export default function NewCommerce({ session }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passCode, setPassCode] = useState(initialValues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    if (session) {
      setIsLoggedIn(true);
      const userRole = session.user.role;
      const isEmployee = session.user.employee;

      if (userRole === "business" && isEmployee) {
        router.push("/business/dashboard");
      } else if (userRole === "business") {
        router.push("/newcommerce/onboard");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [session, router]);

  const { code } = passCode;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassCode((prev) => ({ ...prev, [name]: value }));
  };

  const codeValidation = Yup.object({
    code: Yup.string().required("Ingresa el codigo de convenio."),
  });

  const convertToBusiness = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await changeUserRole(passCode.code);
      setLoading(false);
      if (res.status === 400) {
        setError("Codigo Invalido");
      } else {
        await update({ role: "bussines" });
        router.push("/newcommerce/onboard");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <Header />
        <div className={styles.newcommerce}>
          <div className={styles.newcommerce__welcome}>
            <p>
              Bienvenido a <span>Somos el Hueco Medellín</span>, nos encanta que
              seas parte!
            </p>
          </div>
          <div className={styles.newcommerce__notlogedin}>
            <p>
              Para continuar por favor{" "}
              <span onClick={() => signIn()}>Inicia Sesión</span> o{" "}
              <span onClick={() => signIn()}>Registrate</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>NewCommerce</title>
      </Head>
      <Header />
      <div className={styles.newcommerce}>
        <div className={styles.newcommerce__welcome2}>
          <p>
            ¡Bienvenido a <span>Somos el Hueco Medellín</span>, nos encanta que
            seas parte!
            <br /> Por favor, ingresa el código de la invitación.
          </p>
        </div>
        {error && <div>{error}</div>}
        <div className={styles.newcommerce__form}>
          <Formik
            enableReinitialize
            initialValues={{
              code,
            }}
            validationSchema={codeValidation}
            onSubmit={convertToBusiness}
          >
            {(form) => (
              <Form>
                <LoginInput
                  type="text"
                  name="code"
                  icon="code"
                  placeholder="Codigo"
                  onChange={handleChange}
                />
                <CircledIconBtn type="submit" text="Continuar" />
              </Form>
            )}
          </Formik>
        </div>
        <div className={styles.newcommerce__welcome3}>
          <p>
            Si no tienes código de convenio, haz clic <span>AQUÍ</span>.
            <br /> ¡Te enviaremos uno!
          </p>
        </div>
      </div>
    </div>
  );
}
