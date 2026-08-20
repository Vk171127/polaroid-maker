interface OrderPayload {
  orderId: string;
  name: string;
  phoneNumber: string;
  printableSheetUrl: string;
}

export async function sendOrder(order: OrderPayload): Promise<void> {
  const imageBlob = await (await fetch(order.printableSheetUrl)).blob();

  const caption =
    `🖼️ New Polaroid Order\n\n` +
    `Order ID: ${order.orderId}\n` +
    `Name: ${order.name}\n` +
    `Phone: ${order.phoneNumber}`;

  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("document", imageBlob, `${order.orderId}.png`);

  const res = await fetch("/api/send-order", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to send order");
  }
}
