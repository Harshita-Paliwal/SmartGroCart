import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getExpiryAlerts, getPurchaseStats, getSuggestions } from '../api';
import { Page } from '../App';
import { ExpiryAlert, PurchaseStatsResponse, SuggestionItem, SuggestionsResponse } from '../types/domain';

const cardStyle: React.CSSProperties = {
  background: 'var(--s1)',
  border: '1px solid var(--bd)',
  borderRadius: 'var(--r2)',
  padding: 16,
  marginBottom: 12,
};

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

/**
 * Summarises budget usage, smart suggestions, and recent shopping insights.
 */
export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const [purchaseStats, setPurchaseStats] = useState<PurchaseStatsResponse | null>(null);
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<SuggestionsResponse | null>(null);

  useEffect(() => {
    getPurchaseStats().then((response) => setPurchaseStats(response.data)).catch(() => {});
    getExpiryAlerts().then((response) => setExpiryAlerts(response.data.alerts || [])).catch(() => {});
    getSuggestions().then((response) => setSmartSuggestions(response.data)).catch(() => {});
  }, []);

  const monthlySpend = smartSuggestions?.monthlySpend || 0;
  const remainingBudget = (user?.monthlyBudget || 0) - monthlySpend;
  const budgetUsedPercent = user?.monthlyBudget
    ? Math.round((monthlySpend / user.monthlyBudget) * 100)
    : 0;
  const monthlyBars = purchaseStats?.monthlyStats || [];
  const isFirstDayOfMonth = new Date().getDate() === 1;

  /**
   * Builds the color-coded badge used beside each suggestion priority.
   */
  const getPriorityPillStyle = (priority: SuggestionItem['priority']): React.CSSProperties => ({
    padding: '2px 7px',
    borderRadius: 99,
    fontSize: '0.62rem',
    fontWeight: 700,
    fontFamily: 'var(--ff)',
    background:
      priority === 'high'
        ? 'rgba(239,68,68,.12)'
        : priority === 'medium'
          ? 'rgba(245,158,11,.12)'
          : 'rgba(34,197,94,.12)',
    color: priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : 'var(--g)',
  });

  return (
    <div>
      <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: 2 }}>
        Welcome back, {user?.name?.split(' ')[0]}!
      </div>
      <div style={{ fontSize: '0.76rem', color: 'var(--t3)', marginBottom: 20, fontFamily: 'var(--ff)' }}>
        Family of {user?.familySize} · Budget Rs.{user?.monthlyBudget?.toLocaleString()}/month
      </div>

      {isFirstDayOfMonth && (
        <div style={{ background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.22)', borderRadius: 'var(--r)', padding: '10px 14px', marginBottom: 14, fontFamily: 'var(--ff)', fontSize: '0.78rem', color: 'var(--g)' }}>
          New month started. Your budget and suggestion calculations are now using this month&apos;s spend.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 18 }}>
        {[
          ['SPENT', `Rs.${monthlySpend.toLocaleString()}`, '#22c55e'],
          ['REMAINING', `Rs.${Math.max(0, remainingBudget).toLocaleString()}`, remainingBudget < 0 ? '#ef4444' : '#f59e0b'],
          ['BUDGET USED', `${budgetUsedPercent}%`, budgetUsedPercent > 80 ? '#ef4444' : 'var(--t1)'],
          ['FAMILY', `${user?.familySize || 1} members`, 'var(--t1)'],
        ].map(([label, value, color]) => (
          <div key={label} style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: 14 }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--t3)', fontFamily: 'var(--ff)', letterSpacing: '0.06em', marginBottom: 5 }}>{label}</div>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: String(color) }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={cardStyle}>
          <div style={{ fontFamily: 'var(--ff)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 10 }}>Suggested for you</div>
          {smartSuggestions?.suggestions?.length ? (
            smartSuggestions.suggestions.slice(0, 5).map((suggestion, index) => (
              <div key={`${suggestion.name}-${index}`} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 0', borderBottom: index < 4 ? '1px solid var(--bd)' : 'none' }}>
                <span style={{ fontSize: '1.3rem', width: 28, textAlign: 'center', flexShrink: 0 }}>
                  {suggestion.imageEmoji || '🛒'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{suggestion.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--t3)', marginTop: 1 }}>{suggestion.reason}</div>
                </div>
                <span style={getPriorityPillStyle(suggestion.priority)}>{suggestion.priority}</span>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--t3)', fontSize: '0.78rem', padding: '12px 0', fontFamily: 'var(--ff)' }}>
              Make purchases and we&apos;ll learn your habits.
            </div>
          )}
          <button onClick={() => onNavigate('suggest')} style={{ marginTop: 10, padding: '6px 14px', background: 'var(--g)', border: 'none', borderRadius: 8, color: 'var(--gdk)', fontWeight: 700, fontFamily: 'var(--ff)', fontSize: '0.75rem', cursor: 'pointer' }}>
            View All Smart Picks →
          </button>
        </div>

        <div>
          <div style={cardStyle}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 10 }}>Monthly spending</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 64, marginBottom: 4 }}>
              {monthlyBars.length
                ? monthlyBars.map((monthlyBar) => {
                    const maxSpend = Math.max(...monthlyBars.map((entry) => entry.total));
                    const barHeight = maxSpend ? Math.round((monthlyBar.total / maxSpend) * 60) : 4;

                    return (
                      <div key={monthlyBar._id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <div style={{ width: '100%', height: barHeight, background: 'var(--g)', borderRadius: '3px 3px 0 0', minHeight: 4 }} />
                        <span style={{ fontSize: '0.58rem', color: 'var(--t3)', fontFamily: 'var(--ff)' }}>
                          {monthlyBar._id?.slice(5)}
                        </span>
                      </div>
                    );
                  })
                : [0.3, 0.4, 0.5, 0.62, 0.47, 0.65].map((heightRatio, index) => (
                    <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                      <div style={{ width: '100%', height: Math.round(heightRatio * 60), background: 'var(--g)', borderRadius: '3px 3px 0 0', opacity: 0.3 + heightRatio * 0.5 }} />
                      <span style={{ fontSize: '0.58rem', color: 'var(--t3)', fontFamily: 'var(--ff)' }}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                      </span>
                    </div>
                  ))}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--t3)', fontFamily: 'var(--ff)' }}>Rs. monthly spend</div>
          </div>

          <div style={{ ...cardStyle, marginBottom: 0 }}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 10 }}>
              Expiry alerts ({expiryAlerts.length})
            </div>
            {expiryAlerts.length === 0 ? (
              <div style={{ color: 'var(--t3)', fontSize: '0.76rem', fontFamily: 'var(--ff)' }}>
                No items expiring soon.
              </div>
            ) : (
              expiryAlerts.map((alert, index) => (
                <div key={`${alert.name}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: index < expiryAlerts.length - 1 ? '1px solid var(--bd)' : 'none', fontSize: '0.78rem' }}>
                  <span>
                    {alert.imageEmoji} {alert.name}
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: '0.64rem', fontWeight: 700, fontFamily: 'var(--ff)', background: alert.daysLeft === 0 ? 'rgba(239,68,68,.12)' : 'rgba(245,158,11,.12)', color: alert.daysLeft === 0 ? '#ef4444' : '#f59e0b' }}>
                    {alert.daysLeft}d
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontFamily: 'var(--ff)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12 }}>
          Budget by category
        </div>
        {(purchaseStats?.categoryStats?.length
          ? purchaseStats.categoryStats.slice(0, 5)
          : [
              { _id: 'Vegetables', total: 55 },
              { _id: 'Dairy', total: 38 },
              { _id: 'Grains', total: 74 },
              { _id: 'Meat', total: 32 },
            ]).map((categoryStat, index, list) => {
          const maxCategorySpend = list[0]?.total || 1;
          const widthPercent = Math.round((categoryStat.total / maxCategorySpend) * 100);

          return (
            <div key={`${categoryStat._id}-${index}`} style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--t3)', marginBottom: 3, fontFamily: 'var(--ff)' }}>
                <span>{categoryStat._id}</span>
                <span>Rs.{categoryStat.total.toLocaleString()}</span>
              </div>
              <div style={{ height: 4, background: 'var(--bd)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${widthPercent}%`, background: widthPercent > 70 ? '#f59e0b' : 'var(--g)', borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
