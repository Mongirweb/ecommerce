import styles from "./header.module.scss";
import dynamic from "next/dynamic";

const Ad = dynamic(() => import("./Ad"), {
  ssr: true,
});

const Main = dynamic(() => import("./Main"), { ssr: true });

const Top = dynamic(() => import("./Top"), {
  ssr: true,
});

export default function Header({ country, searchHandler, searchParams }) {
  return (
    <header className={styles.header}>
      <Ad />
      <Top country={country} />
      <Main searchHandler={searchHandler} searchParams={searchParams} />
    </header>
  );
}
