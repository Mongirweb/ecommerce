// /app/newcommerce/page.tsx

"use client";
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { MdAddAPhoto } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation"; // App router's useRouter
import styles from "../styles.module.scss";
import { updateBusinessInfo } from "../../../requests/user"; // Adjust path based on app structure
import UpdateProfilePicture from "../../../components/newcommerce/updateProfilePicture";
import Header from "../../../components/newcommerce/header";
import { countries } from "../../../data/countries";
import { departaments } from "../../../data/departaments";
import Image from "next/image";
import { banks } from "../../../data/banks";
import { toast } from "react-toastify";

const initialState = {
  businessName: "",
  businessDescription: "",
  businessAddress: "",
  businessDevolutionAdress: "",
  businessState: "",
  businessCity: "",
  businessCountry: "",
  businessEmail: "",
  businessPhoneNumber: "",
  businessId: "",
  businessCategory: "",
  bussinesBank: "",
  bussinesBankAccountNumber: "",
  bussinesBankAccountType: "",
  acceptTerms: false,
  nameOfPersonInCharge: "",
};

export default function Onboard({ categories }) {
  const { data: session, update } = useSession(); // Using useSession hook
  const [loading, setLoading] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(initialState);
  const [image, setImage] = useState("");
  const [errors, setErrors] = useState({});
  const [profilePicture, setProfilePicture] = useState(session?.user?.image);
  const [user, setUser] = useState(session?.user);
  const [filteredDepartment, setFilteredDepartment] = useState([]);
  const refInput = useRef(null);
  const router = useRouter();

  useEffect(() => {
    setProfilePicture(session?.user?.image);
  }, [session]);

  useEffect(() => {
    setUser(session?.user);
  }, [session]);

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
      !businessInfo.nameOfPersonInCharge ||
      businessInfo.nameOfPersonInCharge.length < 3 ||
      businessInfo.nameOfPersonInCharge.length > 40
    ) {
      newErrors.nameOfPersonInCharge =
        "Porfavor agrega un nombre de persona encargada válido (3-40 caracteres)";
    }
    if (businessInfo.acceptTerms === false) {
      toast.error("Porfavor acepta los terminos y condiciones");
      return;
    }
    if (
      !businessInfo.businessDescription ||
      businessInfo.businessDescription.length < 20 ||
      businessInfo.businessDescription.length > 300
    ) {
      newErrors.businessDescription =
        "Porfavor agrega una descripción de empresa válida (20-300 caracteres)";
    }

    if (!businessInfo.businessAddress) {
      newErrors.businessAddress = "Porfavor agrega la dirección de la empresa";
    }
    if (!businessInfo.businessDevolutionAdress) {
      newErrors.businessDevolutionAdress =
        "Porfavor agrega la dirección de devolucion de productos";
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
    if (
      !businessInfo.businessId ||
      businessInfo.businessId.length < 9 ||
      businessInfo.businessId.length > 9
    ) {
      newErrors.businessId = "Porfavor agrega el NIT de la empresa 9 digitos";
    }
    // if (!businessInfo.businessCategory) {
    //   newErrors.businessCategory =
    //     "Porfavor elige una categoría para tu empresa";
    // }
    if (!businessInfo.bussinesBank) {
      newErrors.bussinesBank = "Porfavor selecciona el banco de la empresa";
    }
    if (!businessInfo.bussinesBankAccountType) {
      newErrors.bussinesBankAccountType =
        "Porfavor selecciona el tipo de cuenta";
    }
    if (!businessInfo.bussinesBankAccountNumber) {
      newErrors.bussinesBankAccountNumber =
        "Porfavor ingresa el numero de cuenta bancaria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setBusinessInfo({ ...businessInfo, [name]: value });

    // If country is selected, filter departments
    if (name === "businessState") {
      const selectedDepartment = departaments.filter(
        (dept) => dept.name === value
      );
      setFilteredDepartment(selectedDepartment);
    }
    if (name === "acceptTerms") {
      setBusinessInfo({ ...businessInfo, [name]: !businessInfo.acceptTerms });
    }
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
      console.log("error");
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
      <title>Somos el Hueco Medellín | NewCommerce</title>
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
                alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
                loading="lazy"
              />
              <div className={styles.onboard__picture_icon}>
                <MdAddAPhoto />
              </div>
            </div>
            <span>Selecciona la foto de la marca</span>
          </div>
          <form onSubmit={submitHandler}>
            <div className={styles.header}>
              <strong>Información Empresa</strong>
            </div>
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
                placeholder="Descripción de la empresa. ¿Qué productos o servicios ofrece su empresa?"
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

            <div className={styles.header}>
              <strong>Ubicación Bodega Envíos</strong>
            </div>

            <div>
              <select
                name="businessCountry"
                id=""
                value={businessInfo.businessCountry}
                onChange={handleChange}
                className={styles.inputBusiness}
              >
                <option value="">Selecciona país</option>
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.businessCountry && (
                <p className={styles.error}>{errors.businessCountry}</p>
              )}
            </div>
            <div>
              {/* <input
                type="text"
                name="businessState"
                value={businessInfo.businessState}
                placeholder="Departamento"
                onChange={handleChange}
                className={styles.inputBusiness}
              /> */}
              <select
                name="businessState"
                value={businessInfo.businessState}
                onChange={handleChange}
                className={styles.inputBusiness}
                disabled={!businessInfo.businessCountry}
              >
                <option value="">Selecciona Departamento</option>
                {departaments.map((dept) => (
                  <option key={dept.code} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.businessState && (
                <p className={styles.error}>{errors.businessState}</p>
              )}
            </div>
            <div>
              {/* <input
                type="text"
                name="businessCity"
                value={businessInfo.businessCity}
                placeholder="Ciudad"
                onChange={handleChange}
                className={styles.inputBusiness}
              /> */}
              <select
                disabled={!businessInfo.businessState}
                value={businessInfo.businessCity}
                name="businessCity"
                id=""
                onChange={handleChange}
                className={styles.inputBusiness}
              >
                <option value="">Selecciona ciudad</option>
                {filteredDepartment[0]?.cities?.map((city, i) => (
                  <option key={i} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.businessCity && (
                <p className={styles.error}>{errors.businessCity}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="businessAddress"
                value={businessInfo.businessAddress}
                placeholder="Dirección bodega envíos"
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
                name="businessDevolutionAdress"
                value={businessInfo.businessDevolutionAdress}
                placeholder="Dirección bodega devolución"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.businessDevolutionAdress && (
                <p className={styles.error}>
                  {errors.businessDevolutionAdress}
                </p>
              )}
            </div>

            <div className={styles.header}>
              <strong>Datos Responsable de la Cuenta</strong>
            </div>

            <div>
              <input
                type="text"
                name="nameOfPersonInCharge"
                value={businessInfo.nameOfPersonInCharge}
                placeholder="Nombre completo"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.nameOfPersonInCharge && (
                <p className={styles.error}>{errors.nameOfPersonInCharge}</p>
              )}
            </div>
            <p>A este correo llegarán notificación de venta, stock y otros.</p>
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
            {/* <div>
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

              
            </div> */}

            <div className={styles.header}>
              <strong>Datos Bancarios</strong>
            </div>

            <div>
              <select
                name="bussinesBank"
                value={businessInfo.bussinesBank}
                onChange={handleChange}
                className={styles.inputBusiness}
              >
                <option value="">Banco destino</option>
                {banks?.map((bank) => (
                  <option key={bank.name} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </select>
              {errors.bussinesBank && (
                <p className={styles.error}>{errors.bussinesBank}</p>
              )}
            </div>
            <div>
              <select
                name="bussinesBankAccountType"
                value={businessInfo.bussinesBankAccountType}
                onChange={handleChange}
                className={styles.inputBusiness}
              >
                <option value="">Tipo de cuenta bancaria</option>
                <option value="ahorros">Ahorros</option>
                <option value="corriente">Corriente</option>
              </select>
              {errors.bussinesBankAccountType && (
                <p className={styles.error}>{errors.bussinesBankAccountType}</p>
              )}
            </div>
            <div>
              <input
                type="number"
                name="bussinesBankAccountNumber"
                value={businessInfo.bussinesBankAccountNumber}
                placeholder="Número de cuenta"
                onChange={handleChange}
                className={styles.inputBusiness}
              />
              {errors.bussinesBankAccountNumber && (
                <p className={styles.error}>
                  {errors.bussinesBankAccountNumber}
                </p>
              )}
            </div>
            {/* <div>
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
            </div> */}

            <div className={styles.header}>
              <strong>Anexos</strong>
            </div>
            <div>
              <p>
                Favor enviar al correo{" "}
                <span style={{ color: "blue" }}>team@somoselhueco.com</span> los
                siguientes documentos:
              </p>{" "}
              <p>1. RUT.</p>
              <p>2. Camara de Comercio.</p>
              <p>3. Certificado Bancario.</p>{" "}
              <p>4. Copia documento identificación Representante Legal.</p>
            </div>
            {errors.form && <div className={styles.error}>{errors.form}</div>}

            <div className={styles.header}>
              <strong>Términos y condiciones</strong>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={businessInfo.acceptTerms}
                onChange={handleChange}
              />
              <label htmlFor="declaration" style={{ marginLeft: "8px" }}>
                Declaro que, al hacer clic en &quot;Registrar Empresa&quot;,
                acepto los términos y condiciones publicados en Saldomania.com.
                Asimismo, afirmo que cuento con la autorización de la empresa
                para realizar su registro en la plataforma y que dicha empresa
                cumple con todos los requisitos legales para operar en Colombia.
              </label>
            </div>

            <button
              className={`${styles.btn} ${styles.btn__primary} ${styles.submit_btn}`}
              type="submit"
              disabled={loading}
            >
              Registrar Empresa
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
