import Link from "next/link";
import { products } from "@/lib/products";

const cartItems = products.slice(0, 2);

export default function CartPage() {
  const total = cartItems.reduce(
    (sum, product) => sum + Number(product.price.replace("$", "")),
    0,
  );

  return (
    <div className="mat-shell">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-5 py-6 sm:px-8">
        <Link
          href="/"
          className="display-type rounded-full bg-[var(--paper)] px-4 py-2 text-xl shadow-sm"
        >
          Mat & Peel
        </Link>
        <Link
          href="/#catalog"
          className="mono-type text-sm font-bold text-[var(--cobalt)]"
        >
          Continue browsing
        </Link>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 sm:px-8">
        <section className="workbench-card p-6 sm:p-9">
          <p className="badge mono-type">CART WIREFRAME</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
            <div>
              <h1 className="display-type text-5xl leading-none tracking-[-0.04em] sm:text-6xl">
                Your peel sheet
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--soft-ink)]">
                Phase 1 keeps checkout non-functional, but this screen sketches
                the future cart with clear item names, prices, and actions.
              </p>

              <ul className="mt-8 grid gap-4" aria-label="Cart items">
                {cartItems.map((product) => (
                  <li
                    key={product.slug}
                    className="flex flex-col gap-4 rounded-[1.5rem] bg-[var(--paper)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="mono-type text-xs font-bold text-[var(--soft-ink)]">
                        {product.sku}
                      </p>
                      <h2 className="display-type mt-1 text-2xl">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-[var(--soft-ink)]">
                        Quantity: 1 / {product.finish}
                      </p>
                    </div>
                    <p className="mono-type text-xl font-bold">
                      {product.price}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <aside
              aria-labelledby="summary-heading"
              className="rounded-[1.75rem] bg-[var(--charcoal)] p-5 text-white"
            >
              <h2 id="summary-heading" className="display-type text-3xl">
                Order summary
              </h2>
              <dl className="mt-6 grid gap-4">
                <div className="flex justify-between gap-4">
                  <dt>Subtotal</dt>
                  <dd className="mono-type">${total.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Shipping</dt>
                  <dd className="mono-type">Later</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-white/20 pt-4 text-xl font-bold">
                  <dt>Total preview</dt>
                  <dd className="mono-type">${total.toFixed(2)}</dd>
                </div>
              </dl>
              <Link className="button-primary mt-7 w-full" href="/checkout/success">
                Preview checkout success
              </Link>
              <Link
                className="button-secondary mt-3 w-full border-white/20 bg-white/10 text-white"
                href="/checkout/cancel"
              >
                Preview checkout cancel
              </Link>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}
