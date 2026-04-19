/**
 * SEED DATA — 35 Indian Grocery Products
 * Call POST /api/products/seed to load these into MongoDB.
 * POST /api/products/seed/force to wipe and re-seed.
 */
module.exports = [
  // ── Dairy ──────────────────────────────────────────────────────────────────
  { name:'Whole Milk',         category:'Dairy',       price:60,  unit:'litre',  expiryDays:5,   imageEmoji:'🥛', tags:['breakfast','daily'] },
  { name:'Curd / Yogurt',      category:'Dairy',       price:40,  unit:'500g',   expiryDays:4,   imageEmoji:'🍶', tags:['daily'] },
  { name:'Paneer',             category:'Dairy',       price:120, unit:'250g',   expiryDays:3,   imageEmoji:'🧀', tags:['protein'] },
  { name:'Butter',             category:'Dairy',       price:55,  unit:'100g',   expiryDays:30,  imageEmoji:'🧈', tags:['breakfast'] },
  { name:'Cheese',             category:'Dairy',       price:90,  unit:'200g',   expiryDays:14,  imageEmoji:'🧀', tags:['snack'] },
  // ── Vegetables ─────────────────────────────────────────────────────────────
  { name:'Tomatoes',           category:'Vegetables',  price:30,  unit:'kg',     expiryDays:5,   imageEmoji:'🍅', tags:['daily','cooking'] },
  { name:'Onions',             category:'Vegetables',  price:25,  unit:'kg',     expiryDays:14,  imageEmoji:'🧅', tags:['daily','cooking'] },
  { name:'Potatoes',           category:'Vegetables',  price:20,  unit:'kg',     expiryDays:21,  imageEmoji:'🥔', tags:['daily','cooking'] },
  { name:'Spinach',            category:'Vegetables',  price:20,  unit:'bunch',  expiryDays:3,   imageEmoji:'🥬', tags:['healthy'] },
  { name:'Capsicum',           category:'Vegetables',  price:40,  unit:'kg',     expiryDays:7,   imageEmoji:'🫑', tags:['cooking'] },
  { name:'Cauliflower',        category:'Vegetables',  price:35,  unit:'piece',  expiryDays:5,   imageEmoji:'🥦', tags:['cooking'] },
  { name:'Carrot',             category:'Vegetables',  price:30,  unit:'kg',     expiryDays:10,  imageEmoji:'🥕', tags:['healthy'] },
  // ── Fruits ─────────────────────────────────────────────────────────────────
  { name:'Bananas',            category:'Fruits',      price:40,  unit:'dozen',  expiryDays:4,   imageEmoji:'🍌', tags:['breakfast','healthy'] },
  { name:'Apples',             category:'Fruits',      price:120, unit:'kg',     expiryDays:14,  imageEmoji:'🍎', tags:['healthy','snack'] },
  { name:'Oranges',            category:'Fruits',      price:60,  unit:'kg',     expiryDays:7,   imageEmoji:'🍊', tags:['healthy'] },
  { name:'Mangoes',            category:'Fruits',      price:80,  unit:'kg',     expiryDays:5,   imageEmoji:'🥭', tags:['seasonal'] },
  { name:'Grapes',             category:'Fruits',      price:70,  unit:'kg',     expiryDays:6,   imageEmoji:'🍇', tags:['snack'] },
  // ── Grains ─────────────────────────────────────────────────────────────────
  { name:'Basmati Rice',       category:'Grains',      price:90,  unit:'kg',     expiryDays:365, imageEmoji:'🍚', tags:['staple','daily'] },
  { name:'Wheat Flour (Atta)', category:'Grains',      price:55,  unit:'kg',     expiryDays:90,  imageEmoji:'🌾', tags:['staple','daily'] },
  { name:'Toor Dal',           category:'Grains',      price:120, unit:'kg',     expiryDays:180, imageEmoji:'🫘', tags:['protein','staple'] },
  { name:'Moong Dal',          category:'Grains',      price:110, unit:'kg',     expiryDays:180, imageEmoji:'🫘', tags:['protein'] },
  { name:'Oats',               category:'Grains',      price:130, unit:'500g',   expiryDays:180, imageEmoji:'🥣', tags:['healthy','breakfast'] },
  { name:'Poha',               category:'Grains',      price:45,  unit:'500g',   expiryDays:180, imageEmoji:'🍚', tags:['breakfast'] },
  // ── Beverages ──────────────────────────────────────────────────────────────
  { name:'Tea Leaves',         category:'Beverages',   price:150, unit:'250g',   expiryDays:365, imageEmoji:'🍵', tags:['daily','morning'] },
  { name:'Coffee',             category:'Beverages',   price:200, unit:'200g',   expiryDays:365, imageEmoji:'☕', tags:['morning'] },
  { name:'Orange Juice',       category:'Beverages',   price:80,  unit:'litre',  expiryDays:7,   imageEmoji:'🧃', tags:['healthy'] },
  // ── Meat ───────────────────────────────────────────────────────────────────
  { name:'Chicken',            category:'Meat',        price:200, unit:'kg',     expiryDays:2,   imageEmoji:'🍗', tags:['protein'] },
  { name:'Eggs',               category:'Meat',        price:70,  unit:'dozen',  expiryDays:21,  imageEmoji:'🥚', tags:['protein','breakfast','daily'] },
  { name:'Fish',               category:'Meat',        price:250, unit:'kg',     expiryDays:1,   imageEmoji:'🐟', tags:['protein'] },
  // ── Snacks ─────────────────────────────────────────────────────────────────
  { name:'Biscuits',           category:'Snacks',      price:40,  unit:'pack',   expiryDays:180, imageEmoji:'🍪', tags:['snack'] },
  { name:'Chips',              category:'Snacks',      price:30,  unit:'pack',   expiryDays:90,  imageEmoji:'🥔', tags:['snack'] },
  { name:'Nuts Mix',           category:'Snacks',      price:150, unit:'250g',   expiryDays:90,  imageEmoji:'🥜', tags:['healthy','snack'] },
  // ── Household ──────────────────────────────────────────────────────────────
  { name:'Cooking Oil',        category:'Household',   price:150, unit:'litre',  expiryDays:180, imageEmoji:'🫙', tags:['cooking','daily'] },
  { name:'Dish Soap',          category:'Household',   price:45,  unit:'500ml',  expiryDays:365, imageEmoji:'🧴', tags:['cleaning'] },
  { name:'Laundry Detergent',  category:'Household',   price:130, unit:'kg',     expiryDays:365, imageEmoji:'🧺', tags:['cleaning'] },
];
