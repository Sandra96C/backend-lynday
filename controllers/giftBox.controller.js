import GiftBox from "../models/GiftBox.js";
import Product from "../models/Product.js";

export const getBoxes = async (req, res) => {
  try {
    const boxes = await GiftBox.find()
      .populate("category")
      .populate("products.product");
    res.status(200).json(boxes);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBoxById = async (req, res) => {
  try {
    const { id } = req.params;

    const box = await GiftBox.findById(id)
      .populate("category")
      .populate("products.product");

    if (!box) {
      return res.status(404).json({ error: "box not found" });
    }

    res.status(200).json(box);
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid box id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBox = async (req, res) => {
  try {
    const { id } = req.params;

    const box = await GiftBox.findById(id)
      .populate("category")
      .populate("products.product");

    if (!box) {
      return res.status(404).json({ error: "Box not found" });
    }

    const productUpdate = await GiftBox.findByIdAndUpdate(id, req.body, {
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

export const deleteBox = async (req, res) => {
  try {
    const { id } = req.params;
    const box = await GiftBox.findById(id);

    if (!box) {
      return res.status(404).json({ error: "Box not found" });
    }

    await GiftBox.deleteOne({ _id: id });
    res.status(204).send();
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid box id" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createBox = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      type,
      level,
      basePrice,
      category,
      active,
      products,
    } = req.body;

    if (!name || !basePrice) {
      return res.status(400).json({
        error: "Complete the required fields please",
      });
    }

    const finalSlug =
      slug || `${name.trim().toLowerCase().replaceAll(" ", "-")}`;

    const existBox = await GiftBox.findOne({ slug: finalSlug });

    if (existBox) {
      return res.status(409).json({
        error: "Box already exist",
      });
    }

    if (!products || products.length < 1) {
      return res.status(400).json({
        error: "Box must contain at least one product",
      });
    }

    await Promise.all(
      products.map(async (item) => {
        if (!item.product || item.quantity < 1) {
          throw new Error("Invalid product data");
        }

        const productExists = await Product.findById(item.product);
        if (!productExists) {
          throw new Error(`Product with id ${item.product} not found`);
        }
      }),
    );

    const box = await GiftBox.create({
      name: name.trim().toLowerCase(),
      slug: finalSlug,
      description,
      type,
      level,
      basePrice,
      category,
      active,
      products,
    });

    res.status(201).json(box);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
