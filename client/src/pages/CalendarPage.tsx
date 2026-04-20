import React, { useEffect, useMemo, useState } from 'react';
import { getPurchases } from '../api';
import useResponsive from '../utils/useResponsive';

type DayMap = Record<string, { items: any[]; total: number }>;

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const labelDay = (d: Date) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });

export default function CalendarPage() {
  const today = new Date();
  const { isMobile, isTablet } = useResponsive();
  const [monthOffset, setMonthOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dayMap, setDayMap] = useState<DayMap>({});
  const [selected, setSelected] = useState<string>(dayKey(today));
  const [monthPurchases, setMonthPurchases] = useState<any[]>([]);

  const viewDate = useMemo(() => {
    const d = new Date(today);
    d.setMonth(d.getMonth() + monthOffset);
    d.setDate(1);
    return d;
  }, [monthOffset]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await getPurchases({ month: monthKey(viewDate), limit: 60 });
        if (!active) return;
        const purchases = data.purchases || [];
        setMonthPurchases(purchases);
        const grouped: DayMap = {};
        for (const p of purchases) {
          const k = dayKey(new Date(p.createdAt));
          if (!grouped[k]) grouped[k] = { items: [], total: 0 };
          grouped[k].total += p.totalAmount || 0;
          grouped[k].items.push(...(p.items || []));
        }
        setDayMap(grouped);
        const currentKey = dayKey(new Date());
        if (monthOffset === 0) setSelected(currentKey);
        else if (!grouped[selected]) {
          const firstKey = Object.keys(grouped).sort()[0];
          setSelected(firstKey || dayKey(viewDate));
        }
      } catch {
        if (active) {
          setMonthPurchases([]);
          setDayMap({});
        }
      }
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, [monthOffset, selected, viewDate]);

  const year = viewDate.getFullYear();
  const monthName = viewDate.toLocaleDateString('en-IN', { month: 'long' });
  const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const last = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const startPad = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const totalDays = last.getDate();
  const cells: Array<Date | null> = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let i = 1; i <= totalDays; i++) cells.push(new Date(year, viewDate.getMonth(), i));

  const selectedItems = dayMap[selected]?.items || [];
  const selectedTotal = dayMap[selected]?.total || 0;
  const selectedDateObj = selectedItems.length || selected.startsWith(monthKey(viewDate))
    ? new Date(selected)
    : new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);

  const monthSpend = monthPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const activeDays = Object.keys(dayMap).length;

  const emojiLine = (items: any[]) => {
    const emojis = items.slice(0, 4).map(item => item.imageEmoji || 'Item');
    if (!emojis.length) return 'No purchases';
    return emojis.join(' ');
  };

  return (
    <div>
      <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: 2 }}>
        Calendar
      </div>
      <div style={{ fontSize: '0.76rem', color: 'var(--t3)', marginBottom: 18, fontFamily: 'var(--ff)' }}>
        A month view of what was bought each day.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : '1.5fr 0.9fr', gap: 14, alignItems: 'start' }}>
        <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: 10, marginBottom: 14 }}>
            <button onClick={() => setMonthOffset(v => v - 1)} style={{ padding: '7px 11px', border: '1px solid var(--bd)', borderRadius: 9, background: 'transparent', color: 'var(--t1)', cursor: 'pointer', fontFamily: 'var(--ff)', fontWeight: 700 }}>
              Previous
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1rem' }}>{monthName} {year}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--t3)', fontFamily: 'var(--ff)' }}>{activeDays} active days · Rs.{monthSpend.toLocaleString()} spent</div>
            </div>
            <button onClick={() => setMonthOffset(v => v + 1)} style={{ padding: '7px 11px', border: '1px solid var(--bd)', borderRadius: 9, background: 'transparent', color: 'var(--t1)', cursor: 'pointer', fontFamily: 'var(--ff)', fontWeight: 700 }}>
              Next
            </button>
          </div>

          <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
            <div style={{ minWidth: isMobile ? 640 : 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 8 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} style={{ fontSize: '0.65rem', color: 'var(--t3)', textAlign: 'center', fontFamily: 'var(--ff)', letterSpacing: '0.04em' }}>{d}</div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                {cells.map((date, idx) => {
                  if (!date) return <div key={`pad-${idx}`} style={{ minHeight: 88, borderRadius: 14, background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.02)' }} />;
                  const key = dayKey(date);
                  const dayInfo = dayMap[key];
                  const isToday = key === dayKey(today);
                  const isSelected = key === selected;
                  const hasItems = !!dayInfo;
                  const chip = emojiLine(dayInfo?.items || []);
                  return (
                    <button
                      key={key}
                      onClick={() => setSelected(key)}
                      style={{
                        minHeight: 88,
                        borderRadius: 14,
                        border: `1px solid ${isSelected ? 'rgba(34,197,94,.45)' : hasItems ? 'rgba(34,197,94,.18)' : 'var(--bd)'}`,
                        background: isSelected ? 'rgba(34,197,94,.08)' : 'var(--s2)',
                        padding: 10,
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: 'var(--t1)',
                        boxShadow: isToday ? '0 0 0 1px rgba(34,197,94,.18) inset' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 6 }}>
                        <span style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '0.86rem' }}>{date.getDate()}</span>
                        {isToday && <span style={{ fontSize: '0.62rem', color: 'var(--g)', fontFamily: 'var(--ff)' }}>Today</span>}
                      </div>
                      <div style={{ fontSize: '0.92rem', lineHeight: 1.1, minHeight: 24 }}>{hasItems ? chip : '.'}</div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--t3)', marginTop: 6, fontFamily: 'var(--ff)' }}>
                        {hasItems ? `${dayInfo.items.length} items` : 'No purchases'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 16 }}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.82rem', fontWeight: 800, marginBottom: 10 }}>Day details</div>
            {loading ? (
              <div style={{ color: 'var(--t3)', fontFamily: 'var(--ff)', fontSize: '0.8rem' }}>Loading...</div>
            ) : selectedItems.length === 0 ? (
              <div>
                <div style={{ fontFamily: 'var(--ff)', fontSize: '0.9rem', fontWeight: 700, marginBottom: 6 }}>{labelDay(selectedDateObj)}</div>
                <div style={{ color: 'var(--t3)', fontFamily: 'var(--ff)', fontSize: '0.78rem' }}>No purchases on this day.</div>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: 'var(--ff)', fontSize: '0.9rem', fontWeight: 700, marginBottom: 6 }}>{labelDay(new Date(selected))}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--t3)', marginBottom: 10, fontFamily: 'var(--ff)' }}>
                  Rs.{selectedTotal.toLocaleString()} total across {selectedItems.length} items
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 180, overflowY: 'auto', paddingRight: 4 }}>
                  {selectedItems.map((item: any, i: number) => (
                    <div key={i} style={{ padding: '7px 10px', borderRadius: 999, background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.18)', fontFamily: 'var(--ff)', fontSize: '0.72rem' }}>
                      {item.imageEmoji || 'Item'} {item.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 16 }}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.82rem', fontWeight: 800, marginBottom: 10 }}>This month at a glance</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--t3)', lineHeight: 1.9, fontFamily: 'var(--ff)' }}>
              Active days: {activeDays}<br />
              Total purchases: {monthPurchases.length}<br />
              Month spend: Rs.{monthSpend.toLocaleString()}<br />
              Tap any date to see the exact items bought that day.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
