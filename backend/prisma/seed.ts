import { prisma } from "../src/lib/prisma";

type SeedProduct = {
  slug: string;
  name: string;
  description: string;
  category: string;
  basePriceCents: number;
};

const products: SeedProduct[] = [
  {
    slug: "tall-cactus",
    name: "Tall cactus",
    category: "Botanicals",
    basePriceCents: 125,
    description: "A tiny desert guardian with bright green ink.",
  },
  {
    slug: "thunderhead",
    name: "Thunderhead",
    category: "Weather",
    basePriceCents: 125,
    description: "Soft cloud, tiny bolt, gentle storm energy.",
  },
  {
    slug: "matcha-tin",
    name: "Matcha tin",
    category: "Pantry",
    basePriceCents: 150,
    description: "A calm green tea tin for slow mornings.",
  },
  {
    slug: "saturn",
    name: "Saturn",
    category: "Space",
    basePriceCents: 175,
    description: "Ringed planet with a pearl finish.",
  },
  {
    slug: "red-mushroom",
    name: "Red mushroom",
    category: "Forest",
    basePriceCents: 150,
    description: "Storybook mushroom with cream spots.",
  },
  {
    slug: "vhs-tape",
    name: "VHS tape",
    category: "Retro",
    basePriceCents: 150,
    description: "A pocket-sized rewind button.",
  },
  {
    slug: "shooting-star",
    name: "Shooting star",
    category: "Space",
    basePriceCents: 125,
    description: "Blue night sky with one clean streak of gold.",
  },
  {
    slug: "cherry-bunch",
    name: "Cherry bunch",
    category: "Fruit",
    basePriceCents: 150,
    description: "Glossy cherries with a sticker-book shine.",
  },
  {
    slug: "frog-prince",
    name: "Frog prince",
    category: "Forest",
    basePriceCents: 175,
    description: "A crowned frog who looks politely magical.",
  },
  {
    slug: "boombox",
    name: "Boombox",
    category: "Retro",
    basePriceCents: 175,
    description: "Warm gray speakers and weekend mixtape energy.",
  },
  {
    slug: "roman-loaf",
    name: "Roman loaf",
    category: "Pantry",
    basePriceCents: 150,
    description: "A bakery shelf classic with toasted edges.",
  },
  {
    slug: "crescent-moon",
    name: "Crescent moon",
    category: "Space",
    basePriceCents: 125,
    description: "Quiet moon curve for journals and laptops.",
  },
  {
    slug: "sunflower",
    name: "Sunflower",
    category: "Botanicals",
    basePriceCents: 150,
    description: "Sunny petals with a hand-cut look.",
  },
  {
    slug: "ghost-buddy",
    name: "Ghost buddy",
    category: "Spooky",
    basePriceCents: 175,
    description: "Friendly haunt with lavender cheeks.",
  },
  {
    slug: "comet",
    name: "Comet",
    category: "Space",
    basePriceCents: 125,
    description: "A bright orange streak for cosmic layouts.",
  },
  {
    slug: "coffee-cup",
    name: "Coffee cup",
    category: "Pantry",
    basePriceCents: 125,
    description: "Small ceramic cup with Monday-proof steam.",
  },
  {
    slug: "jellyfish",
    name: "Jellyfish",
    category: "Ocean",
    basePriceCents: 150,
    description: "Translucent blue drift with soft tentacles.",
  },
  {
    slug: "cassette",
    name: "Cassette",
    category: "Retro",
    basePriceCents: 150,
    description: "A second tiny tape for analog loyalists.",
  },
];

const sizeVariants = [
  { sizeInches: 2, priceDeltaCents: 0 },
  { sizeInches: 3, priceDeltaCents: 50 },
  { sizeInches: 4, priceDeltaCents: 100 },
];

async function main() {
  for (const product of products) {
    const savedProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        category: product.category,
        imageUrl: "/checker.png",
        isActive: true,
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        category: product.category,
        imageUrl: "/checker.png",
      },
    });

    for (const variant of sizeVariants) {
      await prisma.productVariant.upsert({
        where: {
          productId_sizeInches: {
            productId: savedProduct.id,
            sizeInches: variant.sizeInches,
          },
        },
        update: {
          priceCents: product.basePriceCents + variant.priceDeltaCents,
          isActive: true,
        },
        create: {
          productId: savedProduct.id,
          sizeInches: variant.sizeInches,
          priceCents: product.basePriceCents + variant.priceDeltaCents,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
