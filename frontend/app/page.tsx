import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function Home() {
  return (
    <div className="mat-shell">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-6 sm:px-8">
        <Link
          href="/"
          className="display-type rounded-full bg-[var(--paper)] px-4 py-2 text-xl shadow-sm"
        >
          Mat & Peel
        </Link>
        <nav aria-label="Primary navigation">
          <Link className="button-secondary hidden sm:inline-flex" href="/cart">
            Cart preview
          </Link>
        </nav>
      </header>

      <main id="main" className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
        <section className="py-10 lg:py-16">
          <div className="workbench-card max-w-5xl p-6 sm:p-9">
            <p className="badge mono-type">DIE-CUT / GLOSS / ACCESSIBLE</p>
            <h1 className="display-type mt-6 max-w-4xl text-5xl leading-[0.95] tracking-[-0.04em] sm:text-7xl">
              Stickers staged on the mat they were born from.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-[var(--soft-ink)]">
              A tactile storefront for physical stickers: cut lines, peel-away
              corners, label-maker prices, and the same delightful affordance
              for mouse, touch, and keyboard users.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="button-primary" href="#catalog">
                Browse the sheet
              </a>
            </div>
          </div>
        </section>

        <section
          id="catalog"
          aria-labelledby="catalog-heading"
          className="py-10"
        >
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mono-type text-sm font-bold text-[var(--soft-ink)]">
                CURRENT SHEET
              </p>
              <h2
                id="catalog-heading"
                className="display-type mt-2 text-4xl tracking-[-0.03em] sm:text-5xl"
              >
                Fresh from the cut mat
              </h2>
            </div>
            <p className="max-w-md leading-7 text-[var(--soft-ink)]">
              Phase 1 content uses mock inventory now, but every card is shaped
              like the production catalog component it will become.
            </p>
          </div>
          <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
