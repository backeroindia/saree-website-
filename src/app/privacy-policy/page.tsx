import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "Privacy Policy — N.INIYAZHL" };

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="16 July 2026">
      <section>
        <h2>1. Information we collect</h2>
        <p>
          When you create an account, place an order, or contact us, we collect the
          information you provide directly: your name, email address, phone number,
          shipping address, and order details. We do not collect or store payment card
          details — Cash on Delivery orders involve no online payment data, and any
          future online payments will be processed by a certified third-party payment
          gateway that never shares full card details with us.
        </p>
      </section>

      <section>
        <h2>2. How we use your information</h2>
        <ul>
          <li>To process, ship, and provide updates on your orders</li>
          <li>To respond to messages sent through our Contact Us form</li>
          <li>To maintain your account and order history</li>
          <li>To improve our products, photography, and site experience</li>
        </ul>
      </section>

      <section>
        <h2>3. How we store your information</h2>
        <p>
          Passwords are never stored in plain text — they are hashed before saving.
          Your session is authenticated using a signed token stored in a secure,
          HTTP-only cookie that cannot be read by scripts on the page.
        </p>
      </section>

      <section>
        <h2>4. Sharing of information</h2>
        <p>
          We do not sell or rent your personal information to third parties. Your
          shipping details are shared only with our logistics partners to the extent
          required to deliver your order.
        </p>
      </section>

      <section>
        <h2>5. Your rights</h2>
        <p>
          You can request a copy of the data we hold about you, ask us to correct it,
          or request account deletion at any time by writing to{" "}
          <a href="mailto:support@iniyazhl.shop" className="text-green underline">
            support@iniyazhl.shop
          </a>
          .
        </p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>
          We use a single essential cookie to keep you signed in. We do not use
          third-party advertising or tracking cookies.
        </p>
      </section>

      <section>
        <h2>7. Contact us</h2>
        <p>
          For any privacy-related questions, reach us via the{" "}
          <a href="/contact" className="text-green underline">
            Contact page
          </a>{" "}
          or email support@iniyazhl.shop.
        </p>
      </section>
    </LegalLayout>
  );
}
