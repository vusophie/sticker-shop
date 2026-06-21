export type Product = {
  slug: string;
  name: string;
  sku: string;
  price: string;
  shortDescription: string;
  description: string;
  finish: string;
  size: string;
  accent: string;
  shape: "blob" | "ticket" | "burst" | "oval";
  rotation: string;
  features: string[];
};

export const products: Product[] = [
  {
    slug: "midnight-snail-mail",
    name: "Midnight Snail Mail",
    sku: "MAT-001",
    price: "$4.50",
    shortDescription: "A glossy cobalt courier with tiny moonlit envelopes.",
    description:
      "A slow little messenger for laptops, water bottles, planners, and anyone who believes good mail is worth waiting for.",
    finish: "Gloss vinyl",
    size: '3" x 2.4"',
    accent: "#2D5FE0",
    shape: "blob",
    rotation: "-2deg",
    features: ["Weather-resistant vinyl", "Easy-peel split backing", "Soft-touch gloss seal"],
  },
  {
    slug: "compost-orbit",
    name: "Compost Orbit",
    sku: "MAT-002",
    price: "$5.00",
    shortDescription: "A tiny planet of peels, leaves, and kitchen magic.",
    description:
      "Made for garden journals and green bins, this sticker turns everyday scraps into a little solar system.",
    finish: "Satin vinyl",
    size: '2.8" circle',
    accent: "#E8593C",
    shape: "oval",
    rotation: "1.5deg",
    features: ["Dishwasher-safe laminate", "Rich coral ink", "Rounded die-cut edge"],
  },
  {
    slug: "lucky-label-maker",
    name: "Lucky Label Maker",
    sku: "MAT-003",
    price: "$3.75",
    shortDescription: "A retro label strip for the delightfully organized.",
    description:
      "A wink at old inventory bins, shipping drawers, and the very specific joy of naming where everything belongs.",
    finish: "Matte vinyl",
    size: '3.2" x 1.6"',
    accent: "#F2A623",
    shape: "ticket",
    rotation: "-1deg",
    features: ["Low-glare matte finish", "Label-maker texture", "Repositionable during application"],
  },
  {
    slug: "cosmic-cutline",
    name: "Cosmic Cutline",
    sku: "MAT-004",
    price: "$4.25",
    shortDescription: "A starburst that celebrates the path of the blade.",
    description:
      "Inspired by the white kiss-cut line around every sheet before it becomes a real sticker.",
    finish: "Holographic vinyl",
    size: '2.6" x 2.6"',
    accent: "#B6391F",
    shape: "burst",
    rotation: "2deg",
    features: ["Holographic flash", "Durable outdoor adhesive", "Crisp white border"],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
