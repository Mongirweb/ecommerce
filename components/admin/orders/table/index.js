"use client";
import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import styles from "./styles.module.scss";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row._id}
        </TableCell>
        <TableCell component="th" scope="row">
          {new Date(row.createdAt).toLocaleDateString("en-CA")}{" "}
        </TableCell>
        <TableCell align="right">{row.paymentMethod}</TableCell>
        <TableCell align="right">
          {row.isPaid ? (
            <img
              src="../../../images/verified.png"
              alt="Mongir Logo"
              className={styles.ver}
            />
          ) : (
            <img
              src="../../../images/unverified.png"
              alt="Mongir Logo"
              className={styles.ver}
            />
          )}
        </TableCell>
        <TableCell align="right">
          <span
            className={
              row.status == "Not Processed"
                ? styles.not_processed
                : row.status == "Processing"
                ? styles.processing
                : row.status == "Dispatched"
                ? styles.dispatched
                : row.status == "Cancelled"
                ? styles.cancelled
                : row.status == "Completed"
                ? styles.completed
                : ""
            }
          >
            {row.status === "Processing"
              ? "En proceso de envío"
              : row.status === "Dispatched"
              ? "Enviado"
              : row.status === "Dispatched"
              ? "Entregado"
              : "Procesando"}
          </span>
        </TableCell>
        <TableCell align="right">{row.deliveryStatus || "-"}</TableCell>
        <TableCell align="right">
          <b>${row.total.toLocaleString("es-CO")}</b>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Orden para:
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Nombre completo</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Información de envío</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row?.user?.id}>
                    <TableCell component="th" scope="row">
                      <img
                        src={row?.user?.image}
                        className={styles.table__img}
                        alt="Mongir Logo"
                      />
                    </TableCell>
                    <TableCell>{row?.user?.name}</TableCell>
                    <TableCell align="left">{row?.user?.email}</TableCell>
                    <TableCell align="right">
                      {row.shippingAddress.firstName}{" "}
                      {row.shippingAddress.lastName} <br />
                      {row.shippingAddress.address1} <br />
                      {row.shippingAddress.address2} <br />
                      {row.shippingAddress.state},{row.shippingAddress.city}{" "}
                      <br />
                      {row.shippingAddress.country} <br />
                      {row.shippingAddress.zipCode} <br />
                      {row.shippingAddress.phoneNumber} <br />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Productos:
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Variante</TableCell>
                    <TableCell>Empresa</TableCell>
                    <TableCell>Talla</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((p, i) => {
                    const uid = p.uid; // <--- change here!
                    const parts = uid.split("_");
                    const subProdIndex = parseInt(parts[parts.length - 2], 10); // => 0

                    return (
                      <TableRow key={p._id}>
                        <TableCell component="th" scope="row">
                          <Link
                            href={`/business/dashboard/product/${p.product}?index=${subProdIndex}`}
                          >
                            <Image
                              src={p.image}
                              alt="Mongir Logo"
                              className={styles.table__productImg}
                              width={100}
                              height={100}
                            />
                          </Link>
                        </TableCell>
                        <TableCell>
                          {p.name} <br />
                        </TableCell>
                        <TableCell>{p.sku}</TableCell>
                        <TableCell>
                          {p.variant} <br />
                        </TableCell>
                        <TableCell>
                          {p.companyName} <br />
                        </TableCell>

                        <TableCell align="left">{p.size}</TableCell>
                        <TableCell align="left">x{p.qty}</TableCell>
                        <TableCell align="left">
                          ${p.price.toLocaleString("es-CO")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow key={row._id}>
                    <TableCell component="th" scope="row" align="left">
                      TOTAL
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell align="left"></TableCell>
                    <TableCell
                      align="left"
                      style={{ padding: "20px 0 20px 18px" }}
                    >
                      <b style={{ fontSize: "20px" }}>
                        ${row.total.toLocaleString("es-CO")}
                      </b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    order: PropTypes.number.isRequired,
    payment_method: PropTypes.string.isRequired,
    paid: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    coupon: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    user: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        shippingAddress: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default function CollapsibleTable({ rows }) {
  return (
    <TableContainer component={Paper}>
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        paddingX="5px"
        id="tableTitle"
        component="div"
      >
        Ordenes
      </Typography>
      <Table aria-label="collapsible table" className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell># Orden</TableCell>
            <TableCell align="right">Fecha</TableCell>
            <TableCell align="right">Metodo de Pago</TableCell>
            <TableCell align="right">Pago</TableCell>
            <TableCell align="right">Estado Orden</TableCell>
            <TableCell align="right">Estado Envío</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
