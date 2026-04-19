import React, { useEffect, useMemo, useRef, useState } from 'react';
import { addToCart } from '../api';
import { useAuth } from '../context/AuthContext';

type Diet = 'veg' | 'vegan' | 'nonveg';
type Slot = 'breakfast' | 'lunch' | 'dinner';

type Ingredient = {
  name: string;
  category: string;
  price: number;
  unit: string;
  imageEmoji: string;
  qty: number;
};

type Meal = {
  id: string;
  name: string;
  emoji: string;
  diet: Diet;
  slots: Slot[];
  ingredients: Ingredient[];
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const SLOTS: Slot[] = ['breakfast', 'lunch', 'dinner'];
const SCALE_PRESET = (n: number) => Math.max(1, Math.ceil(n / 2));

const MEALS: Record<Slot, Meal[]> = {
  breakfast: [
    {
      id: 'poha',
      name: 'Veg Poha',
      emoji: '🍚',
      diet: 'veg',
      slots: ['breakfast'],
      ingredients: [
        { name: 'Poha', category: 'Grains', price: 45, unit: '500g', imageEmoji: '🍚', qty: 1 },
        { name: 'Onions', category: 'Vegetables', price: 25, unit: 'kg', imageEmoji: '🧅', qty: 1 },
        { name: 'Peanuts', category: 'Snacks', price: 80, unit: '250g', imageEmoji: '🥜', qty: 1 },
        { name: 'Lemon', category: 'Fruits', price: 20, unit: 'piece', imageEmoji: '🍋', qty: 2 },
      ],
    },
    {
      id: 'oats',
      name: 'Masala Oats',
      emoji: '🥣',
      diet: 'vegan',
      slots: ['breakfast'],
      ingredients: [
        { name: 'Oats', category: 'Grains', price: 130, unit: '500g', imageEmoji: '🥣', qty: 1 },
        { name: 'Carrot', category: 'Vegetables', price: 30, unit: 'kg', imageEmoji: '🥕', qty: 1 },
        { name: 'Capsicum', category: 'Vegetables', price: 40, unit: 'kg', imageEmoji: '🫑', qty: 1 },
      ],
    },
    {
      id: 'idli',
      name: 'Idli + Sambar',
      emoji: '🥥',
      diet: 'veg',
      slots: ['breakfast'],
      ingredients: [
        { name: 'Rice Flour', category: 'Grains', price: 60, unit: 'kg', imageEmoji: '🌾', qty: 1 },
        { name: 'Toor Dal', category: 'Grains', price: 120, unit: 'kg', imageEmoji: '🫘', qty: 1 },
        { name: 'Coconut', category: 'Fruits', price: 40, unit: 'piece', imageEmoji: '🥥', qty: 1 },
      ],
    },
  ],
  lunch: [
    {
      id: 'rice-dal',
      name: 'Rice + Dal',
      emoji: '🍛',
      diet: 'vegan',
      slots: ['lunch'],
      ingredients: [
        { name: 'Basmati Rice', category: 'Grains', price: 90, unit: 'kg', imageEmoji: '🍚', qty: 1 },
        { name: 'Toor Dal', category: 'Grains', price: 120, unit: 'kg', imageEmoji: '🫘', qty: 1 },
        { name: 'Tomatoes', category: 'Vegetables', price: 30, unit: 'kg', imageEmoji: '🍅', qty: 1 },
      ],
    },
    {
      id: 'chapati-sabzi',
      name: 'Chapati + Sabzi',
      emoji: '🥙',
      diet: 'vegan',
      slots: ['lunch'],
      ingredients: [
        { name: 'Wheat Flour (Atta)', category: 'Grains', price: 55, unit: 'kg', imageEmoji: '🌾', qty: 1 },
        { name: 'Potatoes', category: 'Vegetables', price: 20, unit: 'kg', imageEmoji: '🥔', qty: 1 },
        { name: 'Onions', category: 'Vegetables', price: 25, unit: 'kg', imageEmoji: '🧅', qty: 1 },
      ],
    },
    {
      id: 'paneer-rice',
      name: 'Paneer Pulao',
      emoji: '🧀',
      diet: 'veg',
      slots: ['lunch'],
      ingredients: [
        { name: 'Basmati Rice', category: 'Grains', price: 90, unit: 'kg', imageEmoji: '🍚', qty: 1 },
        { name: 'Paneer', category: 'Dairy', price: 120, unit: '250g', imageEmoji: '🧀', qty: 1 },
        { name: 'Peas', category: 'Vegetables', price: 35, unit: 'kg', imageEmoji: '🫛', qty: 1 },
      ],
    },
  ],
  dinner: [
    {
      id: 'khichdi',
      name: 'Khichdi + Curd',
      emoji: '🍲',
      diet: 'veg',
      slots: ['dinner'],
      ingredients: [
        { name: 'Moong Dal', category: 'Grains', price: 110, unit: 'kg', imageEmoji: '🫘', qty: 1 },
        { name: 'Rice', category: 'Grains', price: 90, unit: 'kg', imageEmoji: '🍚', qty: 1 },
        { name: 'Curd / Yogurt', category: 'Dairy', price: 40, unit: '500g', imageEmoji: '🍶', qty: 1 },
      ],
    },
    {
      id: 'paneer-curry',
      name: 'Paneer Curry + Roti',
      emoji: '🍛',
      diet: 'veg',
      slots: ['dinner'],
      ingredients: [
        { name: 'Paneer', category: 'Dairy', price: 120, unit: '250g', imageEmoji: '🧀', qty: 1 },
        { name: 'Wheat Flour (Atta)', category: 'Grains', price: 55, unit: 'kg', imageEmoji: '🌾', qty: 1 },
        { name: 'Tomatoes', category: 'Vegetables', price: 30, unit: 'kg', imageEmoji: '🍅', qty: 1 },
      ],
    },
    {
      id: 'chicken-rice',
      name: 'Chicken Rice',
      emoji: '🍗',
      diet: 'nonveg',
      slots: ['dinner'],
      ingredients: [
        { name: 'Chicken', category: 'Meat', price: 200, unit: 'kg', imageEmoji: '🍗', qty: 1 },
        { name: 'Basmati Rice', category: 'Grains', price: 90, unit: 'kg', imageEmoji: '🍚', qty: 1 },
        { name: 'Onions', category: 'Vegetables', price: 25, unit: 'kg', imageEmoji: '🧅', qty: 1 },
      ],
    },
  ],
};

const PRESETS = {
  balanced: {
    breakfast: 'poha',
    lunch: 'rice-dal',
    dinner: 'khichdi',
  },
  veg: {
    breakfast: 'idli',
    lunch: 'paneer-rice',
    dinner: 'paneer-curry',
  },
  budget: {
    breakfast: 'oats',
    lunch: 'chapati-sabzi',
    dinner: 'khichdi',
  },
  protein: {
    breakfast: 'oats',
    lunch: 'rice-dal',
    dinner: 'chicken-rice',
  },
} as const;

type DayPlan = Record<Slot, string>;

const makeInitialSchedule = (): Record<(typeof DAYS)[number], DayPlan> =>
  DAYS.reduce((acc, d) => {
    acc[d] = { breakfast: 'poha', lunch: 'rice-dal', dinner: 'khichdi' };
    return acc;
  }, {} as Record<(typeof DAYS)[number], DayPlan>);

const isAllowedMeal = (meal: Meal, diet: { vegetarian: boolean; vegan: boolean; nonVeg: boolean }) => {
  if (diet.vegan) return meal.diet === 'vegan';
  if (diet.vegetarian) return meal.diet !== 'nonveg';
  return true;
};

export default function MealPlannerPage({ onCartChange }: { onCartChange?: () => void | Promise<void> }) {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<Record<(typeof DAYS)[number], DayPlan>>(makeInitialSchedule);
  const [day, setDay] = useState<(typeof DAYS)[number]>('Mon');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const initialized = useRef(false);

  const monthlyBudget = user?.monthlyBudget || 5000;
  const weeklyBudget = Math.max(1000, Math.round(monthlyBudget / 4));
  const scale = useMemo(() => {
    const familyScale = user?.familySize && user.familySize >= 6 ? 2 : 1;
    const budgetScale = weeklyBudget <= 3000 ? 1 : weeklyBudget <= 5000 ? 2 : 3;
    return Math.max(1, Math.min(familyScale, budgetScale));
  }, [user?.familySize, weeklyBudget]);

  const defaultPreset = useMemo(() => {
    if (weeklyBudget <= 3000) return 'budget' as const;
    if (weeklyBudget <= 5000) return 'balanced' as const;
    return 'protein' as const;
  }, [weeklyBudget]);

  const filteredMeals = useMemo(() => {
    const diet = user?.preferences || { vegetarian: false, vegan: false, nonVeg: true };
    return {
      breakfast: MEALS.breakfast.filter(m => isAllowedMeal(m, diet)),
      lunch: MEALS.lunch.filter(m => isAllowedMeal(m, diet)),
      dinner: MEALS.dinner.filter(m => isAllowedMeal(m, diet)),
    };
  }, [user?.preferences]);

  const allMealById = useMemo(() => {
    const map = new Map<string, Meal>();
    [...MEALS.breakfast, ...MEALS.lunch, ...MEALS.dinner].forEach(m => map.set(m.id, m));
    return map;
  }, []);

  const applyPreset = (preset: keyof typeof PRESETS, silent = false) => {
    const base = PRESETS[preset];
    const next = DAYS.reduce((acc, d) => {
      acc[d] = { ...base };
      return acc;
    }, {} as Record<(typeof DAYS)[number], DayPlan>);
    setSchedule(next);
    if (!silent) {
      setToast(`${preset.charAt(0).toUpperCase() + preset.slice(1)} plan applied`);
      setTimeout(() => setToast(''), 2000);
    }
  };

  useEffect(() => {
    if (initialized.current) return;
    applyPreset(defaultPreset, true);
    initialized.current = true;
  }, [defaultPreset]);

  const current = schedule[day];

  const groceryList = useMemo(() => {
    const basket = new Map<string, { name: string; category: string; price: number; imageEmoji: string; qty: number; unit: string }>();

    DAYS.forEach(d => {
      (Object.entries(schedule[d]) as [Slot, string][]).forEach(([slot, mealId]) => {
        const meal = allMealById.get(mealId);
        if (!meal) return;
        meal.ingredients.forEach(ing => {
          const key = ing.name;
          const currentQty = basket.get(key);
          const addQty = ing.qty * scale;
          if (currentQty) currentQty.qty += addQty;
          else basket.set(key, { name: ing.name, category: ing.category, price: ing.price, imageEmoji: ing.imageEmoji, qty: addQty, unit: ing.unit });
        });
      });
    });

    return [...basket.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [allMealById, schedule, scale]);

  const groceryTotal = groceryList.reduce((sum, item) => sum + item.price * item.qty, 0);
  const budgetLeft = weeklyBudget - groceryTotal;
  const budgetOver = groceryTotal > weeklyBudget;

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 2200);
  };

  const addBasketToCart = async () => {
    setBusy(true);
    try {
      for (const item of groceryList) {
        await addToCart({
          name: item.name,
          price: item.price,
          category: item.category,
          quantity: item.qty,
          expiryDays: 7,
          imageEmoji: item.imageEmoji,
        });
      }
      await onCartChange?.();
      showToast('Meal basket added to cart');
    } catch {
      showToast('Could not add basket to cart');
    }
    setBusy(false);
  };

  const updateMeal = (slot: Slot, mealId: string) => {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], [slot]: mealId } }));
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: 2 }}>
        Meal Planner
      </div>
      <div style={{ fontSize: '0.76rem', color: 'var(--t3)', marginBottom: 18, fontFamily: 'var(--ff)' }}>
        Pick breakfast, lunch, and dinner for each day. We&apos;ll turn it into a grocery basket that fits your weekly budget.
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {([
          ['balanced', 'Balanced week'],
          ['veg', 'Vegetarian'],
          ['budget', 'Budget saver'],
          ['protein', 'Protein focus'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => applyPreset(key)}
            style={{
              padding: '7px 12px',
              borderRadius: 999,
              border: '1px solid var(--bd)',
              background: 'var(--s1)',
              color: 'var(--t1)',
              fontFamily: 'var(--ff)',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.45fr 0.95fr', gap: 14, alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {DAYS.map(d => {
              const active = d === day;
              const filled = SLOTS.filter(slot => !!schedule[d][slot]).length;
              return (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  style={{
                    padding: '9px 12px',
                    borderRadius: 12,
                    border: `1px solid ${active ? 'rgba(34,197,94,.4)' : 'var(--bd)'}`,
                    background: active ? 'rgba(34,197,94,.08)' : 'var(--s1)',
                    color: 'var(--t1)',
                    fontFamily: 'var(--ff)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    minWidth: 84,
                    textAlign: 'left',
                  }}
                >
                  <div>{d}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--t3)', marginTop: 2 }}>{filled}/3 meals set</div>
                </button>
              );
            })}
          </div>

          <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 16, marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--ff)', fontSize: '0.85rem', fontWeight: 800, marginBottom: 4 }}>{day} plan</div>
            <div style={{ color: 'var(--t3)', fontFamily: 'var(--ff)', fontSize: '0.72rem', marginBottom: 14 }}>
              Family size factor: x{scale} · Weekly budget target: ₹{weeklyBudget.toLocaleString()}
            </div>

            {SLOTS.map(slot => (
              <div key={slot} style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--ff)', fontSize: '0.68rem', letterSpacing: '0.06em', color: 'var(--t3)', marginBottom: 6 }}>
                  {slot.toUpperCase()}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 8 }}>
                  {filteredMeals[slot].map(meal => {
                    const selected = current[slot] === meal.id;
                    return (
                      <button
                        key={meal.id}
                        onClick={() => updateMeal(slot, meal.id)}
                        style={{
                          textAlign: 'left',
                          border: `1px solid ${selected ? 'rgba(34,197,94,.4)' : 'var(--bd)'}`,
                          background: selected ? 'rgba(34,197,94,.08)' : 'var(--s2)',
                          borderRadius: 14,
                          padding: 12,
                          cursor: 'pointer',
                          color: 'var(--t1)',
                        }}
                      >
                        <div style={{ fontSize: '1.1rem', marginBottom: 6 }}>{meal.emoji}</div>
                        <div style={{ fontFamily: 'var(--ff)', fontWeight: 700, fontSize: '0.78rem', marginBottom: 4 }}>{meal.name}</div>
                        <div style={{ fontSize: '0.64rem', color: 'var(--t3)', fontFamily: 'var(--ff)' }}>{meal.ingredients.length} ingredients · ~₹{(meal.ingredients.reduce((s, ing) => s + ing.price * ing.qty, 0) * scale).toLocaleString()}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 16 }}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.82rem', fontWeight: 800, marginBottom: 10 }}>Selected day ingredients</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SLOTS.flatMap(slot => {
                const meal = allMealById.get(current[slot]);
                return meal?.ingredients.map(ing => (
                  <div key={`${slot}-${meal.id}-${ing.name}`} style={{ padding: '7px 10px', borderRadius: 999, border: '1px solid rgba(34,197,94,.18)', background: 'rgba(34,197,94,.06)', fontFamily: 'var(--ff)', fontSize: '0.72rem' }}>
                    {ing.imageEmoji} {ing.name}
                  </div>
                )) || [];
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ background: budgetOver ? 'rgba(245,158,11,.08)' : 'rgba(34,197,94,.08)', border: `1px solid ${budgetOver ? 'rgba(245,158,11,.22)' : 'rgba(34,197,94,.22)'}`, borderRadius: 'var(--r2)', padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
              <div style={{ fontFamily: 'var(--ff)', fontSize: '0.82rem', fontWeight: 800 }}>Weekly budget</div>
              <div style={{ fontFamily: 'var(--ff)', fontSize: '0.8rem', fontWeight: 700, color: budgetOver ? '#f59e0b' : 'var(--g)' }}>
                {budgetOver ? `Over by ₹${Math.max(0, -budgetLeft).toLocaleString()}` : `Left ₹${Math.max(0, budgetLeft).toLocaleString()}`}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--t3)', marginBottom: 3, fontFamily: 'var(--ff)' }}>
              <span>Target</span><span>₹{weeklyBudget.toLocaleString()}</span>
            </div>
            <div style={{ height: 4, background: 'var(--bd)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${Math.min(100, Math.round((groceryTotal / weeklyBudget) * 100))}%`, background: budgetOver ? '#f59e0b' : 'var(--g)', borderRadius: 2 }} />
            </div>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.74rem', color: 'var(--t3)' }}>
              Estimated basket: ₹{groceryTotal.toLocaleString()}
            </div>
          </div>

          <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 16 }}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.82rem', fontWeight: 800, marginBottom: 10 }}>Weekly grocery basket</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--t3)', fontFamily: 'var(--ff)', marginBottom: 12 }}>
              Auto-generated from all meals in the week.
            </div>
            <div style={{ maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
              {groceryList.map(item => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--bd)', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--ff)' }}>{item.imageEmoji} {item.name}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--t3)', fontFamily: 'var(--ff)' }}>{item.category} · {item.unit}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--ff)', fontWeight: 700, color: 'var(--g)', fontSize: '0.76rem' }}>x{item.qty}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--t3)' }}>₹{(item.price * item.qty).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--bd)' }}>
              <span style={{ fontFamily: 'var(--ff)', fontSize: '0.8rem', fontWeight: 700 }}>Estimated basket</span>
              <span style={{ fontFamily: 'var(--ff)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--g)' }}>₹{groceryTotal.toLocaleString()}</span>
            </div>
            {budgetOver && (
              <div style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.22)', borderRadius: 10, padding: '9px 11px', marginTop: 10, fontSize: '0.72rem', color: '#f59e0b', fontFamily: 'var(--ff)', lineHeight: 1.5 }}>
                This plan is above your weekly budget. Try <strong>Budget saver</strong> or reduce a few meal swaps.
              </div>
            )}
            <button
              onClick={addBasketToCart}
              disabled={busy || groceryList.length === 0}
              style={{
                width: '100%',
                marginTop: 12,
                padding: '10px 12px',
                border: 'none',
                borderRadius: 10,
                background: 'var(--g)',
                color: 'var(--gdk)',
                fontFamily: 'var(--ff)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                opacity: busy || groceryList.length === 0 ? 0.7 : 1,
              }}
            >
              {busy ? 'Adding to cart...' : 'Add basket to cart'}
            </button>
          </div>

          <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 16 }}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.82rem', fontWeight: 800, marginBottom: 10 }}>Why this helps</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--t3)', lineHeight: 1.9, fontFamily: 'var(--ff)' }}>
              • Keeps meals and shopping in one place<br />
              • Scales ingredients with family size<br />
              • Works with vegetarian and non-veg preferences<br />
              • Lets you fill Cart with one click
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'var(--s2)', border: '1px solid var(--bd2)', color: 'var(--t1)', padding: '9px 15px', borderRadius: 9, fontSize: '0.78rem', fontFamily: 'var(--ff)', zIndex: 999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
