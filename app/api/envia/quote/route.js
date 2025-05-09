import { NextResponse } from "next/server";

export async function POST(req) {
  const maxRetries = 1;
  let attempt = 0;
  let lastError = null;
  const body = await req.json();

  const { email } = body;
  const { shippingAddress } = body;
  const {
    firstName,
    lastName,
    address1,
    address2,
    phoneNumber,
    countryCode,
    cityCode,
    stateCode,
    id,
  } = shippingAddress;

  // Build your base data for rate requests
  const baseRequestData = {
    origin: {
      number: "",
      postalCode: "05001000",
      type: "origin",
      street: "calle 46 # 52-26",
      state: "AN",
      city: "05001000",
      name: "Somos El Hueco",
      company: "Somos El Hueco",
      email: "somoselhueco@gmail.com",
      phone: "3136260281",
      country: "CO",
    },
    destination: {
      number: "",
      postalCode: `${cityCode}000`,
      type: "destination",
      street: address1 + " " + address2,
      state: stateCode,
      city: `${cityCode}000`,
      name: firstName + " " + lastName,
      company: "",
      email: email,
      phone: phoneNumber,
      country: countryCode,
      identificationNumber: id,
    },
    packages: [
      {
        type: "box",
        content: "productos varios",
        amount: 1,
        name: "productos varios",
        declaredValue: 0,
        lengthUnit: "CM",
        weightUnit: "KG",
        weight: 2,
        dimensions: { length: 20, width: 20, height: 12 },
      },
    ],
    settings: {
      currency: "COP",
      printFormat: "PDF",
      printSize: "STOCK_4X6",
      labelFormat: "PDF",
    },
  };

  // Potential carriers/services to compare
  const shipmentOptions = [
    {
      carrier: "interRapidisimo",
      service: "ground_small",
      reversePickup: 0,
      type: 1,
      import: 0,
    },
    {
      carrier: "coordinadora",
      service: "ground",
      reversePickup: 0,
      type: 1,
      import: 0,
    },
    {
      carrier: "deprisa",
      service: "estandar",
      type: 1,
    },
  ];

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "Bearer 484ceda30618e19518256d1065f88909c2941f50c13f8459e77f1e60fca7a85d"
  );

  const rateUrl = "https://api.envia.com/ship/rate";
  const genRateUrl = "https://api.envia.com/ship/generate";

  while (attempt <= maxRetries) {
    try {
      // 1) Fetch rates for each carrier/service
      const ratePromises = shipmentOptions.map(async (shipment) => {
        const bodyPayload = {
          ...baseRequestData,
          shipment,
        };

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify(bodyPayload),
          redirect: "follow",
        };

        const response = await fetch(rateUrl, requestOptions);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Envia API error: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        return {
          shipment,
          rateResponse: data,
        };
      });

      const allRates = await Promise.all(ratePromises);

      // 2) Find cheapest option
      let cheapestOption = null;
      let minPrice = Infinity;

      for (const { shipment, rateResponse } of allRates) {
        const { data } = rateResponse || {};
        if (Array.isArray(data) && data.length > 0) {
          const optionPrice = data[0].totalPrice;
          if (optionPrice < minPrice) {
            minPrice = optionPrice;
            cheapestOption = {
              shipment,
              rateDetail: data[0], // includes totalPrice, etc.
            };
          }
        }
      }

      if (!cheapestOption) {
        throw new Error("No valid rates returned from the API.");
      }

      // 3) Once we have the cheapest option, make the "genrate" call
      const genRatePayload = {
        ...baseRequestData,
        shipment: cheapestOption.shipment,
        // The "rate" field typically references the chosen rate
        // from the rate response. Adjust if Envia's docs require something else.
      };

      const genRateOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(genRatePayload),
        redirect: "follow",
      };

      const genResponse = await fetch(genRateUrl, genRateOptions);
      if (!genResponse.ok) {
        const errorText = await genResponse.text();
        throw new Error(
          `Envia GENRATE error: ${genResponse.status} ${errorText}`
        );
      }

      // This data typically includes label URLs, tracking numbers, etc.
      const genData = await genResponse.json();

      return NextResponse.json({
        message: "Cheapest rate and genrate call successful",
        carrier: cheapestOption.shipment.carrier,
        service: cheapestOption.shipment.service,
        price: cheapestOption.rateDetail.totalPrice,
        rateDetail: cheapestOption.rateDetail,
        info: cheapestOption.shipment,
        email,
        genrateResponse: genData, // Contains the label info, tracking, etc.
      });
    } catch (error) {
      lastError = error;
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt > maxRetries) {
        break;
      }
      // Optional short delay before retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // If we've exhausted retries:
  console.error("Error fetching Envia rates or generating label:", lastError);
  return NextResponse.json(
    {
      error: "Failed to get rates and generate label",
      details: lastError?.message,
    },
    { status: 500 }
  );
}
