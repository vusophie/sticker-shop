import { prisma } from "../lib/prisma";

const activeVariantsQuery = {
  where: { isActive: true },
  orderBy: { sizeInches: "asc" as const },
};

const productQuery = {
  include: {
    variants: activeVariantsQuery,
  },
};

export type ProductWithVariants = Awaited<
  ReturnType<typeof listProducts>
>[number];

export async function listProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
    ...productQuery,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
    },
    ...productQuery,
  });
}
