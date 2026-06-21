import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { StickerPeel } from "@/components/StickerPeel";
import { getProduct, products } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return {
      title: "Sticker not found | Mat & Peel",
    };
  }

  return {
    title: `${product.name} | Mat & Peel`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mat-shell">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-6 sm:px-8">
        <Link
          href="/"
          className="display-type rounded-full bg-[var(--paper)] px-4 py-2 text-xl shadow-sm"
        >
          Mat & Peel
        </Link>
        <Link className="button-secondary" href="/cart">
          Cart preview
        </Link>
      </header>

      <main
        id="main"
        className="mx-auto grid w-full max-w-6xl gap-8 px-5 pb-20 pt-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"
      >
        <section
          aria-label={`${product.name} artwork preview`}
          className="workbench-card p-6 sm:p-8"
        >
          <div
            className="sticker-card"
            style={
              {
                "--sticker-accent": product.accent,
                "--sticker-rotation": product.rotation,
              } as CSSProperties
            }
          >
            <div className="sticker-card__surface min-h-[28rem]">
              <div className="grid min-h-[24rem] place-items-center">
                <StickerPeel peelBackHoverPct={30} peelDirection={0}>
                  <div
                    aria-hidden="true"
                    className={`sticker-card__icon shape-${product.shape} h-44 w-44 text-6xl`}
                  >
                    {product.sku.slice(-1)}
                  </div>
                </StickerPeel>
              </div>
            </div>
          </div>
        </section>

        <section className="workbench-card p-6 sm:p-9">
          <Link
            href="/#catalog"
            className="mono-type text-sm font-bold text-[var(--cobalt)]"
          >
            Back to catalog
          </Link>
          <p className="badge mono-type mt-6">{product.sku}</p>
          <h1 className="display-type mt-5 text-5xl leading-none tracking-[-0.04em] sm:text-7xl">
            {product.name}
          </h1>
          <p className="mt-6 text-xl leading-8 text-[var(--soft-ink)]">
            {product.description}
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/60 p-4">
              <dt className="mono-type text-xs font-bold text-[var(--soft-ink)]">
                Price
              </dt>
              <dd className="mono-type mt-2 text-2xl font-bold">
                {product.price}
              </dd>
            </div>
            <div className="rounded-3xl bg-white/60 p-4">
              <dt className="mono-type text-xs font-bold text-[var(--soft-ink)]">
                Finish
              </dt>
              <dd className="mt-2 font-bold">{product.finish}</dd>
            </div>
            <div className="rounded-3xl bg-white/60 p-4">
              <dt className="mono-type text-xs font-bold text-[var(--soft-ink)]">
                Size
              </dt>
              <dd className="mt-2 font-bold">{product.size}</dd>
            </div>
          </dl>

          <h2 className="display-type mt-9 text-2xl">Maker notes</h2>
          <ul className="mt-4 grid gap-3">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="rounded-2xl bg-[var(--paper)] px-4 py-3 text-[var(--soft-ink)] shadow-sm"
              >
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary" href="/cart">
              Add to cart preview
            </Link>
            <Link className="button-secondary" href="/checkout/success">
              Preview success state
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
