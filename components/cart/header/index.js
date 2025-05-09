import styles from "./styles.module.scss";
import Link from "next/link";
import { MdPlayArrow } from "react-icons/md";
import image from "../../../public/somos-el-hueco-medellin-logo-circulo.avif";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";
import Top from "./Top";
import Main from "./Main";
import Ad from "../../header/Ad";
export default function Header({ session }) {
  return (
    <header className={styles.header}>
      <Ad />
      <Top />
      <Main session={session} />
    </header>
  );
}
