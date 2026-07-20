import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "Terms & Conditions — N.INIYAZHL" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updated="16 July 2026">
      <section>
        <h2>1. About these terms</h2>
        <p>
          These terms govern your use of the N.INIYAZHL website and any purchase made
          through it. By placing an order, you agree to these terms.
        </p>
      </section>

      <section>
        <h2>2. Accounts</h2>
        <p>
          You must provide accurate information when creating an account and are
          responsible for keeping your login credentials confidential. We reserve the
          right to suspend accounts used for fraudulent activity.
        </p>
      </section>

      <section>
        <h2>3. Product listings and pricing</h2>
        <p>
          We make every effort to display product colours and details accurately.
          Slight variation is possible due to handloom weaving and screen display
          differences. Prices are listed in Indian Rupees (₹) and are inclusive of
          applicable taxes unless stated otherwise. We reserve the right to correct
          pricing errors before an order is confirmed.
        </p>
      </section>

      <section>
        <h2>4. Orders and payment</h2>
        <p>
          Orders are confirmed once placed successfully at checkout. Cash on Delivery
          is currently the only supported payment method; the order amount is
          collected at the time of delivery. We reserve the right to cancel orders
          that fail stock or address verification.
        </p>
      </section>

      <section>
        <h2>5. Shipping</h2>
        <p>
          Estimated delivery timelines are provided on our{" "}
          <a href="/shipping-returns" className="text-green underline">
            Shipping &amp; Returns
          </a>{" "}
          page. Delays due to courier or logistics disruptions are outside our
          control, though we will keep you informed.
        </p>
      </section>

      <section>
        <h2>6. Returns and cancellations</h2>
        <p>
          Please refer to our{" "}
          <a href="/shipping-returns" className="text-green underline">
            Shipping &amp; Returns
          </a>{" "}
          page for the full return and cancellation policy.
        </p>
      </section>

      <section>
        <h2>7. Intellectual property</h2>
        <p>
          All product photography, text, and branding on this site belong to
          N.INIYAZHL and may not be reused without permission.
        </p>
      </section>

      <section>
        <h2>8. Limitation of liability</h2>
        <p>
          N.INIYAZHL is not liable for indirect or incidental damages arising from
          the use of this site or delays beyond our reasonable control.
        </p>
      </section>

      <section>
        <h2>9. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the site
          after changes are posted constitutes acceptance of the updated terms.
        </p>
      </section>
    </LegalLayout>
  );
}
