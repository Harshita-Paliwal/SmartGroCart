import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Page } from '../App';

const NAV = [
  { id: 'dashboard' as Page, label: 'Dashboard' },
  { id: 'shop' as Page, label: 'Shop' },
  { id: 'cart' as Page, label: 'Cart' },
  { id: 'suggest' as Page, label: 'Smart Picks' },
  { id: 'meals' as Page, label: 'Meal Planner' },
  { id: 'family' as Page, label: 'Family' },
  { id: 'history' as Page, label: 'History' },
  { id: 'calendar' as Page, label: 'Calendar' },
  { id: 'profile' as Page, label: 'Profile' },
];

interface Props {
  page: Page;
  onNavigate: (p: Page) => void;
  cartCount: number;
  onLogout: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isMobile: boolean;
  isTablet: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function Sidebar({
  page,
  onNavigate,
  cartCount,
  onLogout,
  theme,
  onToggleTheme,
  isMobile,
  isTablet,
  open,
  onOpen,
  onClose,
}: Props) {
  const { user, logoutUser } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const initials = user?.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const first = user?.name.split(' ')[0] || 'User';

  const handleLogout = () => {
    logoutUser();
    onLogout();
    setConfirmOpen(false);
  };

  const sidebarBody = (
    <aside
      style={{
        width: isMobile ? 'min(88vw, 320px)' : isTablet ? 220 : 236,
        background: 'var(--s1)',
        borderRight: '1px solid var(--bd)',
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 0',
        flexShrink: 0,
        height: isMobile ? '100dvh' : '100vh',
      }}
    >
      <div
        style={{
          padding: '0 20px 16px',
          fontFamily: 'var(--ff)',
          fontWeight: 800,
          fontSize: '1.1rem',
          letterSpacing: '-0.04em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span>
          Smart<span style={{ color: 'var(--g)' }}>Gro</span>Cart
        </span>
        {isMobile && (
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--t2)', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Close
          </button>
        )}
      </div>
      <div style={{ padding: '0 14px 10px' }}>
        <button
          onClick={onToggleTheme}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '8px 12px',
            border: '1px solid var(--bd)',
            borderRadius: 10,
            background: 'var(--s2)',
            color: 'var(--t1)',
            fontSize: '0.74rem',
            fontFamily: 'var(--ff)',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
          <span style={{ color: 'var(--g)' }}>{theme === 'dark' ? 'Moon' : 'Sun'}</span>
        </button>
      </div>
      <div style={{ padding: '0 14px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', background: 'rgba(34,197,94,.15)', border: '1px solid rgba(34,197,94,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '0.72rem', color: 'var(--g)' }}>
          {user?.avatar ? <img src={user.avatar} alt={first} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 500 }}>{first}</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--t3)' }}>Family of {user?.familySize || 1}</div>
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--bd)', margin: '0 14px 8px' }} />
      <nav style={{ overflowY: 'auto', paddingRight: 4 }}>
        {NAV.map(n => (
          <div
            key={n.id}
            onClick={() => {
              onNavigate(n.id);
              if (isMobile) onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '9px 18px',
              fontSize: '0.8rem',
              color: page === n.id ? 'var(--t1)' : 'var(--t3)',
              cursor: 'pointer',
              borderLeft: `2px solid ${page === n.id ? 'var(--g)' : 'transparent'}`,
              background: page === n.id ? 'var(--s2)' : 'transparent',
              fontWeight: page === n.id ? 500 : 400,
              transition: 'all 0.15s',
            }}
          >
            {n.label}
            {n.id === 'cart' && cartCount > 0 && (
              <span style={{ marginLeft: 'auto', background: 'var(--g)', color: 'var(--gdk)', fontSize: '0.62rem', fontWeight: 800, padding: '1px 7px', borderRadius: 99, fontFamily: 'var(--ff)' }}>
                {cartCount}
              </span>
            )}
          </div>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', padding: '12px 14px 0' }}>
        <button
          onClick={() => setConfirmOpen(true)}
          style={{ width: '100%', padding: 8, border: '1px solid var(--bd)', borderRadius: 9, background: 'transparent', color: 'var(--t3)', fontSize: '0.74rem', cursor: 'pointer' }}
        >
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {isMobile ? (
        <>
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 14px',
              borderBottom: '1px solid var(--bd)',
              background: 'rgba(15,17,23,.92)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <button
              onClick={onOpen}
              style={{
                padding: '8px 10px',
                border: '1px solid var(--bd)',
                borderRadius: 10,
                background: 'var(--s1)',
                color: 'var(--t1)',
                cursor: 'pointer',
                fontFamily: 'var(--ff)',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              Menu
            </button>
            <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.04em' }}>
              <span style={{ color: '#fff' }}>Smart</span>
              <span style={{ color: 'var(--g)' }}>Gro</span>
              <span style={{ color: '#fff' }}>Cart</span>
            </div>
            <div style={{ minWidth: 56, textAlign: 'right', fontSize: '0.72rem', color: 'var(--t3)', fontFamily: 'var(--ff)' }}>
              {cartCount} cart
            </div>
          </div>

          {open && (
            <div
              onClick={onClose}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 40,
                background: 'rgba(0,0,0,.52)',
                display: 'flex',
              }}
            >
              <div onClick={e => e.stopPropagation()}>{sidebarBody}</div>
            </div>
          )}
        </>
      ) : (
        sidebarBody
      )}

      {confirmOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.62)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: 16,
          }}
          onClick={() => setConfirmOpen(false)}
        >
          <div
            style={{
              width: 'min(360px, 100%)',
              background: 'var(--s1)',
              border: '1px solid var(--bd)',
              borderRadius: 16,
              padding: 18,
              boxShadow: '0 25px 60px rgba(0,0,0,.45)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1rem', marginBottom: 8 }}>Sign out?</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--t3)', lineHeight: 1.5, marginBottom: 16 }}>
              This will log you out of SmartGroCart. You can sign back in anytime.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => setConfirmOpen(false)}
                style={{
                  padding: '8px 14px',
                  border: '1px solid var(--bd)',
                  borderRadius: 9,
                  background: 'transparent',
                  color: 'var(--t1)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  borderRadius: 9,
                  background: 'var(--g)',
                  color: 'var(--gdk)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
