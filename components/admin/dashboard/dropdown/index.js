import { useState } from "react";
import styles from "./styles.module.scss";
import Link from "next/link";
//-----------------------
import {
  MdArrowForwardIos,
  MdOutlineCategory,
  MdSpaceDashboard,
} from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { IoListCircleSharp, IoNotificationsSharp } from "react-icons/io5";
import { ImUsers } from "react-icons/im";
import { AiFillMessage } from "react-icons/ai";
import { FaRegUserCircle, FaThList } from "react-icons/fa";
import { BsPatchPlus } from "react-icons/bs";
import {
  RiCoupon3Fill,
  RiLogoutCircleFill,
  RiSettingsLine,
} from "react-icons/ri";
import { VscHome } from "react-icons/vsc";
import { signOut } from "next-auth/react";
//-----------------------
export default function Dropdown({ userImage }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className={styles.dropdown}
      onMouseOver={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div className={styles.dropdown__toggle}>
        <img src={userImage} alt="Somos-el-hueco-medellin-compra-virtual-producto-online-en-linea-somoselhueco" />
      </div>
      <div
        className={`${styles.dropdown__content} ${show ? styles.active : ""}`}
      >
        <div className={styles.dropdown__content_icons}>
          <div className={styles.dropdown__content_icons_icon}>
            <Link href="/admin/dashboard" prefetch={true}>
              <MdSpaceDashboard />
            </Link>
          </div>
          <div className={styles.dropdown__content_icons_icon}>
            <Link href="/admin/dashboard/sales" prefetch={true}>
              <FcSalesPerformance />
            </Link>
          </div>
          <div className={styles.dropdown__content_icons_icon}>
            <Link href="/admin/dashboard/orders" prefetch={true}>
              <IoListCircleSharp />
            </Link>
          </div>
          <div className={styles.dropdown__content_icons_icon}>
            <Link href="/admin/dashboard/users" prefetch={true}>
              <ImUsers />
            </Link>
          </div>
          <div className={styles.dropdown__content_icons_icon}>
            <Link href="/admin/dashboard/messages" prefetch={true}>
              <AiFillMessage />
            </Link>
          </div>
          <div className={styles.dropdown__content_icons_icon}>
            <Link href="/admin/dashboard/product/all" prefetch={true}>
              <FaThList />
            </Link>
          </div>
          <div className={styles.dropdown__content_icons_icon}>
            <Link href="/admin/dashboard/product/create" prefetch={true}>
              <BsPatchPlus />
            </Link>
          </div>
          <div className={styles.dropdown__content_icons_icon}>
            <Link href="/admin/dashboard/categories" prefetch={true}>
              <MdOutlineCategory />
            </Link>
          </div>
          <div
            className={styles.dropdown__content_icons_icon}
            style={{ transform: "rotate(180deg)" }}
          >
            <Link href="/admin/dashboard/subCategories" prefetch={true}>
              <MdOutlineCategory />
            </Link>
          </div>
          <div className={styles.dropdown__content_icons_icon}>
            <Link href="/admin/dashboard/coupons" prefetch={true}>
              <RiCoupon3Fill />
            </Link>
          </div>
        </div>
        <div className={styles.dropdown__content_items}>
          <div className={styles.dropdown__content_items_item}>
            <Link href="/" prefetch={true}>
              <VscHome />
            </Link>
          </div>
          <div className={styles.dropdown__content_items_item}>
            <Link href="/" prefetch={true}>
              <FaRegUserCircle />
            </Link>
          </div>
          <div className={styles.dropdown__content_items_item}>
            <Link href="/" prefetch={true}>
              <IoNotificationsSharp />
            </Link>
          </div>
          <div className={styles.dropdown__content_items_item}>
            <Link href="/" prefetch={true}>
              <RiSettingsLine />
            </Link>
          </div>
        </div>
        <div className={styles.dropdown__logout}>
          <button onClick={() => signOut()}>Logout</button>
        </div>
      </div>
    </div>
  );
}
