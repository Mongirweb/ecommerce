import Link from "next/link";
import { useState } from "react";
import styles from "./footer.module.scss";
import axios from "axios";

export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const subscribe = async () => {
    setSuccess("");
    setError("");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/newsletter", { email });
      setSuccess(data.message);
      setLoading(false);
      setEmail("");
    } catch (error) {
      setSuccess("");
      setLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <div className={styles.footer__newsletter}>
      <h3>Suscríbete y no te pierdas ninguna promoción</h3>
      <div className={styles.footer__flex}>
        <input
          type="text"
          placeholder="Escribe tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className={styles.btn_primary}
          disabled={loading}
          style={{ cursor: loading ? "not-allowed" : "" }}
          onClick={subscribe}
        >
          SUBSCRIBIRME
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <p>
        Al hacer clic en el botón SUBSCRIBIRME, aceptas los{" "}
        <Link href="/terms" prefetch={true}>
          Términos y condiciones
        </Link>
      </p>
    </div>
  );
}
