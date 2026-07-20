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
          <li>Shipping is free on orders above ₹1,999; a flat ₹99 fee applies below that.</li>
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
        <h2>Returns</h2>
        <ul>
          <li>Returns are accepted within 7 days of delivery.</li>
          <li>The saree must be unused, unwashed, and returned with its original packaging and tags.</li>
          <li>To start a return, contact us with your order number via the Contact page.</li>
          <li>Sarees marked as final sale or altered/customised on request are not eligible for return.</li>
        </ul>
      </section>

      <section>
        <h2>Refunds</h2>
        <p>
          Once we receive and inspect the returned item, refunds for Cash on Delivery
          orders are issued via bank transfer within 5–7 business days. Shipping fees
          are non-refundable unless the return is due to a defect or an error on our
          part.
        </p>
      </section>

      <section>
        <h2>Exchanges</h2>
        <p>
          We currently do not offer direct exchanges. Please return the item for a
          refund and place a new order for the saree you&rsquo;d like instead.
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
