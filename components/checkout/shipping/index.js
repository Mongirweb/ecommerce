import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import "yup-phone";
import ShippingInput from "../../inputs/shippingInput";
import { departaments } from "../../../data/departaments";
import { countries } from "../../../data/countries";
import SingularSelect from "../../selects/SingularSelect";
import SingularShippingSelect from "../../selects/SingularShippingSelect";
import {
  changeActiveAddress,
  deleteAddress,
  saveAddress,
  // ⬇️ Import your new or existing update request here:
  updateAddress, // You need to create or import this
} from "../../../requests/user";
import { FaIdCard } from "react-icons/fa";
import { GiPhone } from "react-icons/gi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoMdArrowDropupCircle } from "react-icons/io";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { hideDialog, showDialog } from "../../../store/DialogSlice";
import { useRouter } from "next/navigation";
import { idTypes } from "../../../data/idTypes";
import { toast } from "react-toastify";

const initialValues = {
  firstName: "",
  lastName: "",
  idType: "",
  id: "",
  phoneNumber: "",
  state: "",
  city: "",
  zipCode: "",
  address1: "",
  address2: "",
  country: "",
};

export default function Shipping({ user, profile, addresses, setAddresses }) {
  const [shipping, setShipping] = useState(initialValues);
  const [visible, setVisible] = useState(addresses?.length ? false : true);
  const [cities, setCities] = useState([]);
  const [editAddressId, setEditAddressId] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  // ------------- VALIDATION SCHEMA -------------
  const validate = Yup.object({
    firstName: Yup.string()
      .required("El nombre es obligatorio.")
      .min(3, "El nombre debe tener al menos 3 caracteres.")
      .max(20, "El nombre debe tener menos de 20 caracteres."),
    lastName: Yup.string()
      .required("El apellido es obligatorio.")
      .min(3, "El apellido debe tener al menos 3 caracteres.")
      .max(20, "El apellido debe tener menos de 20 caracteres."),
    idType: Yup.string().required("Selecciona el tipo de identificación."),
    id: Yup.string()
      .required("Numero de identificacion es obligatorio.")
      .min(3, "El Numero de identificacion debe tener al menos 3 caracteres.")
      .max(
        20,
        "El Numero de identificacion debe tener menos de 20 caracteres."
      ),
    phoneNumber: Yup.string()
      .required("El número de teléfono es obligatorio.")
      .min(3, "El número de teléfono debe tener al menos 3 caracteres.")
      .max(30, "El número de teléfono debe tener menos de 30 caracteres."),
    state: Yup.string()
      .required("El nombre del departamento es obligatorio.")
      .min(2, "Debe contener entre 2 y 60 caracteres.")
      .max(60, "Debe contener entre 2 y 60 caracteres."),
    city: Yup.string()
      .required("El nombre de la ciudad es obligatorio.")
      .min(2, "Debe contener entre 2 y 60 caracteres.")
      .max(60, "Debe contener entre 2 y 60 caracteres."),
    // zipCode: Yup.string()
    //   .required("El código postal es obligatorio.")
    //   .min(2, "Debe contener entre 2 y 30 caracteres.")
    //   .max(30, "Debe contener entre 2 y 30 caracteres."),
    address1: Yup.string()
      .required("La dirección 1 es obligatoria.")
      .min(5, "Debe contener entre 5 y 100 caracteres.")
      .max(100, "Debe contener entre 5 y 100 caracteres."),
    country: Yup.string().required("El nombre del país es obligatorio."),
  });

  // ------------- HANDLERS -------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      // 'value' is the string "Colombia"
      // find the object so you can also store its code
      const found = countries.find((c) => c.name === value) || {};
      setShipping({
        ...shipping,
        country: found.name, // "Colombia"
        countryCode: found.code, // "CO" (if found)
      });
    } else if (name === "state") {
      // Store the entire state object and update cities accordingly
      const found = departaments.find((c) => c.name === value) || {};
      setShipping({ ...shipping, [name]: found.name, stateCode: found.code });
      setCities(found?.cities || []);
    } else if (name === "city") {
      // Similarly for city if needed
      const found = cities.find((c) => c.name === value) || {};
      setShipping({ ...shipping, [name]: found.name, cityCode: found.zipCode });
    } else {
      setShipping({ ...shipping, [name]: value });
    }
  };

  // Create new address
  const saveShippingHandler = async (resetForm) => {
    try {
      const res = await saveAddress(shipping);
      setAddresses(res.addresses);
      setVisible(false);
      setShipping(initialValues);
      resetForm();
      toast.success("Dirección creada con exito!");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // Update existing address
  const updateShippingHandler = async (resetForm) => {
    try {
      const res = await updateAddress(editAddressId, shipping);
      setAddresses(res.addresses);
      setVisible(false);
      setShipping(initialValues);
      setEditAddressId(null);
      resetForm();
      toast.success("Dirección modificada con exito!");
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  const changeActiveHandler = async (id) => {
    try {
      const activeAdress = addresses.find((a) => a.active === true);
      if (activeAdress?._id === id) {
        return;
      }
      const res = await changeActiveAddress(id);
      setAddresses(res.addresses);
      toast.success("Dirección elegida con exito!");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteHandler = async (id) => {
    dispatch(
      showDialog({
        header: "Confirmar eliminación",
        msgs: [
          {
            msg: (
              <div>
                <p>¿Estás seguro de que deseas eliminar esta dirección?</p>
                <p>
                  <strong>Esta acción no se puede deshacer.</strong>
                </p>
              </div>
            ),
            type: "warning",
          },
        ],
        actions: [
          {
            label: "Cancelar",
            onClick: () => dispatch(hideDialog()),
          },
          {
            label: "Eliminar",
            style: { backgroundColor: "red", color: "#fff" },
            onClick: async () => {
              try {
                const res = await deleteAddress(id);
                setAddresses(res.addresses);
                if (id === editAddressId) {
                  handleOpenCloseEdit();
                  setEditAddressId("");
                  setShipping(null); // Populate form with this address
                  // If form is hidden, show it
                }
                // Hide dialog and refresh
                dispatch(hideDialog());
                router.refresh();
              } catch (error) {
                console.error(error);
                dispatch(
                  showDialog({
                    header: "Error",
                    msgs: [
                      {
                        msg: `No se pudo eliminar el producto: ${error.message}`,
                        type: "error",
                      },
                    ],
                    actions: [
                      {
                        label: "Cerrar",
                        onClick: () => dispatch(hideDialog()),
                      },
                    ],
                  })
                );
              }
            },
          },
        ],
      })
    );
  };

  // Ensure at least one address is active
  useEffect(() => {
    if (addresses?.length === 1) {
      addresses.forEach((address) => {
        if (!address.active) {
          changeActiveHandler(address._id);
        }
      });
    }
  }, [addresses]);

  const handleOpenCloseEdit = (id) => {
    // If we do NOT have an edit address selected yet (we're in "add new" mode),
    // but the form is visible, we simply switch to editing the chosen address.
    if (!editAddressId && visible) {
      setEditAddressId(id);
      return;
    }

    // If we don't have an edit address selected and the form is hidden,
    // open the form & set editAddressId.
    if (!editAddressId && !visible) {
      setEditAddressId(id);
      setVisible(true);
      return;
    }

    // If we DO have an edit address selected, but it's different from 'id',
    // switch to the new address, keep the form open.
    if (editAddressId && editAddressId !== id) {
      setEditAddressId(id);
      setVisible(true);
      return;
    }

    // If we are editing the same address again,
    // toggle the form open/closed and reset editAddressId if closing.
    if (editAddressId === id) {
      setEditAddressId(null);
      setVisible(!visible);
    }
  };

  // ------------- RENDER -------------
  return (
    <div className={styles.shipping}>
      {!profile && (
        <div className={styles.header}>
          <h3>Tus Datos de Envío</h3>
        </div>
      )}

      <div className={styles.addresses}>
        {addresses?.map((address) => (
          <div style={{ position: "relative" }} key={address._id}>
            {/* Edit Icon */}
            <div
              className={styles.address__edit}
              onClick={() => {
                setShipping(address); // Populate the form with this address.

                // Also set the correct list of cities for this address's state:
                const selectedState = departaments.find(
                  (d) => d.name === address.state
                );
                setCities(selectedState ? selectedState.cities : []);

                // If form is hidden, show it
                handleOpenCloseEdit(address._id);
              }}
            >
              <FaRegEdit />
            </div>

            {/* Delete Icon */}
            <div
              className={styles.address__delete}
              onClick={() => deleteHandler(address._id)}
            >
              <AiOutlineDelete />
            </div>

            {/* Address Card */}
            <div
              className={`${styles.address} ${address.active && styles.active}`}
              onClick={() => changeActiveHandler(address._id)}
            >
              {/* <div className={styles.address__side}>
                <Image
                  width={300}
                  height={300}
                  src={profile ? user.image : user.image}
                  alt=""
                />
              </div> */}
              <div className={styles.address__col}>
                <span>
                  <FaIdCard />
                  {address.firstName?.toUpperCase() || "N/A"}{" "}
                  {address.lastName?.toUpperCase() || "N/A"}
                </span>
                <span>
                  <GiPhone />
                  {address.phoneNumber}
                </span>
              </div>
              <div className={styles.address__col}>
                <span>
                  <FaMapMarkerAlt />
                  {address.address1}
                </span>
                <span>{address.address2}</span>
                <span>
                  {address.city}, {address.state}, {address.country}
                </span>
                <span>{address.zipCode}</span>
              </div>
              <span
                className={`${styles.active__text} ${
                  address.active ? styles.visible : styles.hidden
                }`}
              >
                Dirección elegida
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Show/Hide Button */}
      <button
        className={styles.hide_show}
        onClick={() => {
          // If the form is currently visible, and user clicks "AGREGAR NUEVA DIRECCIÓN"
          // while editing, we want to switch to "new address" mode but keep the form open.
          if (visible && editAddressId) {
            setEditAddressId(null);
            setShipping(initialValues);
            // Keep form open:
            return;
          }

          // If the form is visible for "new address", close it
          // or if the form is closed, open it for new address.
          setEditAddressId(null);
          setShipping(initialValues);
          setVisible(!visible);
        }}
      >
        {visible ? (
          <span>
            CERRAR FORMULARIO {""}
            <IoMdArrowDropupCircle style={{ fontSize: "2rem", fill: "#222" }} />
          </span>
        ) : (
          <span>
            AGREGAR NUEVA DIRECCIÓN <AiOutlinePlus />
          </span>
        )}
      </button>

      {/* The Form (New or Edit) */}
      {visible && (
        <Formik
          enableReinitialize
          initialValues={shipping}
          validationSchema={validate}
          onSubmit={(values, { resetForm }) => {
            if (editAddressId) {
              // If we are editing an address
              updateShippingHandler(resetForm);
            } else {
              // If we are creating a new address
              saveShippingHandler(resetForm);
            }
          }}
        >
          {() => (
            <Form>
              {/* Country */}
              <SingularSelect
                name="country"
                value={shipping.country}
                placeholder="*Pais"
                handleChange={handleChange}
                data={countries}
              />

              {/* Departamento */}
              <SingularShippingSelect
                name="state"
                value={shipping.state}
                placeholder="*Departamento"
                handleChange={handleChange}
                data={departaments}
              />

              {/* Ciudad */}
              <SingularShippingSelect
                name="city"
                value={shipping.city}
                placeholder="*Ciudad"
                handleChange={handleChange}
                data={cities}
              />

              <div className={styles.col}>
                <ShippingInput
                  name="firstName"
                  placeholder="*Nombre"
                  onChange={handleChange}
                />
                <ShippingInput
                  name="lastName"
                  placeholder="*Apellido"
                  onChange={handleChange}
                />
              </div>
              {/* Ciudad */}
              <SingularShippingSelect
                name="idType"
                value={shipping.idType}
                placeholder="* Tipo de identificación"
                handleChange={handleChange}
                data={idTypes}
              />
              <ShippingInput
                name="id"
                placeholder="*Numero de Identificación"
                onChange={handleChange}
                type="number"
              />

              <ShippingInput
                name="phoneNumber"
                placeholder="*Numero de Telefono"
                onChange={handleChange}
                type="number"
              />
              {/* <ShippingInput
                name="zipCode"
                placeholder="*Codigo Postal/ZIP"
                onChange={handleChange}
              /> */}
              <ShippingInput
                name="address1"
                placeholder="Dirección ej: Calle 10 #10-10 Unidad Uva Torre 1 Apt 101"
                onChange={handleChange}
              />

              {/* Optional Address2 field
              <ShippingInput
                name="address2"
                placeholder="Complemento (Ej: Apto 101)"
                onChange={handleChange}
              /> */}

              <button type="submit">
                {editAddressId ? "Actualizar dirección" : "Guardar dirección"}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
