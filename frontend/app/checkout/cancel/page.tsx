import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="mat-shell grid min-h-screen place-items-center px-5 py-12">
      <main id="main" className="status-panel max-w-2xl p-6 sm:p-10">
        <p className="badge mono-type">CANCEL STATE</p>
        <h1 className="display-type mt-6 text-5xl leading-none tracking-[-0.04em] sm:text-6xl">
          Nothing got stuck to the wrong surface.
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--soft-ink)]">
          Checkout was canceled, so the customer should land somewhere
          reassuring: their cart is preserved, no payment was captured, and
          they have obvious ways back.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="button-primary" href="/cart">
            Return to cart
          </Link>
          <Link className="button-secondary" href="/#catalog">
            Keep browsing
          </Link>
        </div>
      </main>
    </div>
  );
}
