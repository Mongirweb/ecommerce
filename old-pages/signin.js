import Header from "../components/header";
import Footer from "../components/footer";
import styles from "../styles/signin.module.scss";
import { BiLeftArrowAlt } from "react-icons/bi";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import CircledIconBtn from "../components/buttons/circledIconBtn";
import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  country,
  useSession,
} from "next-auth/react";
import axios from "axios";
import DotLoaderSpinner from "../components/loaders/dotLoader";
import Router from "next/router";
import LoginInput from "../components/inputs/loginInput";
import Image from "next/image";
import google from "../public/icons/google.png";
import { BiHappyAlt } from "react-icons/bi";

const initialvalues = {
  login_email: "",
  login_password: "",
  name: "",
  email: "",
  password: "",
  conf_password: "",
  success: "",
  error: "",
  login_error: "",
};
export default function Signin({ callbackUrl, csrfToken }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialvalues);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const signinProviders = await getProviders();
        setProviders(Object.values(signinProviders));
      } catch (error) {
        console.error(error);
      }
    };
    fetchProviders();
  }, []);

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
      setLoading(false);
      setTimeout(async () => {
        let options = {
          redirect: false,
          email: email,
          password: password,
        };
        const res = await signIn("credentials", options);
        Router.push("/");
      }, 2000);
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
    };
    const res = await signIn("credentials", options);
    setUser({ ...user, success: "", error: "" });
    setLoading(false);
    if (res?.error) {
      setLoading(false);
      setUser({ ...user, login_error: res?.error });
    } else {
      return Router.push(callbackUrl || "/");
    }
  };

  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <Header country={country} />
      <div className={styles.login}>
        <div className={styles.login__container}>
          <div className={styles.login__header}>
            {/* <div className={styles.back__svg}>
              <Link href="/">
                <BiLeftArrowAlt />
              </Link>
            </div> */}
            <span>
              Continúa comprando <BiHappyAlt fontSize={20} />, Inicia sesión o
              regístrate.
              <br />
              <Link href="/" prefetch={true}>
                Regresar al comercio
              </Link>
            </span>
          </div>
          <div className={styles.login__form}>
            <h1>Iniciar Sesión</h1>
            <p>Accede al marketplace de saldos mas grande del país</p>
            <Formik
              enableReinitialize
              initialValues={{
                login_email,
                login_password,
              }}
              validationSchema={loginValidation}
              onSubmit={() => {
                signInHandler();
              }}
            >
              {(form) => (
                <Form method="post" action="/api/auth/signin/email">
                  <input
                    type="hidden"
                    name="csrfToken"
                    defaultValue={csrfToken}
                  />
                  <LoginInput
                    type="text"
                    name="login_email"
                    icon="email"
                    placeholder="Correo electronico"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="login_password"
                    icon="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                  />
                  <CircledIconBtn type="submit" text="Iniciar sesión" />
                  {login_error && (
                    <span className={styles.error}>{login_error}</span>
                  )}
                  <div className={styles.forgot}>
                    <Link href="/auth/forgot" prefetch={true}>Olvidaste la contaseña ?</Link>
                  </div>
                </Form>
              )}
            </Formik>

            <div className={styles.login__socials}>
              <span className={styles.or}>O accede con:</span>
              <div className={styles.login__socials_wrap}>
                {providers &&
                  providers?.map((provider, i) => {
                    if (provider?.name == "Credentials") {
                      return;
                    }
                    return (
                      <div key={i}>
                        <button
                          className={styles.social__btn}
                          onClick={() => signIn(provider.id)}
                        >
                          <Image src={google} alt="" />
                          Acceder facil con {provider?.name}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <p style={{ marginTop: "40px", fontWeight: "bold" }}>
          Si no tienes cuenta en Saldomanía puedes crear una registrandote
        </p>
        <div className={styles.login__container}>
          <div className={styles.login__form}>
            <h1>Registrarme</h1>
            <p>Accede al marketplace de saldos mas grande del país</p>

            <Formik
              enableReinitialize
              initialValues={{
                name,
                email,
                password,
                conf_password,
              }}
              validationSchema={registerValidation}
              onSubmit={() => {
                signUpHandler();
              }}
            >
              {(form) => (
                <Form>
                  <LoginInput
                    type="text"
                    name="name"
                    icon="user"
                    placeholder="Nombre completo"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="text"
                    name="email"
                    icon="email"
                    placeholder="Correo electronico"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="password"
                    icon="password"
                    placeholder="Contraseña"
                    onChange={handleChange}
                  />
                  <LoginInput
                    type="password"
                    name="conf_password"
                    icon="password"
                    placeholder="Re-escribe contraseña"
                    onChange={handleChange}
                  />
                  <CircledIconBtn type="submit" text="Registrarme" />
                </Form>
              )}
            </Formik>
            <div>
              {success && <span className={styles.success}>{success}</span>}
            </div>
            <div>{error && <span className={styles.error}>{error}</span>}</div>
            <p style={{ marginTop: "40px" }}>
              Al ingresar a saldomanía aceptas nuestros{" "}
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

export async function getServerSideProps(context) {
  const { req, query } = context;

  const session = await getSession({ req });
  const { callbackUrl } = query;

  if (session) {
    return {
      redirect: {
        destination: callbackUrl,
      },
    };
  }
  const csrfToken = await getCsrfToken(context);

  return {
    props: {
      csrfToken: csrfToken,
      callbackUrl,
    },
  };
}
