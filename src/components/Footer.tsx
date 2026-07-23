import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gold/20 bg-green-dark text-ivory/80">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-5 lg:px-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <Image
              src="/brand/logo-circle.png"
              alt="N.INIYAZHL"
              width={44}
              height={44}
              className="h-10 w-10 shrink-0 rounded-full object-contain"
            />
            <span className="font-serif text-xl font-bold text-ivory">
              N.<span className="text-gold">INIYAZHL</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-ivory/60">
            Handloom and silk sarees, woven with tradition and delivered to your doorstep.
          </p>
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold">
              Get updates on new arrivals
            </p>
            <NewsletterForm />
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Shop
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop" className="transition-colors hover:text-ivory">All Sarees</Link></li>
            <li><Link href="/shop?category=cotton-sarees" className="transition-colors hover:text-ivory">Cotton Sarees</Link></li>
            <li><Link href="/shop?category=silk-cotton-sarees" className="transition-colors hover:text-ivory">Silk Cotton Sarees</Link></li>
            <li><Link href="/shop?category=printed-sarees" className="transition-colors hover:text-ivory">Printed Sarees</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Company
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="transition-colors hover:text-ivory">About Us</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-ivory">Contact Us</Link></li>
            <li><Link href="/faq" className="transition-colors hover:text-ivory">FAQs</Link></li>
            <li><Link href="/shipping-returns" className="transition-colors hover:text-ivory">Shipping &amp; Returns</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Account
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/account" className="transition-colors hover:text-ivory">My Orders</Link></li>
            <li><Link href="/cart" className="transition-colors hover:text-ivory">Cart</Link></li>
            <li><Link href="/login" className="transition-colors hover:text-ivory">Sign In</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Support
          </h3>
          <ul className="space-y-2 text-sm text-ivory/60">
            <li>Mon–Sat, 10am–7pm IST</li>
            <li>support@iniyazhl.shop</li>
            <li>+91 90000 00000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-ivory/50 sm:flex-row">
          <span>© {new Date().getFullYear()} N.INIYAZHL. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <Link href="/privacy-policy" className="transition-colors hover:text-ivory">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-ivory">Terms &amp; Conditions</Link>
            <Link href="/shipping-returns" className="transition-colors hover:text-ivory">Shipping &amp; Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
