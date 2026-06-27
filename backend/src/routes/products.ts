import { Router } from "express";
import { getProductBySlug, listProducts } from "../services/products";

export const productsRouter = Router();

productsRouter.get("/", async (_req, res, next) => {
  try {
    const products = await listProducts();
    res.json({ products });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:slug", async (req, res, next) => {
  try {
    const product = await getProductBySlug(req.params.slug);

    if (!product) {
      res.status(404).json({
        error: {
          message: "Product not found",
        },
      });
      return;
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
});
