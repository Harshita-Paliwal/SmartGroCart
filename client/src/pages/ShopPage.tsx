import React, { useCallback, useEffect, useState } from 'react';
import { addToCart, getProducts } from '../api';
import { Page } from '../App';
import { Product } from '../types/domain';

const PRODUCT_CATEGORIES = [
  'All',
  'Dairy',
  'Vegetables',
  'Fruits',
  'Meat',
  'Grains',
  'Beverages',
  'Snacks',
  'Household',
];

interface ShopPageProps {
  onNavigate?: (page: Page) => void;
  cartCount?: number;
  onCartChange?: () => void | Promise<void>;
}

/**
 * Displays the product catalog and lets users add items into the cart.
 */
export default function ShopPage({
  onNavigate,
  cartCount = 0,
  onCartChange,
}: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentlyAddedProductIds, setRecentlyAddedProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [vegetarianOnly, setVegetarianOnly] = useState(false);

  /**
   * Reloads products whenever the category or search filter changes.
   */
  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await getProducts({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchTerm || undefined,
      });
      setProducts(data.products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /**
   * Adds one product to the cart and briefly marks the card as added.
   */
  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({
        productId: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: 1,
        expiryDays: product.expiryDays,
        imageEmoji: product.imageEmoji,
      });
      await onCartChange?.();
      setRecentlyAddedProductIds((currentIds) =>
        currentIds.includes(product._id) ? currentIds : [...currentIds, product._id],
      );
      setTimeout(() => {
        setRecentlyAddedProductIds((currentIds) =>
          currentIds.filter((productId) => productId !== product._id),
        );
      }, 1800);
    } catch {
      // The page stays usable even if one add action fails.
    }
  };

  const visibleProducts = products.filter(
    (product) => !vegetarianOnly || product.category !== 'Meat',
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: 2 }}>Shop Groceries</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--t3)', fontFamily: 'var(--ff)' }}>
            Browse and add items to your cart
          </div>
        </div>
        <button
          onClick={() => onNavigate?.('cart')}
          style={{ padding: '8px 14px', border: '1px solid var(--bd)', borderRadius: 8, background: 'var(--s2)', color: 'var(--t1)', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--ff)', display: 'flex', alignItems: 'center', gap: 8 }}
          title="Go to cart"
        >
          <span aria-hidden="true">🛒</span>
          <span>Cart</span>
          <span style={{ minWidth: 22, height: 22, padding: '0 7px', borderRadius: 999, background: cartCount > 0 ? 'var(--g)' : 'var(--s1)', color: cartCount > 0 ? 'var(--gdk)' : 'var(--t3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, fontFamily: 'var(--ff)', lineHeight: 1 }}>
            {cartCount}
          </span>
        </button>
      </div>

      <input
        style={{ width: '100%', padding: '9px 12px', background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 8, color: 'var(--t1)', fontSize: '0.82rem', outline: 'none', marginBottom: 11 }}
        placeholder="Search products..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--ff)', fontSize: '0.76rem', color: 'var(--t2)', cursor: 'pointer' }}>
            <input type="checkbox" checked={vegetarianOnly} onChange={(event) => setVegetarianOnly(event.target.checked)} style={{ accentColor: 'var(--g)' }} />
            Vegetarian only
          </label>
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--t3)', fontFamily: 'var(--ff)' }}>
          Meat items hide when the toggle is on
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{ padding: '4px 12px', border: `1px solid ${selectedCategory === category ? 'rgba(34,197,94,.4)' : 'var(--bd)'}`, borderRadius: 99, fontSize: '0.68rem', cursor: 'pointer', background: selectedCategory === category ? 'rgba(34,197,94,.1)' : 'transparent', color: selectedCategory === category ? 'var(--g)' : 'var(--t3)', fontFamily: 'var(--ff)' }}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'var(--t3)', fontSize: '0.82rem', fontFamily: 'var(--ff)', padding: '20px 0' }}>
          Loading...
        </div>
      ) : visibleProducts.length === 0 ? (
        <div style={{ color: 'var(--t3)', fontSize: '0.82rem', fontFamily: 'var(--ff)', padding: '30px 0', textAlign: 'center' }}>
          No products match the current filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 9 }}>
          {visibleProducts.map((product) => {
            const wasJustAdded = recentlyAddedProductIds.includes(product._id);

            return (
              <div
                key={product._id}
                style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: 12, transition: 'all 0.15s' }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.borderColor = 'rgba(34,197,94,.4)';
                  event.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.borderColor = 'var(--bd)';
                  event.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{product.imageEmoji || '🛒'}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 500, marginBottom: 2 }}>{product.name}</div>
                <div style={{ fontSize: '0.64rem', color: 'var(--t3)' }}>
                  {product.category} · {product.unit}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--g)', fontFamily: 'var(--ff)', margin: '5px 0' }}>
                  Rs.{product.price}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--t3)', marginBottom: 7 }}>
                  Expires ~{product.expiryDays}d
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  style={{ width: '100%', padding: 6, border: wasJustAdded ? '1px solid rgba(34,197,94,.3)' : 'none', borderRadius: 7, background: wasJustAdded ? 'var(--s2)' : 'var(--g)', color: wasJustAdded ? 'var(--g)' : 'var(--gdk)', fontSize: '0.68rem', fontWeight: 700, fontFamily: 'var(--ff)', cursor: 'pointer' }}
                >
                  {wasJustAdded ? 'Added' : '+ Add to Cart'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
