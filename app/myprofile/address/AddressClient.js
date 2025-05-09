"use client";
import React, { useState } from "react";
import Layout from "../../../components/profile/layout";
import Shipping from "../../../components/checkout/shipping";
import styles from "../../../styles/profile.module.scss";

export default function AddressClient({ session, tab, address }) {
  const [addresses, setAddresses] = useState(address.address);

  return (
    <Layout session={session} tab={tab}>
      <div className={styles.header}>
        <h1>Mis Direcciones</h1>
      </div>
      <Shipping
        user={session?.user}
        addresses={addresses}
        setAddresses={setAddresses}
        profile
      />
    </Layout>
  );
}
