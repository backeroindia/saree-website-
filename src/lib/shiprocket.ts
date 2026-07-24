const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

export function isShiprocketConfigured() {
  return Boolean(
    process.env.SHIPROCKET_EMAIL &&
      process.env.SHIPROCKET_PASSWORD &&
      process.env.SHIPROCKET_PICKUP_LOCATION
  );
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error(`Shiprocket auth failed: ${res.status}`);
  }

  const data = await res.json();
  if (!data.token) {
    throw new Error("Shiprocket auth did not return a token");
  }

  // Tokens are valid ~10 days; refresh a little early to be safe.
  cachedToken = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 };
  return cachedToken.token;
}

type ShipmentAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
};

type ShipmentItem = {
  name: string;
  price: number; // paise
  quantity: number;
};

export type CreateShipmentInput = {
  orderNumber: string;
  createdAt: Date;
  address: ShipmentAddress;
  items: ShipmentItem[];
  subtotal: number; // paise
  paymentMethod: "COD" | "RAZORPAY";
};

const DEFAULT_WEIGHT_KG = Number(process.env.SHIPROCKET_DEFAULT_WEIGHT_KG ?? 0.5);
const DEFAULT_LENGTH_CM = Number(process.env.SHIPROCKET_PACKAGE_LENGTH_CM ?? 30);
const DEFAULT_BREADTH_CM = Number(process.env.SHIPROCKET_PACKAGE_BREADTH_CM ?? 25);
const DEFAULT_HEIGHT_CM = Number(process.env.SHIPROCKET_PACKAGE_HEIGHT_CM ?? 5);

export async function createShiprocketShipment(input: CreateShipmentInput) {
  if (!isShiprocketConfigured()) {
    throw new Error(
      "Shiprocket is not configured — add SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD and SHIPROCKET_PICKUP_LOCATION to .env"
    );
  }

  const token = await getToken();
  const totalQuantity = input.items.reduce((sum, i) => sum + i.quantity, 0) || 1;

  const payload = {
    order_id: input.orderNumber,
    order_date: input.createdAt.toISOString().slice(0, 19).replace("T", " "),
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
    billing_customer_name: input.address.fullName,
    billing_last_name: "",
    billing_address: input.address.line1,
    billing_address_2: input.address.line2 ?? "",
    billing_city: input.address.city,
    billing_pincode: input.address.pincode,
    billing_state: input.address.state,
    billing_country: "India",
    billing_phone: input.address.phone,
    shipping_is_billing: true,
    order_items: input.items.map((item) => ({
      name: item.name,
      sku: item.name.slice(0, 50),
      units: item.quantity,
      selling_price: item.price / 100,
    })),
    payment_method: input.paymentMethod === "COD" ? "COD" : "Prepaid",
    sub_total: input.subtotal / 100,
    length: DEFAULT_LENGTH_CM,
    breadth: DEFAULT_BREADTH_CM,
    height: DEFAULT_HEIGHT_CM,
    weight: DEFAULT_WEIGHT_KG * totalQuantity,
  };

  const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status_code === 0 || data.status_code >= 400) {
    throw new Error(data.message ?? `Shiprocket order creation failed: ${res.status}`);
  }

  return {
    shiprocketOrderId: String(data.order_id ?? ""),
    shiprocketShipmentId: String(data.shipment_id ?? ""),
  };
}
