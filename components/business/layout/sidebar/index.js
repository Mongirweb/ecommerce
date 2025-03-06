import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";
import { toggleSidebar } from "../../../../store/ExpandSlice";
import { BsDatabaseAdd, BsPatchPlus } from "react-icons/bs";
import { BiMessageSquareAdd } from "react-icons/bi";
import { FaListUl } from "react-icons/fa6";
import {
  MdImageSearch,
  MdArrowForwardIos,
  MdOutlineCategory,
  MdSpaceDashboard,
} from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { IoListCircleSharp, IoNotificationsSharp } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import { AiFillMessage } from "react-icons/ai";
import { FaThList } from "react-icons/fa";
import {
  RiCoupon3Fill,
  RiLogoutCircleFill,
  RiSettingsLine,
} from "react-icons/ri";
import { useSession } from "next-auth/react";
import { FaShopify } from "react-icons/fa";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const route = pathname.split("/business/dashboard/")[1];
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const expandSidebar = useSelector((state) => state.expandSidebar);
  const expand = expandSidebar.expandSidebar;

  const handleExpand = () => {
    dispatch(toggleSidebar());
  };

  const handleNavigation = (url) => {
    router.push(url);
  };

  return (
    <div className={`${styles.sidebar} ${expand ? styles.opened : ""}`}>
      <div className={styles.sidebar__toggle} onClick={handleExpand}>
        <div
          style={{
            transform: `${expand ? "rotate(180deg)" : ""}`,
            transition: "all .2s",
          }}
        >
          <MdArrowForwardIos />
        </div>
      </div>
      <div className={styles.sidebar__container}>
        <div className={styles.sidebar__user}>
          <Image
            width={300}
            height={200}
            src={session?.user?.image || "/default-image.png"} // Provide a default image if undefined
            alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco"
            className={styles.userImage}
            loading="lazy"
          />
          <div className={styles.show}>
            <span>Bienvenido 👋</span>
            <span>{session?.user?.name}</span>
          </div>
        </div>
        <div
          className={styles.sidebar__dropdown_heading}
          style={{ width: "100%" }}
        >
          <div className={styles.show}>Ventas</div>
        </div>
        <ul className={styles.sidebar__list}>
          <li
            className={route === undefined ? styles.active : ""}
            onClick={() => handleNavigation("/business/dashboard")}
          >
            <MdSpaceDashboard />
            <span className={styles.show}>Tablero Ventas</span>
          </li>
          <li
            onClick={() => handleNavigation("/business/dashboard/sales")}
            className={route === "sales" ? styles.active : ""}
          >
            <FcSalesPerformance />
            <span className={styles.show}>Ventas</span>
          </li>
          {/* <li
            onClick={() => handleNavigation("/business/dashboard/orders")}
            className={route === "orders" ? styles.active : ""}
          >
            <IoListCircleSharp />
            <span className={styles.show}>Pedidos</span>
          </li> */}
          {/* Uncomment and fix these if needed */}
          {/* <li className={route === "users" ? styles.active : ""}>
            <Link href="/admin/dashboard/users">
              <ImUsers />
              <span className={styles.show}>Users</span>
            </Link>
          </li>
          <li className={route === "messages" ? styles.active : ""}>
            <Link href="/admin/dashboard/messages">
              <AiFillMessage />
              <span className={styles.show}>Messages</span>
            </Link>
          </li> */}
        </ul>
        <div className={styles.sidebar__dropdown}>
          <div className={styles.sidebar__dropdown_heading}>
            <div className={styles.show}>Producto</div>
          </div>
          <ul className={styles.sidebar__list}>
            <li
              onClick={() =>
                handleNavigation("/business/dashboard/product/all")
              }
              className={route === "product/all" ? styles.active : ""}
            >
              <FaListUl />
              <span className={styles.show}>Mis Productos</span>
            </li>
            <li
              onClick={() =>
                handleNavigation("/business/dashboard/product/create")
              }
              className={route === "product/create" ? styles.active : ""}
            >
              <BiMessageSquareAdd />
              <span className={styles.show}>Crear Producto (Singular)</span>
            </li>
            {/* <li
              onClick={() =>
                handleNavigation("/business/dashboard/product/shopify")
              }
              className={route === "product/shopify" ? styles.active : ""}
            >
              <FaShopify />
              <span className={styles.show}>Traer de Shopify</span>
            </li> */}
            {/* <li className={route === "product/uploadbulk" ? styles.active : ""}>
              <Link href="">
                <BsDatabaseAdd style={{ fill: "gray" }} />
                <span className={styles.show} style={{ color: "gray" }}>
                  Carga masiva de productos
                </span>
              </Link>
            </li>
            <li className={route === "product/imageurl" ? styles.active : ""}>
              <Link href="">
                <MdImageSearch style={{ fill: "gray" }} />
                <span className={styles.show} style={{ color: "gray" }}>
                  Obtener URL de las imagenes
                </span>
              </Link>
            </li> */}
          </ul>
        </div>
        {/* Other dropdowns are commented out */}
        {/* <div className={styles.sidebar__dropdown}>...</div> */}
        {/* <nav>...</nav> */}
      </div>
    </div>
  );
}
