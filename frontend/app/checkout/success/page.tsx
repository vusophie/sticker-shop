import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="mat-shell grid min-h-screen place-items-center px-5 py-12">
      <main id="main" className="status-panel max-w-2xl p-6 sm:p-10">
        <p className="badge mono-type">SUCCESS STATE</p>
        <h1 className="display-type mt-6 text-5xl leading-none tracking-[-0.04em] sm:text-6xl">
          Your stickers are on the bench.
        </h1>
        <p className="mt-5 text-lg leading-8 text-[var(--soft-ink)]">
          This is the future Stripe return page: calm confirmation, clear next
          steps, and no mystery about what happened after checkout.
        </p>
        <div
          className="mt-8 rounded-[1.5rem] bg-[var(--mat)] p-5"
          role="status"
        >
          <p className="mono-type text-sm font-bold text-[var(--soft-ink)]">
            ORDER STATUS
          </p>
          <p className="mt-2 text-xl font-bold">
            Paid confirmation will appear here after the webhook verifies it.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="button-primary" href="/#catalog">
            Shop more stickers
          </Link>
          <Link className="button-secondary" href="/cart">
            Back to cart preview
          </Link>
        </div>
      </main>
    </div>
  );
}
