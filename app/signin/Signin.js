// File: app/signin/SignInComponent.jsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import styles from "../../styles/signin.module.scss";
import Footer from "../../components/footer";
import Header from "../../components/header";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CircledIconBtn from "../../components/buttons/circledIconBtn";
import axios from "axios";
import DotLoaderSpinner from "../../components/loaders/dotLoader";
import LoginInput from "../../components/inputs/loginInput";
import Image from "next/image";
import google from "../../public/icons/google.png";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";

export default function SignInComponent({ providers, csrfToken, callbackUrl }) {
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState({
    login_email: "",
    login_password: "",
    name: "",
    email: "",
    password: "",
    conf_password: "",
    success: "",
    error: "",
    login_error: "",
  });

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  const {
    login_email,
    login_password,
    name,
    email,
    password,
    conf_password,
    success,
    error,
    login_error,
  } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const loginValidation = Yup.object({
    login_email: Yup.string()
      .required("Se requiere una dirección de correo electrónico.")
      .email("Por favor, introduce una dirección de correo válida."),
    login_password: Yup.string().required(
      "Por favor, introduce una contraseña."
    ),
  });

  const registerValidation = Yup.object({
    name: Yup.string()
      .required("¿Cuál es tu nombre?")
      .min(2, "El nombre debe tener entre 2 y 16 caracteres.")
      .max(16, "El nombre debe tener entre 2 y 16 caracteres.")
      .matches(/^[aA-zZ]/, "No se permiten números ni caracteres especiales."),
    email: Yup.string()
      .required(
        "Necesitarás esto cuando inicies sesión y si alguna vez necesitas restablecer tu contraseña."
      )
      .email("Introduce una dirección de correo válida."),
    password: Yup.string()
      .required(
        "Introduce una combinación de al menos seis números, letras y signos de puntuación (como ! y &)."
      )
      .min(6, "La contraseña debe tener al menos 6 caracteres.")
      .max(36, "La contraseña no puede tener más de 36 caracteres."),
    conf_password: Yup.string()
      .required("Confirma tu contraseña.")
      .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir."),
  });

  const signUpHandler = async () => {
    try {
      setLoading(true);

      const { data } = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      setUser({ ...user, error: "", success: data.message });

      setTimeout(async () => {
        let options = {
          redirect: false,
          email: email,
          password: password,
          callbackUrl: callbackUrl,
        };
        const res = await signIn("credentials", options);
        router.push(res.url || callbackUrl);
      }, 2000);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setUser({ ...user, success: "", error: error.response.data.message });
    }
  };

  const signInHandler = async () => {
    setLoading(true);
    let options = {
      redirect: false,
      email: login_email,
      password: login_password,
      callbackUrl: callbackUrl,
    };
    const res = await signIn("credentials", options);

    setUser({ ...user, success: "", error: "" });
    setLoading(false);
    if (res?.error) {
      setLoading(false);
      setUser({ ...user, login_error: res?.error });
    } else {
      router.push(res.url || callbackUrl);
    }
  };

  const handleSwitch = () => {
    setIsRegistering((prev) => !prev);
  };

  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <Header />
      <div className={styles.login}>
        <div className={styles.login__container}>
          <div className={styles.login__header}>
            <span>
              <FiShoppingCart /> ¡Estas a un paso de comprar!
              <br />
            </span>
            <span>
              {" "}
              <Link href="/">Regresar al comercio</Link>
            </span>
          </div>
          <div className={styles.login__form}>
            <h1>{isRegistering ? "Crear una cuenta" : "Iniciar Sesión"}</h1>
            <p>
              {isRegistering
                ? "para realizar la compra"
                : "para realizar la compra"}
            </p>
            <div className={styles.login__socials}>
              <div className={styles.login__socials_wrap}>
                {providers &&
                  Object.values(providers).map((provider) => {
                    if (provider.name === "Credentials") {
                      return null;
                    }
                    return (
                      <div key={provider.name}>
                        <button
                          type="button"
                          className={styles.social__btn}
                          onClick={() => signIn(provider.id, { callbackUrl })}
                        >
                          <Image src={google} alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco" loading="lazy" />
                          Acceder con {provider.name}
                        </button>
                      </div>
                    );
                  })}
                <span className={styles.or}>O accede con:</span>
              </div>
            </div>
            <Formik
              enableReinitialize
              initialValues={
                isRegistering
                  ? { name, email, password, conf_password }
                  : { login_email, login_password }
              }
              validationSchema={
                isRegistering ? registerValidation : loginValidation
              }
              onSubmit={() => {
                if (isRegistering) {
                  signUpHandler();
                } else {
                  signInHandler();
                }
              }}
            >
              {(form) => (
                <Form>
                  {isRegistering ? (
                    <>
                      <LoginInput
                        type="text"
                        name="name"
                        icon="user"
                        placeholder="Nombre completo"
                        onChange={handleChange}
                        autoComplete="off"
                        autocomplete="off"
                      />
                      <LoginInput
                        type="text"
                        name="email"
                        icon="email"
                        placeholder="Correo electrónico"
                        onChange={handleChange}
                        autoComplete="off"
                        autocomplete="off"
                      />
                      <LoginInput
                        type="password"
                        name="password"
                        icon="password"
                        placeholder="Contraseña"
                        onChange={handleChange}
                        autoComplete="off"
                        autocomplete="off"
                      />
                      <LoginInput
                        type="password"
                        name="conf_password"
                        icon="password"
                        placeholder="Repite la contraseña"
                        onChange={handleChange}
                        autoComplete="off"
                        autocomplete="off"
                      />
                    </>
                  ) : (
                    <>
                      <LoginInput
                        type="text"
                        name="login_email"
                        icon="email"
                        placeholder="Correo electrónico"
                        onChange={handleChange}
                        autocomplete="off"
                        autoComplete="new-password"
                      />
                      <LoginInput
                        type="password"
                        name="login_password"
                        icon="password"
                        placeholder="Contraseña"
                        onChange={handleChange}
                        autoComplete="off"
                        autocomplete="off"
                      />
                    </>
                  )}
                  <CircledIconBtn
                    type="submit"
                    text={isRegistering ? "Registrarme" : "Iniciar sesión"}
                  />
                  {login_error && (
                    <span className={styles.error}>{login_error}</span>
                  )}
                  <div className={styles.forgot}>
                    <Link href="/auth/forgot" prefetch={true}>
                      ¿Olvidaste la contraseña?
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
            <p style={{ fontSize: "16px" }}>
              {isRegistering
                ? "¿Ya tienes una cuenta? "
                : "¿No tienes cuenta? "}
              <span className={styles.link} onClick={handleSwitch}>
                {isRegistering ? "Inicia Sesión" : "Registrate"}
              </span>
            </p>
            <div>
              {success && <span className={styles.success}>{success}</span>}
            </div>
            <p style={{ marginTop: "20px", width: "90%", fontSize: "14px" }}>
              Al ingresar a Somos el Hueco Medellín aceptas nuestros{" "}
              <span style={{ color: "blue", cursor: "pointer" }}>
                términos y condiciones
              </span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
