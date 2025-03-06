import { getSession } from "next-auth/react";
import Head from "next/head";
import Header from "../../components/newcommerce/header";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { signIn } from "next-auth/react";
import LoginInput from "../../components/inputs/loginInput";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CircledIconBtn from "../../components/buttons/circledIconBtn";
import { changeUserRole } from "../../requests/user";
import { useRouter } from "next/router";

const initialvalues = {
  code: "",
};

export default function NewCommerce({ user }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passCode, setPassCode] = useState(initialvalues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // Check if the user is logged in and if the role is 'business'
    if (user) {
      setIsLoggedIn(true);

      // Redirect the user to the /onboard page if their role is 'business'
      if (user?.user?.role === "business" && user?.user?.employee) {
        router.push("/business/dashboard");
      } else if (user?.user?.role === "business") {
        router.push("/newcommerce/onboard");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [user, router]);

  const { code } = passCode;

  const handleSignIn = () => {
    signIn();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Correctly update the state
    setPassCode((prev) => ({ ...prev, [name]: value }));
  };

  const codeValidation = Yup.object({
    code: Yup.string().required("Ingresa el codigo de convenio."),
  });

  const convertToBussiness = async () => {
    setLoading(true);
    setError(""); // Reset the error state before making the request

    try {
      // Call the changeUserRole API with the code
      const res = await changeUserRole(passCode.code);
      // Assuming your response has a status property
      setLoading(false);
      if (res.status === 400) {
        setError("Codigo Invalido");
      } else {
        // If successful, redirect to the /onboard page
        router.push("newcommerce/onboard");
      }
    } catch (error) {
      console.error(error);
      setLoading(false); // Ensure loading is stopped in case of error
    }
  };

  // If user is not logged in, show login message
  if (!isLoggedIn) {
    return (
      <div>
        <Head>
          <title> NewCommerce</title>
        </Head>
        <Header />
        <div className={styles.newcommerce}>
          <div className={styles.newcommerce__welcome}>
            <p>
              Bienvenido a <span>SaldoManía</span> , nos encanta que seas
              parte!,
            </p>
          </div>
          <div className={styles.newcommerce__notlogedin}>
            <p>
              Para continuar porfavor{" "}
              <span onClick={() => handleSignIn()}>Inicia Sesión</span> o{" "}
              <span onClick={() => handleSignIn()}>Registrate</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in, show the input field
  return (
    <div>
      <Head>
        <title>NewCommerce</title>
      </Head>
      <Header />
      <div className={styles.newcommerce}>
        <div className={styles.newcommerce__welcome2}>
          <p>
            ¡Bienvenido a <span>Saldomanía</span>, nos encanta que seas parte!
            <br /> Por favor, ingresa el código de la invitación.
          </p>
        </div>
        <div>{error ? error : null}</div>
        <div className={styles.newcommerce__form}>
          <Formik
            enableReinitialize
            initialValues={{
              code,
            }}
            validationSchema={codeValidation}
            onSubmit={() => {
              convertToBussiness();
            }}
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
            Si no tienes código de convenio, haz clic <span>AQUÍ</span>. <br />{" "}
            ¡Te enviaremos uno!
          </p>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const session = await getSession({ req });
  return {
    props: { user: session },
  };
}
