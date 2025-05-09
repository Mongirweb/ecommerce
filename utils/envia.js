export async function rateEnviaShipment(order) {
  try {
    const rate = await fetch(`api/envia/quote`, {
      method: "POST",
      body: order,
    });
    const data = await rate.json();
    return data;
  } catch (error) {
    console.error("Error rating Envia shipment:", error);
    throw error;
  }
}
