import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "Shipping & Returns — N.INIYAZHL" };

export default function ShippingReturnsPage() {
  return (
    <LegalLayout title="Shipping & Returns" updated="16 July 2026">
      <section>
        <h2>Shipping</h2>
        <ul>
          <li>We ship across India via trusted courier partners.</li>
          <li>Orders are dispatched within 1–2 business days of confirmation.</li>
          <li>Typical delivery time is 4–7 business days depending on your location.</li>
          <li>Shipping is free on every order, with no minimum order value.</li>
          <li>You&rsquo;ll be able to track your order status anytime from My Orders.</li>
        </ul>
      </section>

      <section>
        <h2>Cash on Delivery</h2>
        <p>
          Cash on Delivery is available on every order. Please keep the exact amount
          ready for our delivery partner, and inspect the package before accepting it
          where possible.
        </p>
      </section>

      <section>
        <h2>Returns &amp; Exchanges</h2>
        <p>
          We do not accept returns or exchanges. All sales are final once an order is
          placed — please review the product photos, description, fabric, and colour
          carefully before ordering. The only exception is a damaged or incorrect item,
          covered below.
        </p>
      </section>

      <section>
        <h2>Damaged or incorrect items</h2>
        <p>
          If your order arrives damaged or you receive the wrong item, contact us
          within 48 hours of delivery with photos of the product and packaging, and
          we&rsquo;ll arrange a replacement or full refund at no extra cost to you.
        </p>
      </section>
    </LegalLayout>
  );
}
