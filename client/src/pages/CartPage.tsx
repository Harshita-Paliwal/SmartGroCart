import React, { useCallback, useEffect, useState } from 'react';
import {
  addToCart,
  checkout,
  clearCart,
  getCart,
  getFamilyMembers,
  removeCartItem,
  updateCartItem,
} from '../api';
import { Page } from '../App';
import { useAuth } from '../context/AuthContext';
import { CartItem, CartSummaryResponse, FamilyMember } from '../types/domain';
import { getCartItemCount } from '../utils/cart';
import useResponsive from '../utils/useResponsive';

interface CartPageProps {
  onCartChange: (itemCount: number) => void | Promise<void>;
  onNavigate: (page: Page) => void;
}

interface SharedRequestFormState {
  forWhom: string;
  name: string;
  quantity: string;
  requestedBy: string;
}

interface RequesterOption {
  _id?: string;
  name: string;
}

export default function CartPage({ onCartChange, onNavigate }: CartPageProps) {
  const { user } = useAuth();
  const { isMobile, isTablet } = useResponsive();
  const [cartSummary, setCartSummary] = useState<CartSummaryResponse | null>(null);
  const [checkoutInProgress, setCheckoutInProgress] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [sharedRequest, setSharedRequest] = useState<SharedRequestFormState>({
    name: '',
    quantity: '1',
    requestedBy: 'Family',
    forWhom: 'Family',
  });

  const loadCart = useCallback(async () => {
    try {
      const { data } = await getCart();
      setCartSummary(data);
      onCartChange(getCartItemCount(data.cart?.items));
    } catch {
      setCartSummary(null);
    }
  }, [onCartChange]);

  useEffect(() => {
    loadCart();
    getFamilyMembers().then((response) => setFamilyMembers(response.data.familyMembers || [])).catch(() => {});
  }, [loadCart]);

  useEffect(() => {
    if (!user?.name) return;
    setSharedRequest((currentRequest) => ({
      ...currentRequest,
      requestedBy:
        currentRequest.requestedBy === 'Family' ? user.name : currentRequest.requestedBy,
      forWhom: currentRequest.forWhom === 'Family' ? 'Family' : currentRequest.forWhom,
    }));
  }, [user?.name]);

  const deleteCartItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      await loadCart();
    } catch {
      // keep page usable
    }
  };

  const changeItemQuantity = async (itemId: string, nextQuantity: number) => {
    if (nextQuantity < 1) {
      await deleteCartItem(itemId);
      return;
    }

    try {
      await updateCartItem(itemId, { quantity: nextQuantity });
      await loadCart();
    } catch {
      // keep page usable
    }
  };

  const handleCheckout = async () => {
    setCheckoutInProgress(true);
    try {
      await checkout();
      setCheckoutComplete(true);
      onCartChange(0);
    } catch {
      // keep page usable
    } finally {
      setCheckoutInProgress(false);
    }
  };

  const addSharedRequest = async () => {
    if (!sharedRequest.name.trim()) return;

    try {
      await addToCart({
        name: sharedRequest.name,
        category: 'Other',
        price: 0,
        quantity: Math.max(1, Number.parseInt(sharedRequest.quantity || '1', 10)),
        expiryDays: 7,
        imageEmoji: 'Cart',
        requestedBy: sharedRequest.requestedBy,
        addedBy: user?.name || 'You',
        forWhom: sharedRequest.forWhom,
      });
      setSharedRequest({
        name: '',
        quantity: '1',
        requestedBy: 'Family',
        forWhom: 'Family',
      });
      await loadCart();
    } catch {
      // keep page usable
    }
  };

  const items: CartItem[] = cartSummary?.cart?.items || [];
  const totalAmount = cartSummary?.total || 0;
  const monthlyBudget = cartSummary?.monthlyBudget || 5000;
  const budgetUsagePercent = Math.round((totalAmount / monthlyBudget) * 100);
  const requesterOptions: RequesterOption[] = [
    { name: 'Family' },
    { name: user?.name || 'You' },
    ...familyMembers,
  ];

  if (checkoutComplete) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <div style={{ textAlign: 'center', background: 'var(--s1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 'var(--r2)', padding: isMobile ? '28px 20px' : '40px 48px', width: 'min(100%, 520px)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>Done</div>
          <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.2rem', marginBottom: 8 }}>Order Placed!</div>
          <div style={{ color: 'var(--t3)', fontSize: '0.8rem', marginBottom: 20 }}>
            Expiry tracking started for all items.
          </div>
          <button
            onClick={() => {
              setCheckoutComplete(false);
              onNavigate('dashboard');
            }}
            style={{ padding: '9px 24px', background: 'var(--g)', border: 'none', borderRadius: 9, color: 'var(--gdk)', fontWeight: 800, fontFamily: 'var(--ff)', cursor: 'pointer' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: 2 }}>
        My Cart
      </div>
      <div style={{ fontSize: '0.76rem', color: 'var(--t3)', marginBottom: 20, fontFamily: 'var(--ff)' }}>
        {items.length} items
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: isMobile ? '40px 20px' : '60px 40px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>Cart</div>
          <div style={{ color: 'var(--t3)', fontFamily: 'var(--ff)', marginBottom: 16 }}>
            Your cart is empty
          </div>
          <button onClick={() => onNavigate('shop')} style={{ padding: '9px 22px', background: 'var(--g)', border: 'none', borderRadius: 9, color: 'var(--gdk)', fontWeight: 700, fontFamily: 'var(--ff)', cursor: 'pointer' }}>
            Go Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : 'minmax(0, 1fr) 280px', gap: 14 }}>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 16 }}>
            {items.map((item) => (
              <div key={item._id} style={{ display: 'flex', flexWrap: isMobile ? 'wrap' : 'nowrap', alignItems: isMobile ? 'flex-start' : 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--bd)' }}>
                <div style={{ fontSize: '1.4rem', width: 30, textAlign: 'center', flexShrink: 0 }}>{item.imageEmoji || 'Item'}</div>
                <div style={{ flex: 1, minWidth: isMobile ? 'calc(100% - 40px)' : 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--t3)', marginTop: 1 }}>
                    {item.category} · ~{item.expiryDays}d expiry
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--g)', marginTop: 2, fontFamily: 'var(--ff)', lineHeight: 1.5 }}>
                    Requested by {item.requestedBy || 'Family'} · Added by {item.addedBy || 'You'} · For {item.forWhom || 'Family'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => changeItemQuantity(item._id, item.quantity - 1)} style={{ width: 22, height: 22, border: '1px solid var(--bd)', borderRadius: 5, background: 'var(--s2)', color: 'var(--t1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>-</button>
                  <span style={{ fontFamily: 'var(--ff)', fontSize: '0.8rem', fontWeight: 700, minWidth: 18, textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button onClick={() => changeItemQuantity(item._id, item.quantity + 1)} style={{ width: 22, height: 22, border: '1px solid var(--bd)', borderRadius: 5, background: 'var(--s2)', color: 'var(--t1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>+</button>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--g)', fontFamily: 'var(--ff)', minWidth: 50, textAlign: isMobile ? 'left' : 'right' }}>
                  Rs.{(item.price * item.quantity).toLocaleString()}
                </div>
                <button onClick={() => deleteCartItem(item._id)} style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: '0.85rem', padding: 2 }}>
                  x
                </button>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 16, height: 'fit-content' }}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 14 }}>
              Order Summary
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--t3)', marginBottom: 3, fontFamily: 'var(--ff)' }}>
              <span>Budget usage</span>
              <span>{Math.min(100, budgetUsagePercent)}%</span>
            </div>
            <div style={{ height: 4, background: 'var(--bd)', borderRadius: 2, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ height: '100%', width: `${Math.min(100, budgetUsagePercent)}%`, background: budgetUsagePercent > 80 ? '#ef4444' : budgetUsagePercent > 60 ? '#f59e0b' : 'var(--g)', borderRadius: 2 }} />
            </div>

            <div style={{ background: 'var(--s2)', borderRadius: 'var(--r)', padding: 12 }}>
              {items.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: '0.76rem', color: 'var(--t3)', marginBottom: 6 }}>
                  <span style={{ minWidth: 0 }}>{item.name} x{item.quantity}</span>
                  <span style={{ flexShrink: 0 }}>Rs.{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--ff)', fontSize: '0.9rem', fontWeight: 700, paddingTop: 9, borderTop: '1px solid var(--bd)', marginTop: 4 }}>
                <span>Total</span>
                <span style={{ color: 'var(--g)' }}>Rs.{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {cartSummary?.budgetWarning && (
              <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 7, padding: '7px 11px', fontSize: '0.7rem', color: '#f87171', marginTop: 10, fontFamily: 'var(--ff)' }}>
                Over 80% of monthly budget!
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkoutInProgress}
              style={{ width: '100%', marginTop: 12, padding: 10, background: 'var(--g)', border: 'none', borderRadius: 9, color: 'var(--gdk)', fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', opacity: checkoutInProgress ? 0.7 : 1 }}
            >
              {checkoutInProgress ? 'Processing...' : 'Checkout'}
            </button>
            <button
              onClick={async () => {
                await clearCart();
                await loadCart();
              }}
              style={{ width: '100%', marginTop: 7, padding: 8, border: '1px solid var(--bd)', borderRadius: 9, background: 'transparent', color: 'var(--t3)', fontSize: '0.76rem', cursor: 'pointer', fontFamily: 'var(--ff)' }}
            >
              Clear Cart
            </button>

            <div style={{ marginTop: 12, borderTop: '1px solid var(--bd)', paddingTop: 12 }}>
              <div style={{ fontFamily: 'var(--ff)', fontSize: '0.78rem', fontWeight: 700, marginBottom: 8 }}>
                Shared family request
              </div>
              <input
                value={sharedRequest.name}
                onChange={(event) => setSharedRequest({ ...sharedRequest, name: event.target.value })}
                placeholder="Item name"
                style={{ width: '100%', padding: '8px 10px', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 8, color: 'var(--t1)', fontSize: '0.8rem', marginBottom: 8 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <select value={sharedRequest.requestedBy} onChange={(event) => setSharedRequest({ ...sharedRequest, requestedBy: event.target.value })} style={{ padding: '8px 10px', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 8, color: 'var(--t1)', fontSize: '0.78rem' }}>
                  {requesterOptions.map((member) => (
                    <option key={member._id || member.name} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
                <select value={sharedRequest.forWhom} onChange={(event) => setSharedRequest({ ...sharedRequest, forWhom: event.target.value })} style={{ padding: '8px 10px', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 8, color: 'var(--t1)', fontSize: '0.78rem' }}>
                  {requesterOptions.map((member) => (
                    <option key={member._id || member.name} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="number"
                min="1"
                value={sharedRequest.quantity}
                onChange={(event) => setSharedRequest({ ...sharedRequest, quantity: event.target.value })}
                style={{ width: '100%', padding: '8px 10px', background: 'var(--s2)', border: '1px solid var(--bd)', borderRadius: 8, color: 'var(--t1)', fontSize: '0.8rem', marginBottom: 8 }}
              />
              <button onClick={addSharedRequest} style={{ width: '100%', padding: 9, border: 'none', borderRadius: 9, background: 'var(--s2)', color: 'var(--g)', cursor: 'pointer', fontFamily: 'var(--ff)', fontWeight: 700, fontSize: '0.78rem' }}>
                Add shared request
              </button>
              <div style={{ fontSize: '0.64rem', color: 'var(--t3)', marginTop: 7, fontFamily: 'var(--ff)' }}>
                Use this for household requests that are not tied to a product card.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
