import ProductCategory from "../models/ProductCategory.js";

export const getProductCategories = async (req, res) => {
  try {
    const productCategories = await ProductCategory.find();
    res.status(200).json(productCategories);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const productCategory = await ProductCategory.findById(id);

    if (!productCategory) {
      return res.status(404).json({ error: "Product category not found" });
    }

    res.status(200).json(productCategory);
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid product category id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const productCategory = await ProductCategory.findById(id);

    if (!productCategory) {
      return res.status(404).json({ error: "Product category not found" });
    }

    const productCategoryUpdate = await ProductCategory.findByIdAndUpdate(
      id,
      req.body,
      {
        returnDocument: "after",
      },
    );

    res.status(200).json(productCategoryUpdate);
  } catch (error) {
    console.error("Error:", error);

    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await ProductCategory.findById(id);

    if (!productCategory) {
      return res.status(404).json({ error: "Product category not found" });
    }

    await ProductCategory.deleteOne({ _id: id });
    res.status(204).send();
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid product category id" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProductCategory = async (req, res) => {
  try {
    const { name, description, image, sort } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Complete the name",
      });
    }

    const existProductCategory = await ProductCategory.findOne({
      name: name.trim().toLowerCase(),
    });

    if (existProductCategory) {
      return res.status(409).json({
        error: "Product category already exists",
      });
    }

    const productCategory = await ProductCategory.create({
      name: name.trim().toLowerCase(),
      description,
      image,
      sort,
    });

    res.status(201).json(productCategory);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
