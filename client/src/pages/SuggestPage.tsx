import React, { useEffect, useState } from 'react';
import { addToCart, getExpiryAlerts, getSuggestions } from '../api';
import { ExpiryAlert, SuggestionsResponse } from '../types/domain';
import useResponsive from '../utils/useResponsive';

type SuggestionTab = 'rules' | 'expiry';

interface SuggestPageProps {
  onCartChange?: () => void | Promise<void>;
}

/**
 * Shows rule-based suggestions and expiry reminders on a single screen.
 */
export default function SuggestPage({ onCartChange }: SuggestPageProps) {
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState<SuggestionTab>('rules');
  const [smartSuggestions, setSmartSuggestions] = useState<SuggestionsResponse | null>(null);
  const [expiryAlerts, setExpiryAlerts] = useState<ExpiryAlert[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    getSuggestions().then((response) => setSmartSuggestions(response.data)).catch(() => {});
    getExpiryAlerts().then((response) => setExpiryAlerts(response.data.alerts || [])).catch(() => {});
  }, []);

  /**
   * Displays a short-lived success toast after a cart action.
   */
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2200);
  };

  /**
   * Adds a suggestion directly to the cart using a lightweight custom item payload.
   */
  const addSuggestionToCart = async (name: string, price: number, category: string) => {
    try {
      await addToCart({
        name,
        price,
        category,
        quantity: 1,
        expiryDays: 7,
        imageEmoji: '🛒',
      });
      await onCartChange?.();
      showToast(`${name} added!`);
    } catch {
      // The toast is only used for successful add actions.
    }
  };

  /**
   * Builds the color-coded badge used beside each suggestion priority.
   */
  const getPriorityPillStyle = (priority: 'high' | 'medium' | 'low'): React.CSSProperties => ({
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

  const cardStyle: React.CSSProperties = {
    background: 'var(--s1)',
    border: '1px solid var(--bd)',
    borderRadius: 'var(--r2)',
    padding: 16,
    marginBottom: 12,
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: 2 }}>
        Smart Picks
      </div>
      <div style={{ fontSize: '0.76rem', color: 'var(--t3)', marginBottom: 18, fontFamily: 'var(--ff)' }}>
        Rule-based and expiry-aware personalised suggestions
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {([
          ['rules', 'Rule-based'],
          ['expiry', 'Expiry'],
        ] as [SuggestionTab, string][]).map(([tabId, label]) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            style={{ padding: '7px 14px', border: `1px solid ${activeTab === tabId ? 'rgba(34,197,94,.4)' : 'var(--bd)'}`, borderRadius: 99, fontSize: '0.7rem', cursor: 'pointer', background: activeTab === tabId ? 'rgba(34,197,94,.1)' : 'transparent', color: activeTab === tabId ? 'var(--g)' : 'var(--t3)', fontFamily: 'var(--ff)', fontWeight: 700 }}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'rules' && (
        <div>
          {smartSuggestions?.remainingBudget !== undefined && (
            <div style={{ background: 'rgba(99,102,241,.07)', border: '1px solid rgba(99,102,241,.18)', borderRadius: 'var(--r)', padding: '9px 13px', fontSize: '0.74rem', color: '#a5b4fc', marginBottom: 12, fontFamily: 'var(--ff)' }}>
              Remaining budget: <strong>Rs.{Math.max(0, smartSuggestions.remainingBudget).toLocaleString()}</strong>
            </div>
          )}

          {!smartSuggestions?.suggestions?.length ? (
            <div style={{ ...cardStyle, color: 'var(--t3)', fontFamily: 'var(--ff)', fontSize: '0.82rem' }}>
              Make purchases and we&apos;ll learn your habits!
            </div>
          ) : (
            <div style={cardStyle}>
              {smartSuggestions.suggestions.map((suggestion, index) => (
                <div key={`${suggestion.name}-${index}`} style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', flexWrap: isMobile ? 'wrap' : 'nowrap', gap: 9, padding: '8px 0', borderBottom: index < smartSuggestions.suggestions.length - 1 ? '1px solid var(--bd)' : 'none' }}>
                  <span style={{ fontSize: '1.3rem', width: 28, textAlign: 'center', flexShrink: 0 }}>
                    {suggestion.imageEmoji || '🛒'}
                  </span>
                  <div style={{ flex: 1, minWidth: isMobile ? 'calc(100% - 40px)' : 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>{suggestion.name}</div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--t3)', marginTop: 1 }}>
                      {suggestion.reason} · suggest x{suggestion.suggestedQty}
                    </div>
                  </div>
                  <span style={getPriorityPillStyle(suggestion.priority)}>{suggestion.priority}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--g)', fontFamily: 'var(--ff)' }}>
                    Rs.{suggestion.price}
                  </span>
                  <button
                    style={{ padding: '4px 9px', background: 'var(--g)', border: 'none', borderRadius: 5, color: 'var(--gdk)', fontSize: '0.64rem', fontWeight: 700, fontFamily: 'var(--ff)', cursor: 'pointer', flexShrink: 0, marginLeft: 8 }}
                    onClick={() => addSuggestionToCart(suggestion.name, suggestion.price, suggestion.category)}
                  >
                    +Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'expiry' && (
        <div style={cardStyle}>
          <div style={{ fontFamily: 'var(--ff)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12 }}>
            Items expiring soon
          </div>
          {expiryAlerts.length === 0 ? (
            <div style={{ color: 'var(--t3)', fontFamily: 'var(--ff)', fontSize: '0.8rem' }}>
              No items expiring in the next 3 days
            </div>
          ) : (
            expiryAlerts.map((alert, index) => (
              <div key={`${alert.name}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: 8, padding: '8px 0', borderBottom: index < expiryAlerts.length - 1 ? '1px solid var(--bd)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                    {alert.imageEmoji} {alert.name}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--t3)', marginTop: 2 }}>
                    {alert.category} · expires {alert.expiryDate}
                  </div>
                </div>
                <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: '0.64rem', fontWeight: 700, fontFamily: 'var(--ff)', background: alert.daysLeft === 0 ? 'rgba(239,68,68,.12)' : 'rgba(245,158,11,.12)', color: alert.daysLeft === 0 ? '#ef4444' : '#f59e0b' }}>
                  {alert.daysLeft === 0 ? 'Today!' : `${alert.daysLeft}d left`}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {toastMessage && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'var(--s2)', border: '1px solid var(--bd2)', color: 'var(--t1)', padding: '9px 15px', borderRadius: 9, fontSize: '0.78rem', fontFamily: 'var(--ff)', zIndex: 999 }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
