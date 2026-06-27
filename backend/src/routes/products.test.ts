import request from "supertest";
import { app } from "../app";
import { getProductBySlug, listProducts } from "../services/products";

jest.mock("../services/products", () => ({
  getProductBySlug: jest.fn(),
  listProducts: jest.fn(),
}));

const mockedGetProductBySlug = jest.mocked(getProductBySlug);
const mockedListProducts = jest.mocked(listProducts);

const product = {
  id: "product_1",
  slug: "tall-cactus",
  name: "Tall cactus",
  description: "A tiny desert guardian with bright green ink.",
  category: "Botanicals",
  imageUrl: "/checker.png",
  isActive: true,
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  variants: [
    {
      id: "variant_2",
      productId: "product_1",
      sizeInches: 2,
      priceCents: 125,
      isActive: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
    {
      id: "variant_3",
      productId: "product_1",
      sizeInches: 3,
      priceCents: 175,
      isActive: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
    {
      id: "variant_4",
      productId: "product_1",
      sizeInches: 4,
      priceCents: 225,
      isActive: true,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
  ],
};

describe("API routes", () => {
  it("returns health status", async () => {
    await request(app).get("/api/health").expect(200, { status: "ok" });
  });

  it("lists active products with size variants", async () => {
    mockedListProducts.mockResolvedValue([product]);

    const response = await request(app).get("/api/products").expect(200);

    expect(response.body.products).toHaveLength(1);
    expect(response.body.products[0]).toMatchObject({
      slug: "tall-cactus",
      name: "Tall cactus",
      variants: [
        { sizeInches: 2, priceCents: 125 },
        { sizeInches: 3, priceCents: 175 },
        { sizeInches: 4, priceCents: 225 },
      ],
    });
  });

  it("returns one product by slug", async () => {
    mockedGetProductBySlug.mockResolvedValue(product);

    const response = await request(app).get("/api/products/tall-cactus").expect(200);

    expect(mockedGetProductBySlug).toHaveBeenCalledWith("tall-cactus");
    expect(response.body.product).toMatchObject({
      slug: "tall-cactus",
      variants: expect.arrayContaining([
        expect.objectContaining({ sizeInches: 2 }),
        expect.objectContaining({ sizeInches: 3 }),
        expect.objectContaining({ sizeInches: 4 }),
      ]),
    });
  });

  it("returns 404 for an unknown product slug", async () => {
    mockedGetProductBySlug.mockResolvedValue(null);

    await request(app).get("/api/products/unknown").expect(404, {
      error: {
        message: "Product not found",
      },
    });
  });
});
