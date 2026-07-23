import { Resend } from "resend";
import { formatINR } from "@/lib/money";

const FROM_ADDRESS = "N.INIYAZHL <orders@iniyazhl.shop>";

function getClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

async function send(to: string, subject: string, html: string) {
  const client = getClient();
  if (!client) {
    console.log(`[email] RESEND_API_KEY not set — skipping send. To: ${to}, Subject: ${subject}`);
    return;
  }
  try {
    await client.emails.send({ from: FROM_ADDRESS, to, subject, html });
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}

const wrapper = (body: string) => `
  <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #211e1a;">
    <div style="background: #123c2e; padding: 24px; text-align: center;">
      <span style="color: #fbf8f2; font-size: 22px; font-weight: bold;">N.<span style="color:#b8894a">INIYAZHL</span></span>
    </div>
    <div style="padding: 24px; background: #fbf8f2;">${body}</div>
    <div style="padding: 16px; text-align: center; font-size: 12px; color: #999;">
      Handloom &amp; Silk Sarees &middot; n.niyazhl@gmail.com
    </div>
  </div>
`;

export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  orderId: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: "COD" | "RAZORPAY";
}) {
  const itemRows = params.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0;">${i.name} &times; ${i.quantity}</td><td style="padding:6px 0; text-align:right;">${formatINR(i.price * i.quantity)}</td></tr>`
    )
    .join("");

  const html = wrapper(`
    <h2 style="color:#123c2e;">Thank you for your order, ${params.customerName}!</h2>
    <p>Your order <strong>#${params.orderNumber}</strong> has been placed successfully.</p>
    <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
      ${itemRows}
      <tr><td style="padding-top:10px; border-top:1px solid #ddd;">Subtotal</td><td style="padding-top:10px; border-top:1px solid #ddd; text-align:right;">${formatINR(params.subtotal)}</td></tr>
      ${params.discount > 0 ? `<tr><td>Discount</td><td style="text-align:right;">-${formatINR(params.discount)}</td></tr>` : ""}
      <tr><td>Shipping</td><td style="text-align:right;">${params.shipping === 0 ? "Free" : formatINR(params.shipping)}</td></tr>
      <tr><td style="font-weight:bold; padding-top:6px;">Total</td><td style="font-weight:bold; padding-top:6px; text-align:right;">${formatINR(params.total)}</td></tr>
    </table>
    <p style="margin-top:16px;">Payment method: ${params.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"}</p>
    <p style="margin-top:24px;">
      <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/order/${params.orderId}"
         style="background:#d9b872; color:#0a2820; padding:10px 20px; border-radius:999px; text-decoration:none; font-weight:600;">
        View Order
      </a>
    </p>
  `);

  await send(params.to, `Order Confirmed — #${params.orderNumber}`, html);
}

export async function sendPasswordResetEmail(params: { to: string; name: string; resetUrl: string }) {
  const html = wrapper(`
    <h2 style="color:#123c2e;">Reset your password</h2>
    <p>Hi ${params.name}, we received a request to reset your N.INIYAZHL account password.</p>
    <p style="margin-top:16px;">
      <a href="${params.resetUrl}"
         style="background:#d9b872; color:#0a2820; padding:10px 20px; border-radius:999px; text-decoration:none; font-weight:600;">
        Reset Password
      </a>
    </p>
    <p style="margin-top:16px; font-size: 13px; color: #666;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
  `);

  await send(params.to, "Reset your N.INIYAZHL password", html);
}
