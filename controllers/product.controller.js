import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid product id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productUpdate = await Product.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json(productUpdate);
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "ValidationError") {
      return res.status(422).json({ error: error.errors });
    }

    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await Product.deleteOne({ _id: id });
    res.status(204).send();
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid product id" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      stock,
      images,
      categories,
      level,
      active,
    } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        error: "Complete the required fields please",
      });
    }

    const finalSlug =
      slug || `${name.trim().toLowerCase().replaceAll(" ", "-")}`;

    const existProduct = await Product.findOne({ slug: finalSlug });

    if (existProduct) {
      return res.status(403).json({
        error: "Product already exist",
      });
    }

    const product = await Product.create({
      name: name.trim().toLowerCase(),
      slug: finalSlug,
      description,
      price,
      stock,
      images,
      categories,
      level,
      active,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
