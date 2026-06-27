"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const SHEET_SIZE = 8;
const SHEET_FEE_CENTS = 300;
const STICKER_SIZES = [
  { label: '2"', value: "2", priceDeltaCents: 0 },
  { label: '3"', value: "3", priceDeltaCents: 50 },
  { label: '4"', value: "4", priceDeltaCents: 100 },
] as const;

const products = [
  {
    id: "tall-cactus",
    name: "Tall cactus",
    category: "Botanicals",
    priceCents: 125,
    art: "🌵",
    description: "A tiny desert guardian with bright green ink.",
  },
  {
    id: "thunderhead",
    name: "Thunderhead",
    category: "Weather",
    priceCents: 125,
    art: "🌩️",
    description: "Soft cloud, tiny bolt, gentle storm energy.",
  },
  {
    id: "matcha-tin",
    name: "Matcha tin",
    category: "Pantry",
    priceCents: 150,
    art: "🍵",
    description: "A calm green tea tin for slow mornings.",
  },
  {
    id: "saturn",
    name: "Saturn",
    category: "Space",
    priceCents: 175,
    art: "🪐",
    description: "Ringed planet with a pearl finish.",
  },
  {
    id: "red-mushroom",
    name: "Red mushroom",
    category: "Forest",
    priceCents: 150,
    art: "🍄",
    description: "Storybook mushroom with cream spots.",
  },
  {
    id: "vhs-tape",
    name: "VHS tape",
    category: "Retro",
    priceCents: 150,
    art: "📼",
    description: "A pocket-sized rewind button.",
  },
  {
    id: "shooting-star",
    name: "Shooting star",
    category: "Space",
    priceCents: 125,
    art: "🌠",
    description: "Blue night sky with one clean streak of gold.",
  },
  {
    id: "cherry-bunch",
    name: "Cherry bunch",
    category: "Fruit",
    priceCents: 150,
    art: "🍒",
    description: "Glossy cherries with a sticker-book shine.",
  },
  {
    id: "frog-prince",
    name: "Frog prince",
    category: "Forest",
    priceCents: 175,
    art: "🐸",
    description: "A crowned frog who looks politely magical.",
  },
  {
    id: "boombox",
    name: "Boombox",
    category: "Retro",
    priceCents: 175,
    art: "📻",
    description: "Warm gray speakers and weekend mixtape energy.",
  },
  {
    id: "roman-loaf",
    name: "Roman loaf",
    category: "Pantry",
    priceCents: 150,
    art: "🍞",
    description: "A bakery shelf classic with toasted edges.",
  },
  {
    id: "crescent-moon",
    name: "Crescent moon",
    category: "Space",
    priceCents: 125,
    art: "🌙",
    description: "Quiet moon curve for journals and laptops.",
  },
  {
    id: "sunflower",
    name: "Sunflower",
    category: "Botanicals",
    priceCents: 150,
    art: "🌻",
    description: "Sunny petals with a hand-cut look.",
  },
  {
    id: "ghost-buddy",
    name: "Ghost buddy",
    category: "Spooky",
    priceCents: 175,
    art: "👻",
    description: "Friendly haunt with lavender cheeks.",
  },
  {
    id: "comet",
    name: "Comet",
    category: "Space",
    priceCents: 125,
    art: "☄️",
    description: "A bright orange streak for cosmic layouts.",
  },
  {
    id: "coffee-cup",
    name: "Coffee cup",
    category: "Pantry",
    priceCents: 125,
    art: "☕",
    description: "Small ceramic cup with Monday-proof steam.",
  },
  {
    id: "jellyfish",
    name: "Jellyfish",
    category: "Ocean",
    priceCents: 150,
    art: "🪼",
    description: "Translucent blue drift with soft tentacles.",
  },
  {
    id: "cassette",
    name: "Cassette",
    category: "Retro",
    priceCents: 150,
    art: "📼",
    description: "A second tiny tape for analog loyalists.",
  },
];

type Product = (typeof products)[number];
type StickerSize = (typeof STICKER_SIZES)[number]["value"];
type SelectedSticker = {
  productId: Product["id"];
  size: StickerSize;
};

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function Home() {
  const [selectedStickers, setSelectedStickers] = useState<SelectedSticker[]>([]);
  const [sizeByProductId, setSizeByProductId] = useState<Record<string, StickerSize>>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const selectedItems = selectedStickers
    .map((sticker) => {
      const product = products.find((item) => item.id === sticker.productId);
      const size = STICKER_SIZES.find((item) => item.value === sticker.size);

      if (!product || !size) {
        return null;
      }

      return {
        product,
        size,
        priceCents: product.priceCents + size.priceDeltaCents,
      };
    })
    .filter((item): item is { product: Product; size: (typeof STICKER_SIZES)[number]; priceCents: number } =>
      Boolean(item),
    );

  const selectedIdSet = new Set(selectedStickers.map((sticker) => sticker.productId));
  const openSlots = SHEET_SIZE - selectedStickers.length;
  const isComplete = openSlots === 0;
  const stickerTotal = selectedItems.reduce(
    (sum, item) => sum + item.priceCents,
    0,
  );
  const totalCents = stickerTotal + (selectedStickers.length > 0 ? SHEET_FEE_CENTS : 0);

  const categories = useMemo(() => {
    const counts = products.reduce<Record<string, number>>((acc, product) => {
      acc[product.category] = (acc[product.category] ?? 0) + 1;
      return acc;
    }, {});

    return [
      { name: "All", count: products.length },
      ...Object.entries(counts).map(([name, count]) => ({ name, count })),
    ];
  }, []);

  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  function getStickerPrice(product: Product, sizeValue?: StickerSize) {
    const size = STICKER_SIZES.find((item) => item.value === sizeValue);
    return product.priceCents + (size?.priceDeltaCents ?? 0);
  }

  function addSticker(product: Product) {
    const selectedSize = sizeByProductId[product.id];

    if (selectedIdSet.has(product.id)) {
      return;
    }

    if (!selectedSize || selectedStickers.length >= SHEET_SIZE) {
      return;
    }

    setSelectedStickers((current) => [
      ...current,
      { productId: product.id, size: selectedSize },
    ]);
    setCheckoutMessage("");
  }

  function removeSticker(index: number) {
    setSelectedStickers((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setCheckoutMessage("");
  }

  function handleCheckout() {
    if (!isComplete) {
      return;
    }

    setCheckoutMessage(
      `Your sheet is ready. Phase 4 will connect this ${formatMoney(totalCents)} order to Stripe Checkout.`,
    );
  }

  return (
    <main className="min-h-screen bg-[var(--linen)] text-[var(--ink)]">
      <a className="skip-link" href="#catalog">
        Skip to sticker catalog
      </a>

      <section className="builder-shell" id="top">
        <section className="catalog-section" id="catalog" aria-labelledby="catalog-title">
          <div className="hero-copy">
            <p className="eyebrow">Your tiny custom sheet</p>
            <h1>Pick 8. We cut the rest.</h1>
            <p>
              Choose a sticker, pick a size, and add it to your custom sheet.
            </p>
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">Sticker catalog</p>
              <h2 id="catalog-title">Add your favorites</h2>
            </div>
          </div>

          <div className="filter-bar" aria-label="Filter stickers by category">
            {categories.map((category) => (
              <button
                className={activeCategory === category.name ? "active" : ""}
                key={category.name}
                type="button"
                onClick={() => setActiveCategory(category.name)}
                aria-pressed={activeCategory === category.name}
              >
                {category.name}
                <span>{category.count}</span>
              </button>
            ))}
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => {
              const isSelected = selectedIdSet.has(product.id);
              const selectedSize = sizeByProductId[product.id];
              const canAdd = Boolean(selectedSize) && !isSelected && !isComplete;
              const displayedPrice = getStickerPrice(product, selectedSize);

              return (
                <article className={isSelected ? "product-card selected" : "product-card"} key={product.id}>
                  <div className="product-visual">
                    <Image
                      className="product-image"
                      src="/checker.png"
                      alt={`${product.name} sticker preview`}
                      width={220}
                      height={220}
                    />
                  </div>

                  <div className="product-copy">
                    <div className="product-card-topline">
                      <span className="category-chip">{product.category}</span>
                      <span>{formatMoney(displayedPrice)}</span>
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description" id={`${product.id}-description`}>
                      {product.description}
                    </p>
                  </div>

                  <fieldset className="size-options">
                    <legend>Size</legend>
                    <div>
                      {STICKER_SIZES.map((size) => (
                        <label key={size.value}>
                          <input
                            checked={selectedSize === size.value}
                            disabled={isSelected}
                            name={`${product.id}-size`}
                            onChange={() =>
                              setSizeByProductId((current) => ({
                                ...current,
                                [product.id]: size.value,
                              }))
                            }
                            type="radio"
                            value={size.value}
                          />
                          <span>{size.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="product-actions">
                    {isSelected ? (
                      <button
                        className="secondary-action"
                        type="button"
                        onClick={() =>
                          removeSticker(
                            selectedStickers.findIndex((sticker) => sticker.productId === product.id),
                          )
                        }
                      >
                        Remove
                      </button>
                    ) : null}
                    <button
                      className="add-button"
                      type="button"
                      onClick={() => addSticker(product)}
                      disabled={!canAdd}
                      aria-describedby={`${product.id}-description`}
                    >
                      {isSelected
                        ? "Added"
                        : isComplete
                          ? "Sheet full"
                          : selectedSize
                            ? "Add"
                            : "Select size"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="selection-panel" aria-label="Sticker sheet builder">
          <p className="sr-only" id="builder-instructions">
            Add stickers from the catalog to fill the next open numbered slot.
            Selected stickers can be removed from this sheet or from their
            catalog cards.
          </p>

          <div className="sheet-card" aria-describedby="builder-instructions">
            <div className="sheet-card-header">
              <div>
                <span className="micro-label">Your sheet</span>
                <h2>
                  {isComplete
                    ? "Ready to order"
                    : `${selectedStickers.length} of ${SHEET_SIZE} selected`}
                </h2>
              </div>
              <div className="price-pill" aria-label={`Current total ${formatMoney(totalCents)}`}>
                {formatMoney(totalCents)}
              </div>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={SHEET_SIZE}
              aria-valuenow={selectedStickers.length}
              aria-label={`${selectedStickers.length} of ${SHEET_SIZE} sticker slots filled`}
            >
              <span style={{ width: `${(selectedStickers.length / SHEET_SIZE) * 100}%` }} />
            </div>

            <ol className="sheet-slots" aria-label="Selected sticker slots">
              {Array.from({ length: SHEET_SIZE }, (_, index) => {
                const item = selectedItems[index];
                const product = item?.product;

                return (
                  <li
                    className={product ? "sheet-slot filled" : "sheet-slot"}
                    key={`${product?.id ?? "slot"}-${index}`}
                    aria-label={
                      product
                        ? `Slot ${index + 1}, ${product.name}, ${item.size.label}`
                        : `Slot ${index + 1}, empty`
                    }
                  >
                    {product ? (
                      <>
                        <span className={`slot-art slot-art-${item.size.value}`}>
                          <Image
                            className="sticker-image"
                            src="/checker.png"
                            alt={`${product.name} sticker preview`}
                            width={96}
                            height={96}
                          />
                        </span>
                        <button
                          className="remove-sticker"
                          type="button"
                          onClick={() => removeSticker(index)}
                          aria-label={`Remove ${product.name} from slot ${index + 1}`}
                        >
                          x
                        </button>
                      </>
                    ) : (
                      <span className="slot-empty" aria-hidden="true" />
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="checkout-row">
              <p id="summary" className="fee-note">
                Stickers {formatMoney(stickerTotal)} + sheet setup{" "}
                {formatMoney(SHEET_FEE_CENTS)}
              </p>
              <button
                className="checkout-button"
                type="button"
                disabled={!isComplete}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </section>
      </section>

      {checkoutMessage ? (
        <section className="checkout-message" role="status" aria-live="polite">
          <p>{checkoutMessage}</p>
        </section>
      ) : null}

      <div className="checkout-dock" aria-label="Checkout summary">
        <div>
          <span>{selectedStickers.length}/8 selected</span>
          <strong>{formatMoney(totalCents)}</strong>
        </div>
        <button
          className="checkout-button"
          type="button"
          disabled={!isComplete}
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </main>
  );
}
