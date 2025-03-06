import styles from "./main.module.scss";
import { newMenu } from "../../../data/home";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  GiLargeDress,
  GiClothes,
  Gi3dHammer,
  GiWatch,
  GiBallerinaShoes,
  GiHeadphones,
  GiHealthCapsule,
  GiSportMedal,
  GiBigDiamondRing,
} from "react-icons/gi";
import { MdOutlineSportsEsports, MdOutlineSmartToy } from "react-icons/md";
import {
  BiCameraMovie,
  BiGift,
  BiCategory,
  BiSolidOffer,
} from "react-icons/bi";
import {
  FaBaby,
  FaAddressBook,
  FaBoxOpen,
  FaHandsHelping,
} from "react-icons/fa";
import { HiMiniBuildingStorefront } from "react-icons/hi2";
import { BsFillBuildingsFill, BsPhoneVibrate } from "react-icons/bs";
import { MdEventAvailable } from "react-icons/md";
import { LiaIndustrySolid } from "react-icons/lia";
import { TiThMenu } from "react-icons/ti";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { useMediaQuery } from "react-responsive";

export default function Menu({ setOpenCategory }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width:730px)" });
  const router = useRouter();

  const toggleMenuVisibility = () => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <div className={styles.menu}>
      <a
        className={styles.menu__header}
        style={isMobile ? { borderRadius: "10px", background: "#fff" } : null}
        onClick={isMobile ? toggleMenuVisibility : undefined}
      >
        <div className={styles.menu__header_todo}>
          <BiCategory />
          <b>Todo</b>
        </div>
        {isMobile ? (
          menuVisible ? (
            <IoIosArrowDown />
          ) : (
            <IoIosArrowForward />
          )
        ) : null}
      </a>
      {(isMobile && menuVisible) || !isMobile ? (
        <div className={styles.menu__list}>
          {newMenu?.map((item, i) => (
            <li key={i}>
              <a
                onClick={() => {
                  if (item.name === "Categorias") {
                    setOpenCategory((prev) => !prev);
                  } else {
                    router.push("/browse"); // Redirect to /browse
                  }
                }}
              >
                {i === 0 ? (
                  <TiThMenu />
                ) : i === 1 ? (
                  <FaAddressBook />
                ) : i === 2 ? (
                  <FaBoxOpen />
                ) : i === 3 ? (
                  <BiSolidOffer />
                ) : i === 4 ? (
                  <FaHandsHelping />
                ) : i === 5 ? (
                  <HiMiniBuildingStorefront />
                ) : i === 6 ? (
                  <BsFillBuildingsFill />
                ) : i === 7 ? (
                  <MdEventAvailable />
                ) : i === 8 ? (
                  <LiaIndustrySolid />
                ) : i === 9 ? (
                  <FaBaby />
                ) : i === 10 ? (
                  <BiCameraMovie />
                ) : i === 11 ? (
                  <MdOutlineSportsEsports />
                ) : i === 12 ? (
                  <BsPhoneVibrate />
                ) : i === 13 ? (
                  <MdOutlineSmartToy />
                ) : i === 14 ? (
                  <BiGift />
                ) : i === 15 ? (
                  <Gi3dHammer />
                ) : (
                  ""
                )}
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </div>
      ) : null}
    </div>
  );
}
