import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.scss";
import { toggleSidebar } from "../../../../store/ExpandSlice";
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
import { FaThList } from "react-icons/fa";
import { BsPatchPlus } from "react-icons/bs";
import {
  RiCoupon3Fill,
  RiLogoutCircleFill,
  RiSettingsLine,
} from "react-icons/ri";
//-----------------------
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
export default function Sidebar() {
  const pathname = usePathname();
  const route = pathname.split("/admin/dashboard/")[1];
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const expandSidebar = useSelector((state) => state.expandSidebar);
  const expand = expandSidebar.expandSidebar;
  const handleExpand = () => {
    dispatch(toggleSidebar());
  };
  return (
    <div className={`${styles.sidebar} ${expand ? styles.opened : ""}`}>
      <div className={styles.sidebar__toggle} onClick={() => handleExpand()}>
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
            src={session?.user?.image}
            alt="Mongir Logo"
            loading="lazy"
          />
          <div className={styles.show}>
            <span>{session?.user?.name}</span>
          </div>
        </div>
        <ul className={styles.sidebar__list}>
          <li className={route === undefined ? styles.active : ""}>
            <Link href="/admin/dashboard" prefetch={true}>
              <MdSpaceDashboard />
              <span className={styles.show}>Dashboard</span>
            </Link>
          </li>
          <li className={route == "sales" ? styles.active : ""}>
            <Link href="/admin/dashboard/sales" prefetch={true}>
              <FcSalesPerformance />
              <span className={styles.show}>Sales</span>
            </Link>
          </li>
          <li className={route === "orders" ? styles.active : ""}>
            <Link href="/admin/dashboard/orders" prefetch={true}>
              <IoListCircleSharp />
              <span className={styles.show}>Orders</span>
            </Link>
          </li>
          <li className={route === "users" ? styles.active : ""}>
            <Link href="/admin/dashboard/users" prefetch={true}>
              <ImUsers />
              <span className={styles.show}>Users</span>
            </Link>
          </li>
          {/* <li className={route == "messages" ? styles.active : ""}>
            <Link href="/admin/dashboard/messages" prefetch={true}>
              <AiFillMessage />
              <span className={styles.show}>Messages</span>
            </Link>
          </li> */}
        </ul>
        <div className={styles.sidebar__dropdown}>
          <div className={styles.sidebar__dropdown_heading}>
            <div className={styles.show}>Product</div>
          </div>
          <ul className={styles.sidebar__list}>
            <li className={route == "product/all" ? styles.active : ""}>
              <Link href="/admin/dashboard/product/all" prefetch={true}>
                <FaThList />
                <span className={styles.show}>All Products</span>
              </Link>
            </li>
            <li className={route == "product/create" ? styles.active : ""}>
              <Link
                legacyBehavior
                href="/admin/dashboard/product/create"
                prefetch={true}
              >
                <a>
                  <BsPatchPlus />
                  <span className={styles.show}>Create Product</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.sidebar__dropdown}>
          <div className={styles.sidebar__dropdown_heading}>
            <div className={styles.show}>Categories / Subs</div>
          </div>
          <ul className={styles.sidebar__list}>
            <li className={route == "categories" ? styles.active : ""}>
              <Link
                legacyBehavior
                href="/admin/dashboard/categories"
                prefetch={true}
              >
                <a>
                  <MdOutlineCategory />
                  <span className={styles.show}>Categories</span>
                </a>
              </Link>
            </li>
            <li className={route == "subCategories" ? styles.active : ""}>
              <Link
                legacyBehavior
                href="/admin/dashboard/subCategories"
                prefetch={true}
              >
                <a>
                  <div style={{ transform: "rotate(180deg)" }}>
                    <MdOutlineCategory />
                  </div>
                  <span className={styles.show}>Sub-Categories</span>
                </a>
              </Link>
            </li>
            <li className={route == "subCategories" ? styles.active : ""}>
              <Link
                legacyBehavior
                href="/admin/dashboard/subCategories2"
                prefetch={true}
              >
                <a>
                  <div style={{ transform: "rotate(180deg)" }}>
                    <MdOutlineCategory />
                  </div>
                  <span className={styles.show}>Sub-Categories 2</span>
                </a>
              </Link>
            </li>
            <li className={route == "subCategories" ? styles.active : ""}>
              <Link
                legacyBehavior
                href="/admin/dashboard/subCategories3"
                prefetch={true}
              >
                <a>
                  <div style={{ transform: "rotate(180deg)" }}>
                    <MdOutlineCategory />
                  </div>
                  <span className={styles.show}>Sub-Categories 3</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.sidebar__dropdown}>
          <div className={styles.sidebar__dropdown_heading}>
            <div className={styles.show}>Coupons</div>
          </div>
          <ul className={styles.sidebar__list}>
            <li className={route == "coupons" ? styles.active : ""}>
              <Link
                legacyBehavior
                href="/admin/dashboard/coupons"
                prefetch={true}
              >
                <a>
                  <RiCoupon3Fill />
                  <span className={styles.show}>Coupons</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
        {/* <nav>
          <ul
            className={`${styles.sidebar__list} ${
              expand ? styles.nav_flex : ""
            }`}
          >
            <li>
              <Link legacyBehavior href="" prefetch={true}>
                <a>
                  <RiSettingsLine />
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="" prefetch={true}>
                <a>
                  <IoNotificationsSharp />
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="" prefetch={true}>
                <a>
                  <AiFillMessage />
                </a>
              </Link>
            </li>
            <li>
              <Link legacyBehavior href="" prefetch={true}>
                <a>
                  <RiLogoutCircleFill />
                </a>
              </Link>
            </li>
          </ul>
        </nav> */}
      </div>
    </div>
  );
}
