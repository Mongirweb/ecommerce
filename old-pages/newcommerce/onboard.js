import { getSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/newcommerce/header";
import styles from "./styles.module.scss";
import Image from "next/image";
import { MdAddAPhoto } from "react-icons/md";
import UpdateProfilePicture from "../../components/newcommerce/updateProfilePicture";
import { ClipLoader } from "react-spinners";
import { updateBusinessInfo } from "../../requests/user";
import Category from "../../models/Category";
import db from "../../utils/db";
import { useRouter } from "next/router";

const initialState = {
  businessName: "",
  businessDescription: "",
  employeeNumber: "",
  businessAddress: "",
  businessState: "",
  businessCity: "",
  businessCountry: "",
  businessEmail: "",
  businessPhoneNumber: "",
  businessId: "",
  businessCategory: "",
  businessStartDate: "",
};

export default function Onboard({ user, categories }) {
  const [loading, setLoading] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(initialState);
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});
  const [profilePicture, setProfilePicture] = useState(user.user.image);
  const refInput = useRef(null);
  const router = useRouter();

  const dates = [
    { name: "menos de 5 años" },
    { name: "entre 5 y 10 años" },
    { name: "mas de 10 años" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (
      !businessInfo.businessName ||
      businessInfo.businessName.length < 3 ||
      businessInfo.businessName.length > 40
    ) {
      newErrors.businessName =
        "Porfavor agrega un nombre de empresa válido (3-40 caracteres)";
    }
    if (
      !businessInfo.businessDescription ||
      businessInfo.businessDescription.length < 20 ||
      businessInfo.businessDescription.length > 300
    ) {
      newErrors.businessDescription =
        "Porfavor agrega una descripción de empresa válida (20-300 caracteres)";
    }
    if (!businessInfo.employeeNumber) {
      newErrors.employeeNumber = "Porfavor ingresa el número de empleados";
    }
    if (!businessInfo.businessAddress) {
      newErrors.businessAddress = "Porfavor agrega la dirección de la empresa";
    }
    if (!businessInfo.businessState) {
      newErrors.businessState =
        "Porfavor agrega el estado o departamento de la empresa";
    }
    if (!businessInfo.businessCity) {
      newErrors.businessCity = "Porfavor agrega la ciudad de la empresa";
    }
    if (!businessInfo.businessCountry) {
      newErrors.businessCountry = "Porfavor agrega el país de la empresa";
    }
    if (!businessInfo.businessEmail) {
      newErrors.businessEmail =
        "Porfavor agrega el correo electrónico de la empresa";
    }
    if (!businessInfo.businessPhoneNumber) {
      newErrors.businessPhoneNumber =
        "Porfavor agrega el número de contacto de la empresa";
    }
    if (!businessInfo.businessId) {
      newErrors.businessId = "Porfavor agrega el NIT de la empresa";
    }
    if (!businessInfo.businessCategory) {
      newErrors.businessCategory =
        "Porfavor elige una categoría para tu empresa";
    }
    if (!businessInfo.businessStartDate) {
      newErrors.businessStartDate =
        "Porfavor elige una opción para la fecha de apertura";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setBusinessInfo({ ...businessInfo, [name]: value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp"
    ) {
      setErrors({
        ...errors,
        image: "El formato del archivo no es soportado.",
      });
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      setErrors({
        ...errors,
        image: "El tamaño del archivo es demasiado grande",
      });
      return;
    }
    e.target.value = null;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setImage(event.target.result);
      setErrors({ ...errors, image: "" });
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const res = await updateBusinessInfo(businessInfo);
      if (res.message === "ok") {
        router.push("/business/dashboard");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrors({ ...errors, form: "Error al actualizar la información" });
    }
  };

  return (
    <div>
      <Head>
        <title> NewCommerce</title>
      </Head>
      <Header />
      {loading ? (
        <div className={styles.loadingContainer}>
          <h2>Actualizando Datos</h2>
          <ClipLoader loading={loading} color="green" size={50} />
        </div>
      ) : (
        <div className={styles.onboard}>
          <h1>Datos generales de la empresa</h1>
          <div className={styles.onboard__picture}>
            <div
              className={styles.onboard__picture_image}
              onClick={() => {
                refInput.current.click();
              }}
            >
              <input
                type="file"
                ref={refInput}
                hidden
                onChange={handleImage}
                accept="image/jpeg,image/png,image/webp,image/jfif,"
              />
              <Image
                width={400}
                height={400}
                src={profilePicture}
                alt="sladomania-business-picture"
              />
              <div className={styles.onboard__picture_icon}>
                <MdAddAPhoto />
              </div>
            </div>
            <span>Selecciona la foto de la marca</span>
          </div>
          <form onSubmit={submitHandler}>
            <div className={styles.header}>Información básica</div>
            <div>
              <input
                type="text"
                name="businessName"
                value={businessInfo.businessName}
                placeholder="Nombre de la empresa"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.businessName && (
                <p className={styles.error}>{errors.businessName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="businessDescription"
                value={businessInfo.businessDescription}
                placeholder="Descripción de la empresa"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.businessDescription && (
                <p className={styles.error}>{errors.businessDescription}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                name="businessId"
                value={businessInfo.businessId}
                placeholder="Número NIT sin dígito de verificación"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.businessId && (
                <p className={styles.error}>{errors.businessId}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="businessAddress"
                value={businessInfo.businessAddress}
                placeholder="Dirección de la empresa"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.businessAddress && (
                <p className={styles.error}>{errors.businessAddress}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="businessCountry"
                value={businessInfo.businessCountry}
                placeholder="País de la empresa"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.businessCountry && (
                <p className={styles.error}>{errors.businessCountry}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="businessState"
                value={businessInfo.businessState}
                placeholder="Departamento"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.businessState && (
                <p className={styles.error}>{errors.businessState}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="businessCity"
                value={businessInfo.businessCity}
                placeholder="Ciudad"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.businessCity && (
                <p className={styles.error}>{errors.businessCity}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                name="businessEmail"
                value={businessInfo.businessEmail}
                placeholder="Correo electrónico"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.businessEmail && (
                <p className={styles.error}>{errors.businessEmail}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                name="businessPhoneNumber"
                value={businessInfo.businessPhoneNumber}
                placeholder="Número de contacto"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.businessPhoneNumber && (
                <p className={styles.error}>{errors.businessPhoneNumber}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                name="employeeNumber"
                value={businessInfo.employeeNumber}
                placeholder="Número de empleados"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.employeeNumber && (
                <p className={styles.error}>{errors.employeeNumber}</p>
              )}
            </div>
            <div>
              <select
                name="businessCategory"
                value={businessInfo.businessCategory}
                onChange={handleChange}
                className={styles.inputBusiness}
              >
                <option value="">Selecciona la categoría economica</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.businessCategory && (
                <p className={styles.error}>{errors.businessCategory}</p>
              )}
            </div>
            <div>
              <select
                name="businessStartDate"
                value={businessInfo.businessStartDate}
                onChange={handleChange}
                className={styles.inputBusiness}
              >
                <option value="">Selecciona fecha de apertura</option>
                {dates.map((date, index) => (
                  <option key={index} value={date.name}>
                    {date.name}
                  </option>
                ))}
              </select>
              {errors.businessStartDate && (
                <p className={styles.error}>{errors.businessStartDate}</p>
              )}
            </div>
            {errors.form && <div className={styles.error}>{errors.form}</div>}
            <button
              className={`${styles.btn} ${styles.btn__primary} ${styles.submit_btn}`}
              type="submit"
              disabled={loading}
            >
              Finalizar
            </button>
          </form>
          {image && (
            <UpdateProfilePicture
              image={image}
              setImage={setImage}
              user={user}
              setProfilePicture={setProfilePicture}
            />
          )}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { req } = ctx;
  const session = await getSession({ req });

  db.connectDb();
  const categories = await Category.find().lean();
  db.disconnectDb();

  return {
    props: {
      user: {
        user: session?.user,
      },
      categories: JSON.parse(JSON.stringify(categories)),
    },
  };
}
