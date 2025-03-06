export const sidebarData = [
  {
    heading: "Mi cuenta",
    links: [
      {
        name: "Mi Perfil",
        link: "/myprofile/profile",
      },
      {
        name: "Mis direcciones",
        link: "/myprofile/address",
      },
      // {
      //   name: "Metodos de Pago",
      //   link: "/myprofile/payment",
      // },
      {
        name: "Seguridad de la cuenta",
        link: "/myprofile/security",
      },
    ],
  },
  {
    heading: "Mis Pedidos",
    links: [
      {
        name: "Todas las ordenes",
        link: "/myprofile/orders",
        filter: "",
      },
      // {
      //   name: "Ordenes pagadas",
      //   link: "/myprofile/orders",
      //   filter: "paid",
      // },
      // {
      //   name: "Ordenes sin pagar",
      //   link: "/myprofile/orders",
      //   filter: "unpaid",
      // },
      // {
      //   name: "Ordenes en proceso",
      //   link: "/myprofile/orders",
      //   filter: "Processing",
      // },
      // {
      //   name: "Ordenes sin procesar",
      //   link: "/myprofile/orders",
      //   filter: "Not Processed",
      // },
      // {
      //   name: "Ordenes envíadas",
      //   link: "/myprofile/orders",
      //   filter: "Dispatched",
      // },
      // {
      //   name: "Ordenes entregadas",
      //   link: "/myprofile/orders",
      //   filter: "Completed",
      // },
      // {
      //   name: "Ordenes canceladas",
      //   link: "/myprofile/orders",
      //   filter: "Cancelled",
      // },
    ],
  },
  // {
  //   heading: "Mis listas",
  //   links: [
  //     {
  //       name: "Me gusta",
  //       link: "/myprofile/wishlist",
  //     },
  //     // {
  //     //   name: "Recently Viewed",
  //     //   link: "/myprofile/recent",
  //     // },
  //   ],
  // },
  // {
  //   heading: "Customer Service",
  //   links: [
  //     {
  //       name: "My Message",
  //       link: "/myprofile/messages",
  //     },
  //     {
  //       name: "Service Records",
  //       link: "/myprofile/services",
  //     },
  //   ],
  // },
  // {
  //   heading: "Other Services",
  //   links: [
  //     {
  //       name: "Survey Center",
  //       link: "",
  //     },
  //     {
  //       name: "Contact Preferences",
  //       link: "",
  //     },
  //   ],
  // },
  // {
  //   heading: "Policy",
  //   links: [
  //     {
  //       name: "Shipping Info",
  //       link: "",
  //     },
  //     {
  //       name: "Return Policy",
  //       link: "",
  //     },
  //     {
  //       name: "Privacy & Cookie Policy",
  //       link: "",
  //     },
  //   ],
  // },
  // {
  //   heading: "Sign out",
  //   link: [],
  // },
];

export const ordersLinks = [
  {
    name: "All Orders",
    filter: "",
  },
  {
    name: "Paid Orders",
    filter: "paid",
  },
  {
    name: "Unpaid Orders",
    filter: "unpaid",
  },
  {
    name: "Processing Orders",
    filter: "Processing",
  },
  {
    name: "Unprocessed Orders",
    filter: "Not Processed",
  },
  {
    name: "Dispatched Orders",
    filter: "Dispatched",
  },
  {
    name: "Delievered Orders",
    filter: "Delievered",
  },
  {
    name: "Cancelled Orders",
    filter: "Cancelled",
  },
];
