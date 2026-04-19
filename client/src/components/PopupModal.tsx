import React from 'react';

interface Props {
  open: boolean;
  title?: string;
  message: string;
  kind?: 'info' | 'error' | 'success';
  onClose: () => void;
}

export default function PopupModal({ open, title = 'Notice', message, kind = 'info', onClose }: Props) {
  if (!open) return null;

  const accent = kind === 'error' ? '#ef4444' : kind === 'success' ? '#22c55e' : 'var(--g)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.58)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 2000,
        padding: 20,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        style={{
          width: 'min(420px, 100%)',
          background: 'var(--s1)',
          border: '1px solid var(--bd)',
          borderRadius: 20,
          padding: 22,
          boxShadow: '0 30px 80px rgba(0,0,0,.35)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: accent, boxShadow: `0 0 0 4px ${accent}18` }} />
          <div id="popup-title" style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1rem', color: 'var(--t1)' }}>
            {title}
          </div>
        </div>
        <div style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--t2)', marginBottom: 18 }}>
          {message}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderRadius: 10,
              background: accent,
              color: 'var(--gdk)',
              fontFamily: 'var(--ff)',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
