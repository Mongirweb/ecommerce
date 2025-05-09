import { VerticalBenefitTicker } from "./VerticalBenefitTicker";
import dynamic from "next/dynamic";

const promos = [
  {
    id: "free-over",
    // icon: <LocalShippingIcon fontSize="small" />,
    title: "¿Por qué comprar en Mongir?",
    subtitle: "", // not shown in compact mode
  },
  {
    id: "free-over",
    // icon: <LocalShippingIcon fontSize="small" />,
    title: "💸 Ahorras a precios de El Hueco",
    subtitle: "", // not shown in compact mode
  },
  {
    id: "free-over",
    // icon: <ShoppingBagIcon fontSize="small" />,
    title: "🚚 Entrega en 1 a 3 días con rastreo en línea",
    subtitle: "",
  },
  {
    id: "free-over",
    // icon: <ShoppingBagIcon fontSize="small" />,
    title: "🛍️ ¡Variedad! Todo para tu bebé",
    subtitle: "",
  },
  {
    id: "free-over",
    // icon: <ShoppingBagIcon fontSize="small" />,
    title: "💬 Atención personalizada por WhatsApp",
    subtitle: "",
  },
  {
    id: "free-over",
    // icon: <ShoppingBagIcon fontSize="small" />,
    title: "💳 Pago seguro con Wompi de Bancolombia",
    subtitle: "",
  },
];

export default function ProductBenefits() {
  return (
    <VerticalBenefitTicker
      items={promos}
      interval={4000} // 4 seconds between slides
      className="max-w-[240px]" // optional width cap
    />
  );
}
