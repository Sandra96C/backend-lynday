import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid category id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const updates = { ...req.body };

    if (!updates.slug || updates.slug.trim() === "") {
      updates.slug = (updates.name || category.name)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
    }

    const categoryUpdate = await Category.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
    });

    res.status(200).json(categoryUpdate);
  } catch (error) {
    console.error("Error:", error);

    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await Category.deleteOne({ _id: id });
    res.status(204).send();
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid category id" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, active, sort } = req.body;

    if (!name) {
      return res.status(400).json({
        error: "Complete the name",
      });
    }

    const finalSlug =
      slug || `${name.trim().toLowerCase().replaceAll(" ", "-")}`;

    const existCategory = await Category.findOne({ slug: finalSlug });

    if (existCategory) {
      return res.status(409).json({
        error: "Category already exists",
      });
    }

    const category = await Category.create({
      name: name.trim().toLowerCase(),
      slug: finalSlug,
      description,
      image,
      active,
      sort,
    });

    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
