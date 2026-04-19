import React, { useEffect, useState } from 'react';

interface Props {
  onLogin: () => void;
  onRegister: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const pills = [
  'AI Suggestions',
  'Budget Tracking',
  'Expiry Alerts',
  'Family Profiles',
  'Cart Optimisation',
  'Analytics',
  'Dietary Filters',
  'Pantry Manager',
];

const modes = [
  {
    key: 'plan',
    title: 'Plan',
    subtitle: 'Predict what to buy next',
    color: '#22c55e',
    value: '93%',
  },
  {
    key: 'save',
    title: 'Save',
    subtitle: 'Keep the budget in range',
    color: '#a78bfa',
    value: '₹4,820',
  },
  {
    key: 'avoid',
    title: 'Avoid waste',
    subtitle: 'Catch expiry risks early',
    color: '#f59e0b',
    value: '3 days',
  },
] as const;

export default function LandingPage({ onLogin, onRegister, theme, onToggleTheme }: Props) {
  const [activeMode, setActiveMode] = useState<(typeof modes)[number]['key']>('plan');
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const isLightTheme = theme === 'light';

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPointer({ x, y });
    };

    window.addEventListener('pointermove', onMove);

    return () => {
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  const active = modes.find(m => m.key === activeMode)!;

  const uiTheme = isLightTheme
    ? {
        shell: 'linear-gradient(180deg, rgba(255,255,255,.94), rgba(244,248,244,.94))',
        ambient: `
          radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(34,197,94,.16), transparent 22%),
          radial-gradient(circle at 14% 18%, rgba(56,189,248,.12), transparent 24%),
          radial-gradient(circle at 84% 22%, rgba(167,139,250,.10), transparent 20%),
          linear-gradient(180deg, rgba(255,255,255,.86), rgba(244,248,244,.98))
        `,
        grid: 'linear-gradient(rgba(13,23,32,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,23,32,.04) 1px, transparent 1px)',
        halo: 'radial-gradient(ellipse, rgba(22,163,74,.10) 0%, transparent 70%)',
        glass: 'rgba(255,255,255,.9)',
        panel: 'rgba(255,255,255,.92)',
        muted: 'rgba(255,255,255,.74)',
        card: 'linear-gradient(180deg, rgba(255,255,255,.94), rgba(245,250,246,.98))',
        card2: 'rgba(255,255,255,.95)',
        border: 'rgba(219,230,221,.96)',
        borderSoft: 'rgba(219,230,221,.82)',
        shadow: '0 30px 80px rgba(15,23,42,.10)',
        previewGlow: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,.08), transparent 40%)',
        previewFloor: 'linear-gradient(180deg, rgba(245,250,246,0) 0%, rgba(245,250,246,.96) 100%)',
        modeInactive: 'rgba(255,255,255,.84)',
      }
    : {
        shell: 'var(--bg)',
        ambient: `
          radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(34,197,94,.18), transparent 24%),
          radial-gradient(circle at 15% 20%, rgba(56,189,248,.10), transparent 24%),
          radial-gradient(circle at 85% 25%, rgba(167,139,250,.10), transparent 20%),
          linear-gradient(180deg, rgba(8,12,18,.2), rgba(6,8,16,1))
        `,
        grid: 'linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)',
        halo: 'radial-gradient(ellipse,rgba(34,197,94,.11) 0%,transparent 68%)',
        glass: 'rgba(15,17,23,.72)',
        panel: 'linear-gradient(180deg, rgba(17,20,28,.95), rgba(12,14,20,.88))',
        muted: 'rgba(22,26,36,.72)',
        card: 'linear-gradient(180deg, rgba(22,26,36,.96), rgba(16,19,27,.95))',
        card2: 'rgba(17,20,28,.9)',
        border: 'var(--bd)',
        borderSoft: 'var(--bd)',
        shadow: '0 30px 80px rgba(0,0,0,.32)',
        previewGlow: 'radial-gradient(circle at 50% 50%, rgba(34,197,94,.07), transparent 44%)',
        previewFloor: 'linear-gradient(180deg, rgba(12,15,22,0) 0%, rgba(12,15,22,.96) 100%)',
        modeInactive: 'rgba(15,17,23,.75)',
      };

  const btnP: React.CSSProperties = {
    padding: '13px 30px',
    border: 'none',
    borderRadius: 'var(--r)',
    background: 'var(--g)',
    color: 'var(--gdk)',
    fontFamily: 'var(--ff)',
    fontWeight: 700,
    fontSize: '0.92rem',
    cursor: 'pointer',
  };

  const btnO: React.CSSProperties = {
    padding: '12px 24px',
    border: '1px solid var(--bd2)',
    borderRadius: 'var(--r)',
    background: isLightTheme ? 'rgba(255,255,255,.74)' : 'transparent',
    color: 'var(--t1)',
    fontSize: '0.88rem',
    cursor: 'pointer',
  };

  const surfaces = {
    sectionCard: isLightTheme ? 'rgba(255,255,255,.96)' : 'var(--s1)',
    pill: isLightTheme ? 'rgba(255,255,255,.9)' : 'var(--s1)',
  };

  return (
    <div style={{ minHeight: '100vh', background: uiTheme.shell, position: 'relative', overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: uiTheme.ambient,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: uiTheme.grid,
          backgroundSize: '80px 80px',
          maskImage: isLightTheme ? 'linear-gradient(180deg, rgba(0,0,0,.25), transparent 88%)' : 'linear-gradient(180deg, rgba(0,0,0,.5), transparent 88%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)', width: 760, height: 420, background: uiTheme.halo, pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 1440, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', gap: 16 }}>
          <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.04em' }}>
            Smart<span style={{ color: 'var(--g)' }}>Gro</span>Cart
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isLightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
              title={isLightTheme ? 'Switch to dark theme' : 'Switch to light theme'}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid var(--bd)',
                background: isLightTheme ? 'rgba(255,255,255,.82)' : 'rgba(15,17,23,.72)',
                color: 'var(--t1)',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                fontSize: '0.95rem',
                boxShadow: isLightTheme ? '0 10px 24px rgba(15,23,42,.08)' : 'none',
              }}
            >
              {isLightTheme ? '☾' : '☼'}
            </button>
            <button style={{ ...btnO, padding: '8px 18px', fontSize: '0.8rem' }} onClick={onLogin}>
              Login
            </button>
            <button style={{ ...btnP, padding: '8px 18px', fontSize: '0.8rem' }} onClick={onRegister}>
              Get Started
            </button>
          </div>
        </nav>

        <section style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 22, alignItems: 'center', padding: '0 0 10px' }}>
          <div style={{ textAlign: 'left', padding: '0 0 10px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 14px',
                border: '1px solid rgba(34,197,94,.3)',
                borderRadius: 99,
                background: isLightTheme ? 'rgba(34,197,94,.08)' : 'rgba(34,197,94,.07)',
                fontSize: '0.72rem',
                color: 'var(--g)',
                marginBottom: 22,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--g)', display: 'inline-block', animation: 'blink 1.8s ease-in-out infinite' }} />
              AI-Powered Grocery Intelligence
            </div>

            <h1 style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: 'clamp(3rem, 6.2vw, 5.6rem)', lineHeight: 0.92, letterSpacing: '-0.06em', marginBottom: 10, maxWidth: 820 }}>
              Your family&apos;s <span style={{ color: 'var(--g)' }}>smartest</span>
              <br />
              grocery companion
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--t2)', lineHeight: 1.75, maxWidth: 650, margin: '0 0 16px', fontWeight: 300 }}>
              Stop wasting money. SmartGroCart learns your family&apos;s habits, tracks budgets in real time, and tells you exactly what to buy before you even think of it.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-start', marginBottom: 10, flexWrap: 'wrap' }}>
              <button style={btnP} onClick={onRegister}>
                Start for free →
              </button>
              <button style={btnO} onClick={onLogin}>
                Sign in
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 0, paddingBottom: 4 }}>
              {modes.map(mode => (
                <button
                  key={mode.key}
                  onClick={() => setActiveMode(mode.key)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 999,
                    border: `1px solid ${activeMode === mode.key ? mode.color : 'var(--bd)'}`,
                    background: activeMode === mode.key ? `${mode.color}14` : uiTheme.modeInactive,
                    color: activeMode === mode.key ? 'var(--t1)' : 'var(--t3)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'transform .2s ease, border-color .2s ease, background .2s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  }}
                >
                  {mode.title}
                </button>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative', minHeight: 590, marginTop: -36 }}>
            <div
              style={{
                position: 'absolute',
                inset: '3% 4%',
                borderRadius: 26,
                background: uiTheme.panel,
                border: `1px solid ${uiTheme.border}`,
                boxShadow: uiTheme.shadow,
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${isLightTheme ? 'rgba(34,197,94,.10)' : 'rgba(34,197,94,.18)'}, transparent 38%)`, pointerEvents: 'none' }} />
              <div style={{ padding: 18, borderBottom: `1px solid ${uiTheme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {['#ef4444', '#f59e0b', '#22c55e'].map(c => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                  ))}
                  <div>
                    <div style={{ color: 'var(--t1)', fontSize: '0.84rem', fontFamily: 'var(--ff)', fontWeight: 700, letterSpacing: '-0.02em' }}>Live grocery command center</div>
                    <div style={{ color: 'var(--t3)', fontSize: '0.68rem', marginTop: 2 }}>Interactive snapshot of budgets, alerts, and recommendations</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.68rem', color: active.color, border: `1px solid ${active.color}33`, background: `${active.color}12`, padding: '6px 10px', borderRadius: 99, whiteSpace: 'nowrap' }}>
                  {active.subtitle}
                </div>
              </div>

              <div style={{ position: 'relative', height: 'calc(100% - 58px)', padding: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
                  {[
                    ['BUDGET USED', '43%', '#22c55e', 43],
                    ['AI SUGGESTIONS', '8', '#a78bfa', 70],
                    ['EXPIRY ALERTS', '3', '#f59e0b', 25],
                  ].map(([l, v, c, p]) => (
                    <div
                      key={l as string}
                      style={{
                        background: isLightTheme ? 'rgba(255,255,255,.95)' : uiTheme.card,
                        border: `1px solid ${uiTheme.border}`,
                        borderRadius: 18,
                        padding: 14,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: c as string, opacity: 0.72 }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                        <div style={{ fontSize: '0.62rem', color: 'var(--t3)', fontFamily: 'var(--ff)', letterSpacing: '0.09em' }}>{l}</div>
                        <div style={{ width: 8, height: 8, borderRadius: 999, background: c as string, boxShadow: `0 0 12px ${c as string}` }} />
                      </div>
                      <div style={{ fontFamily: 'var(--ff)', fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.05em', color: c as string, lineHeight: 1 }}>{v}</div>
                      <div style={{ height: 4, background: 'var(--bd)', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${p}%`, background: c as string, borderRadius: 2, animation: 'pulseWidth 2.8s ease-in-out infinite' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    position: 'relative',
                    height: 420,
                    borderRadius: '24px 24px 80px 80px',
                    background: isLightTheme ? 'linear-gradient(180deg, rgba(255,255,255,.96), rgba(245,250,246,.98))' : 'linear-gradient(180deg, rgba(22,26,36,.82), rgba(12,15,22,.95))',
                    border: `1px solid ${uiTheme.border}`,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: isLightTheme ? 'radial-gradient(circle at center, rgba(13,23,32,.04) 0 2px, transparent 2px)' : 'radial-gradient(circle at center, rgba(255,255,255,.04) 0 2px, transparent 2px)', backgroundSize: '26px 26px', opacity: 0.28 }} />
                  <div style={{ position: 'absolute', inset: 0, background: uiTheme.previewGlow, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', inset: 'auto 0 0 0', height: 108, borderBottomLeftRadius: 80, borderBottomRightRadius: 80, background: uiTheme.previewFloor, pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', inset: '9% 10% 12% 10%', border: '1px dashed rgba(34,197,94,.12)', borderRadius: '40px', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', left: '50%', top: '44%', transform: 'translate(-50%, -50%)', width: 202, height: 202, borderRadius: '50%', border: '1px solid rgba(34,197,94,.16)', boxShadow: '0 0 0 18px rgba(34,197,94,.03), 0 0 80px rgba(34,197,94,.12)' }} />
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '44%',
                      transform: 'translate(-50%, -50%)',
                      width: 202,
                      height: 202,
                      borderRadius: '50%',
                      background: isLightTheme
                        ? `radial-gradient(circle, ${active.color}20 0%, rgba(34,197,94,.10) 34%, rgba(255,255,255,.98) 72%)`
                        : `radial-gradient(circle, ${active.color}2d 0%, rgba(34,197,94,.12) 34%, rgba(12,14,20,.96) 72%)`,
                      border: `1px solid ${active.color}66`,
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: `0 0 80px ${active.color}1f`,
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '2.45rem', color: active.color, lineHeight: 1 }}>{active.value}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--t2)', marginTop: 8, letterSpacing: '0.09em', textTransform: 'uppercase' }}>{active.title}</div>
                    </div>
                  </div>

                  <div style={{ position: 'absolute', left: 18, top: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px #22c55e' }} />
                    <span style={{ color: 'var(--t1)', fontSize: '0.82rem', fontWeight: 700 }}>Fresh milk</span>
                  </div>
                  <div style={{ position: 'absolute', right: 18, top: 28, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#a78bfa', boxShadow: '0 0 12px #a78bfa' }} />
                    <span style={{ color: 'var(--t1)', fontSize: '0.82rem', fontWeight: 700 }}>Rice stock</span>
                  </div>
                  <div style={{ position: 'absolute', left: 24, bottom: 34, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 12px #f59e0b' }} />
                    <span style={{ color: 'var(--t1)', fontSize: '0.82rem', fontWeight: 700 }}>Buy 2 more</span>
                  </div>
                  <div style={{ position: 'absolute', right: 24, bottom: 34, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 12px #38bdf8' }} />
                    <span style={{ color: 'var(--t1)', fontSize: '0.82rem', fontWeight: 700 }}>3 members active</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
                  {[
                    ['Family scan', '3 members', '#38bdf8'],
                    ['Waste risk', 'Low', '#22c55e'],
                    ['Next shop', '2 days', '#a78bfa'],
                  ].map(([label, value, color]) => (
                    <div key={label as string} style={{ background: uiTheme.muted, border: `1px solid ${uiTheme.borderSoft}`, borderRadius: 20, padding: '11px 12px' }}>
                      <div style={{ fontSize: '0.62rem', color: 'var(--t3)', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontFamily: 'var(--ff)', fontSize: '0.98rem', fontWeight: 800, color: color as string }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '10px 0 26px' }}>
          <div style={{ overflow: 'hidden', padding: '8px 0 20px' }}>
            <div style={{ display: 'flex', gap: 10, animation: 'marquee 22s linear infinite', width: 'max-content' }}>
              {[...pills, ...pills].map((p, i) => (
                <div key={i} style={{ whiteSpace: 'nowrap', padding: '6px 16px', border: '1px solid var(--bd)', borderRadius: 99, fontSize: '0.74rem', color: 'var(--t3)', background: surfaces.pill, flexShrink: 0 }}>
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 28 }}>
            {[
              ['AI Suggestions', 'Claude AI reads purchase history to predict what you need'],
              ['Budget Tracker', 'Live monthly budget with warnings before you overspend'],
              ['Expiry Alerts', 'Reminders 3 days before items expire - nothing goes to waste'],
              ['Family Members', 'Add members with age and diet for smarter quantity suggestions'],
            ].map(([title, desc]) => (
              <div
                key={title}
                style={{
                  background: surfaces.sectionCard,
                  border: '1px solid var(--bd)',
                  borderRadius: 'var(--r2)',
                  padding: '18px 16px',
                  transition: 'transform .2s ease, border-color .2s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(34,197,94,.28)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--bd)';
                }}
              >
                <div style={{ fontFamily: 'var(--ff)', fontSize: '0.85rem', fontWeight: 700, marginBottom: 5 }}>{title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--t3)', lineHeight: 1.55 }}>{desc}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr .7fr', gap: 12 }}>
            <div style={{ background: isLightTheme ? 'rgba(255,255,255,.92)' : 'linear-gradient(180deg, rgba(17,20,28,.9), rgba(12,14,20,.96))', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 18, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: 'var(--ff)', fontWeight: 700, marginBottom: 4 }}>Interactive grocery pulse</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--t3)' }}>Hover the cards and switch the mode buttons above.</div>
                </div>
                <div style={{ fontSize: '0.76rem', color: active.color, border: `1px solid ${active.color}33`, padding: '6px 10px', borderRadius: 99, textAlign: 'right' }}>{active.subtitle}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, alignItems: 'end', minHeight: 170 }}>
                {[38, 62, 44, 80, 55].map((h, idx) => (
                  <div key={idx} style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
                    <div style={{ width: '100%', height: 150, display: 'flex', alignItems: 'end' }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${h}%`,
                          borderRadius: 16,
                          background: `linear-gradient(180deg, ${idx % 2 === 0 ? active.color : '#38bdf8'} 0%, rgba(15,17,23,.2) 100%)`,
                          boxShadow: `0 14px 30px ${idx % 2 === 0 ? active.color : '#38bdf8'}22`,
                          animation: `barFloat ${4.2 + idx * 0.2}s ease-in-out infinite`,
                        }}
                      />
                    </div>
                    <span style={{ color: 'var(--t3)', fontSize: '0.68rem' }}>D{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ background: isLightTheme ? 'rgba(255,255,255,.95)' : 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 18 }}>
                <div style={{ fontFamily: 'var(--ff)', fontWeight: 700, marginBottom: 10 }}>Live effects</div>
                <div style={{ display: 'grid', gap: 10 }}>
                  <div style={{ height: 8, borderRadius: 99, background: 'var(--bd)', overflow: 'hidden' }}>
                    <div style={{ width: '76%', height: '100%', background: active.color, animation: 'pulseWidth 2.2s ease-in-out infinite' }} />
                  </div>
                  <div style={{ height: 8, borderRadius: 99, background: 'var(--bd)', overflow: 'hidden' }}>
                    <div style={{ width: '58%', height: '100%', background: '#38bdf8', animation: 'pulseWidth 2.6s ease-in-out infinite' }} />
                  </div>
                  <div style={{ height: 8, borderRadius: 99, background: 'var(--bd)', overflow: 'hidden' }}>
                    <div style={{ width: '84%', height: '100%', background: '#f59e0b', animation: 'pulseWidth 2.4s ease-in-out infinite' }} />
                  </div>
                </div>
              </div>
              <div style={{ background: isLightTheme ? 'rgba(255,255,255,.95)' : 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 18 }}>
                <div style={{ fontFamily: 'var(--ff)', fontWeight: 700, marginBottom: 8 }}>Click response</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--t3)', lineHeight: 1.6 }}>
                  Every main call-to-action, mode chip, and floating card reacts to your pointer so the landing page feels alive instead of flat.
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer style={{ width: '100%', borderTop: '1px solid var(--bd)', background: isLightTheme ? 'rgba(255,255,255,.72)' : 'rgba(6,10,16,.82)', backdropFilter: 'blur(10px)', marginTop: 18 }}>
          <div style={{ width: '100%', padding: '22px 0', display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', color: 'var(--t3)', fontSize: '0.76rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, color: 'var(--t1)', marginBottom: 6 }}>SmartGroCart</div>
              <div>AI-powered grocery planning for modern families.</div>
            </div>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              <span>Budget tracking</span>
              <span>Expiry alerts</span>
              <span>Family profiles</span>
              <span>MongoDB + MERN stack</span>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
        @keyframes marquee { to { transform: translateX(-50%); } }
        @keyframes barFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes pulseWidth { 0%,100% { filter: brightness(1); opacity: .9; } 50% { filter: brightness(1.2); opacity: 1; } }
      `}</style>
    </div>
  );
}
