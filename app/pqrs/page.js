"use client";
import styles from "./styles.module.scss";
import React from "react";
import Header from "../../components/newcommerce/header";
import Footer from "../../components/footer";
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import SingularSelect from "../../components/selects/SingularSelect";
import AdminInput from "../../components/inputs/adminInput";
import axios from "axios";
import { GrStatusGood } from "react-icons/gr";
import Link from "next/link";

const initialState = {
  name: "",
  surnames: "",
  documentType: "",
  documentNumber: "",
  email: "",
  telephone: "",
  address: "",
  city: "",
  pqrsType: "",
  pqrsOrderNumber: "",
  pqrsText: "",
};

export default function PQRS() {
  const [pqrs, setPqrs] = useState(initialState);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { value, name } = e.target;
    setPqrs({ ...pqrs, [name]: value });
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Por favor añade un nombre")
      .min(3, "Nombre del producto debe contener entre 10 y 300 caracteres"),

    surnames: Yup.string()
      .required("Por favor añade un apellido")
      .min(3, "Nombre del producto debe contener entre 10 y 300 caracteres"),

    documentNumber: Yup.string().required(
      "Por favor agrega el numero del documento."
    ),
    documentType: Yup.string().required(
      "Por favor selecciona un tipo de documento."
    ),
    email: Yup.string().required("Por favor añade tu email"),

    telephone: Yup.string().required("Por favor agrega una telefono."),
    address: Yup.string().required("Por favor añade una dirección"),
    city: Yup.string().required("Por favor añade una ciudad"),
    pqrsType: Yup.string().required("Por favor añade un tipo"),
    pqrsOrderNumber: Yup.string().required(
      "Por favor añade una orden de compra"
    ),
    pqrsText: Yup.string()
      .required("Por favor añade el texto")
      .min(10, "Nombre del producto debe contener entre 10 y 300 caracteres"),
  });

  const pqrstype = [
    { name: "Petición" },
    { name: "Queja" },
    { name: "Reclamo" },
    { name: "Felicitación" },
    { name: "Eliminar cuenta" },
  ];

  const documenttype = [
    { name: "NIT" },
    { name: "Cedula de Ciudadanía" },
    { name: "Cedula de Extranjeria" },
    { name: "Pasaporte" },
  ];

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post("/api/pqrs", pqrs);
      setSuccessMessage("PQRS creado con éxito"); // Set success message
      setPqrs(initialState); // Reset form fields
    } catch (error) {
      console.error("Error submitting PQRS:", error);
      alert("Hubo un error al enviar el PQRS.");
    }
  };

  return (
    <div>
      <Header />
      <div className={styles.pqrs}>
        {successMessage ? (
          <>
            <div className={styles.success_all}>
              <div
                className={styles.success}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {successMessage} <GrStatusGood />
              </div>
            </div>
          </>
        ) : (
          <div className={styles.division}>
            <h2>Formulario Peticiones, quejas y reclamos</h2>

            <Formik
              enableReinitialize
              initialValues={{
                name: pqrs.name,
                surnames: pqrs.surnames,
                documentType: pqrs.documentType,
                documentNumber: pqrs.documentNumber,
                email: pqrs.email,
                telephone: pqrs.telephone,
                address: pqrs.address,
                city: pqrs.city,
                pqrsType: pqrs.pqrsType,
                pqrsOrderNumber: pqrs.pqrsOrderNumber,
                pqrsText: pqrs.pqrsText,
              }}
              validationSchema={validationSchema}
              onSubmit={() => handleSubmit()}
            >
              {(formik) => (
                <Form>
                  <div className={styles.header}>Datos Personales</div>
                  <AdminInput
                    type="text"
                    label="Nombre"
                    name="name"
                    placeholder="Nombre"
                    onChange={handleChange}
                  />
                  <AdminInput
                    type="text"
                    label="Apellidos"
                    name="surnames"
                    placeholder="Apellidos"
                    onChange={handleChange}
                  />
                  <SingularSelect
                    name="documentType"
                    value={pqrs.documentType}
                    placeholder="Tipo de documento"
                    data={documenttype}
                    handleChange={handleChange}
                  />
                  <AdminInput
                    type="text"
                    label="# Documento"
                    name="documentNumber"
                    placeholder="Número documento"
                    onChange={handleChange}
                  />
                  <AdminInput
                    type="text"
                    label="Email"
                    name="email"
                    placeholder="Ingresa email"
                    onChange={handleChange}
                  />
                  <AdminInput
                    type="text"
                    label="Telefono"
                    name="telephone"
                    placeholder="Ingresa # telefono"
                    onChange={handleChange}
                  />
                  <AdminInput
                    type="text"
                    label="Dirección"
                    name="address"
                    placeholder="Dirección"
                    onChange={handleChange}
                  />
                  <AdminInput
                    type="text"
                    label="Ciudad"
                    name="city"
                    placeholder="Ingresa ciudad"
                    onChange={handleChange}
                  />
                  <div className={styles.header}>Datos Solicitud</div>
                  <SingularSelect
                    name="pqrsType"
                    value={pqrs.pqrsType}
                    placeholder="Tipo de solicitud"
                    data={pqrstype}
                    header={"Tipo de Solicitud"}
                    handleChange={handleChange}
                  />
                  <AdminInput
                    type="text"
                    label="# Orden"
                    name="pqrsOrderNumber"
                    placeholder="Ingresa numero de orden"
                    onChange={handleChange}
                  />
                  <AdminInput
                    type="text"
                    label="Texto"
                    name="pqrsText"
                    placeholder="Texto pqrs"
                    onChange={handleChange}
                  />
                  <div>
                    Al hacer click en Crear PQRS, aceptas nuestros
                    <span style={{ color: "blue", cursor: "pointer" }}>
                      <Link href="/terms"> Términos y condiciones </Link>
                    </span>
                    y
                    <p style={{ color: "blue", cursor: "pointer" }}>
                      <Link href="/privacy">
                        Política de Privacidad y Tratamiento de Datos Personales
                      </Link>
                    </p>
                  </div>
                  <button
                    className={`${styles.btn} ${styles.btn__primary} ${styles.submit_btn}`}
                    type="submit"
                    style={{ width: "100%" }}
                  >
                    Crear PQRS
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
