// app/(pages)/myprofile/ProfileClient.js

import React from "react";
import Layout from "../../../components/profile/layout";
import styles from "../../../styles/profile.module.scss";
import Head from "next/head";

export default function ProfileClient({ session, tab, provider, hasPassword }) {
  return (
    <Layout session={session} tab={tab}>
      <Head>
        <title>Mi Perfil - Mongir</title>
      </Head>
      <div className={styles.header}>
        <h1>Mi Perfil</h1>
      </div>

      <div className={styles.profileInfo}>
        <div className={styles.profileInfoItem}>
          <p>Nombre de usuario:</p>
          <span>{session?.name}</span>
        </div>
        <div className={styles.profileInfoItem}>
          <p>Correo electrónico asociado a la cuenta:</p>
          <span>{session?.email}</span>
        </div>
        <div className={styles.profileInfoItem}>
          <p>Inicio de sesión con terceros:</p>
          {/* If provider === 'google', show "Google", else "Correo / Contraseña" */}
          {provider === "google" && !hasPassword ? (
            <span>Creado con Google</span>
          ) : provider === "google" && hasPassword ? (
            <span>Creado con Google y tiene asignado una contraseña</span>
          ) : (
            <span>Creado con Correo/Contraseña</span>
          )}
        </div>
      </div>
    </Layout>
  );
}
