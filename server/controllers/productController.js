const Product = require('../models/Product');
const seedProducts = require('../utils/seedProducts');

/**
 * Returns the active catalog, with optional category and search filters.
 */
const listProducts = async (request, response) => {
  const { category, search } = request.query;
  const productFilter = { isActive: true };

  if (category && category !== 'All') {
    productFilter.category = category;
  }

  if (search) {
    productFilter.name = { $regex: search, $options: 'i' };
  }

  const products = await Product.find(productFilter).sort({ category: 1, name: 1 });
  return response.json({ products });
};

/**
 * Seeds the catalog once for a fresh local environment.
 */
const seedInitialProducts = async (_request, response) => {
  const existingCount = await Product.countDocuments();

  if (existingCount > 0) {
    return response.json({ count: existingCount, message: `${existingCount} products already exist` });
  }

  const createdProducts = await Product.insertMany(seedProducts);
  return response
    .status(201)
    .json({ count: createdProducts.length, message: `Seeded ${createdProducts.length} products` });
};

/**
 * Clears and rebuilds the demo catalog for local development resets.
 */
const forceSeedProducts = async (_request, response) => {
  await Product.deleteMany({});
  const createdProducts = await Product.insertMany(seedProducts);

  return response
    .status(201)
    .json({ count: createdProducts.length, message: `Re-seeded ${createdProducts.length} products` });
};

/**
 * Creates a product document directly from the request body.
 */
const createProduct = async (request, response) => {
  const product = await Product.create(request.body);
  return response.status(201).json({ product });
};

/**
 * Updates an existing product and returns the latest saved version.
 */
const updateProduct = async (request, response) => {
  const product = await Product.findByIdAndUpdate(request.params.id, request.body, { new: true });

  if (!product) {
    return response.status(404).json({ message: 'Not found' });
  }

  return response.json({ product });
};

module.exports = {
  createProduct,
  forceSeedProducts,
  listProducts,
  seedInitialProducts,
  updateProduct,
};
