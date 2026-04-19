import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api';
import PopupModal from '../components/PopupModal';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(String(user?.age ?? 30));
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [budget, setBudget] = useState(String(user?.monthlyBudget || 5000));
  const [size, setSize] = useState(String(user?.familySize || 1));
  const [prefs, setPrefs] = useState({
    vegetarian: user?.preferences?.vegetarian || false,
    vegan: user?.preferences?.vegan || false,
    glutenFree: user?.preferences?.glutenFree || false,
    nonVeg: user?.preferences?.nonVeg ?? true,
  });
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [pwBusy, setPwBusy] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [popup, setPopup] = useState<{ title: string; message: string; kind?: 'info' | 'error' | 'success' } | null>(null);

  const showPopup = (message: string, kind: 'info' | 'error' | 'success' = 'info', title = 'Notice') => {
    setPopup({ title, message, kind });
  };

  const initials = user?.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const readImage = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const MAX = 512;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(String(reader.result || ''));
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => reject(new Error('Could not read image'));
        img.src = String(reader.result || '');
      };
      reader.onerror = () => reject(new Error('Could not read image'));
      reader.readAsDataURL(file);
    });

  const handleAvatarChange = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showPopup('Please choose an image file', 'error', 'Invalid file');
      return;
    }
    setAvatarBusy(true);
    try {
      const dataUrl = await readImage(file);
      setAvatar(dataUrl);
    } catch {
      showPopup('Could not load image', 'error', 'Upload failed');
    }
    setAvatarBusy(false);
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      await updateProfile({
        name,
        age: parseInt(age, 10),
        avatar,
        familySize: parseInt(size, 10),
        monthlyBudget: parseInt(budget, 10),
        preferences: prefs,
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      showPopup(err?.response?.data?.message || 'Could not save profile', 'error', 'Save failed');
    }
    setBusy(false);
  };

  const handleChangePassword = async () => {
    if (!newPass || newPass.length < 6) {
      showPopup('New password must be at least 6 characters', 'error', 'Password not saved');
      return;
    }
    if (!currentPass) {
      showPopup('Please enter your current password', 'error', 'Password not saved');
      return;
    }
    if (currentPass === newPass) {
      showPopup('New password must be different from current password', 'error', 'Password not saved');
      return;
    }

    setPwBusy(true);
    try {
      await updateProfile({ currentPassword: currentPass, password: newPass });
      await refreshUser();
      setPwOpen(false);
      setCurrentPass('');
      setNewPass('');
      showPopup('Password changed successfully', 'success', 'Updated');
    } catch (err: any) {
      showPopup(err?.response?.data?.message || 'Password change failed', 'error', 'Password not saved');
    }
    setPwBusy(false);
  };

  const fi: React.CSSProperties = {
    width: '100%',
    padding: '9px 11px',
    background: 'var(--s2)',
    border: '1px solid var(--bd)',
    borderRadius: 8,
    color: 'var(--t1)',
    fontSize: '0.82rem',
    outline: 'none',
    marginTop: 4,
    marginBottom: 12,
  };
  const lb: React.CSSProperties = {
    fontSize: '0.66rem',
    color: 'var(--t3)',
    fontFamily: 'var(--ff)',
    letterSpacing: '0.06em',
  };
  const cd: React.CSSProperties = {
    background: 'var(--s1)',
    border: '1px solid var(--bd)',
    borderRadius: 'var(--r2)',
    padding: 18,
    marginBottom: 12,
  };

  return (
    <div>
      <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: 2 }}>Profile</div>
      <div style={{ fontSize: '0.76rem', color: 'var(--t3)', marginBottom: 20, fontFamily: 'var(--ff)' }}>Update your account settings</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <div style={cd}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  background: 'rgba(34,197,94,.12)',
                  border: '1px solid rgba(34,197,94,.28)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--ff)',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  color: 'var(--g)',
                  flexShrink: 0,
                }}
              >
                {avatar ? (
                  <img src={avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  initials
                )}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--ff)', fontWeight: 700, fontSize: '0.82rem', marginBottom: 4 }}>Profile picture</div>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 12px',
                    border: '1px solid var(--bd2)',
                    borderRadius: 9,
                    color: 'var(--t1)',
                    fontFamily: 'var(--ff)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  {avatarBusy ? 'Loading...' : avatar ? 'Change photo' : 'Upload photo'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => handleAvatarChange(e.target.files?.[0])}
                  />
                </label>
              </div>
            </div>
            <div style={lb}>FULL NAME</div>
            <input style={fi} value={name} onChange={e => setName(e.target.value)} />
            <div style={lb}>AGE</div>
            <input style={fi} type="number" min="0" max="120" value={age} onChange={e => setAge(e.target.value)} />
            <div style={lb}>USERNAME (cannot change)</div>
            <input style={{ ...fi, opacity: 0.5 }} value={user?.username || ''} disabled />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={lb}>FAMILY SIZE</div>
                <input style={{ ...fi, marginBottom: 0 }} type="number" min="1" max="20" value={size} onChange={e => setSize(e.target.value)} />
              </div>
              <div>
                <div style={lb}>MONTHLY BUDGET (Rs.)</div>
                <input style={{ ...fi, marginBottom: 0 }} type="number" value={budget} onChange={e => setBudget(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <button
                onClick={() => setPwOpen(true)}
                style={{
                  padding: '9px 18px',
                  background: 'transparent',
                  border: '1px solid var(--bd2)',
                  borderRadius: 9,
                  color: 'var(--t1)',
                  fontFamily: 'var(--ff)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Change Password
              </button>
              <button
                onClick={handleSave}
                disabled={busy}
                style={{
                  padding: '9px 22px',
                  background: 'var(--g)',
                  border: 'none',
                  borderRadius: 9,
                  color: 'var(--gdk)',
                  fontFamily: 'var(--ff)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  opacity: busy ? 0.7 : 1,
                }}
              >
                {busy ? 'Saving...' : 'Save Changes'}
              </button>
              {saved && <span style={{ color: 'var(--g)', fontFamily: 'var(--ff)', fontSize: '0.8rem' }}>Saved!</span>}
            </div>
          </div>
        </div>
        <div>
          <div style={cd}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.82rem', fontWeight: 700, marginBottom: 12 }}>Dietary preferences</div>
            {[
              ['vegetarian', 'Vegetarian'],
              ['vegan', 'Vegan'],
              ['glutenFree', 'Gluten free'],
              ['nonVeg', 'Non-vegetarian'],
            ].map(([k, label]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', marginBottom: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={prefs[k as keyof typeof prefs]} onChange={e => setPrefs({ ...prefs, [k]: e.target.checked })} style={{ accentColor: 'var(--g)', cursor: 'pointer' }} />
                {label}
              </label>
            ))}
          </div>
          <div style={cd}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.82rem', fontWeight: 700, marginBottom: 10 }}>Account info</div>
            {[
              ['Username', user?.username],
              ['Age', user?.age ?? 30],
              ['Member since', user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '—'],
              ['Family size', user?.familySize || 1],
              ['Added members', user?.familyMembers?.length || 0],
            ].map(([l, v]) => (
              <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--bd)', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--t3)' }}>{l}</span>
                <span style={{ fontFamily: 'var(--ff)', fontWeight: 500 }}>{String(v)}</span>
              </div>
            ))}
          </div>
          <div style={{ ...cd, marginBottom: 0 }}>
            <div style={{ fontFamily: 'var(--ff)', fontSize: '0.82rem', fontWeight: 700, marginBottom: 9 }}>Smart logic rules</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--t3)', lineHeight: 2.1, fontFamily: 'var(--ff)' }}>
              Frequency rule: suggest if overdue
              <br />
              Family size scales qty suggestions
              <br />
              Budget warning triggers at 80%
              <br />
              Expiry alert at 3 days remaining
            </div>
          </div>
        </div>
      </div>

      {pwOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.6)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setPwOpen(false)}
        >
          <div
            style={{
              width: 'min(420px, 100%)',
              background: 'var(--s1)',
              border: '1px solid var(--bd)',
              borderRadius: 18,
              padding: 20,
              boxShadow: '0 30px 80px rgba(0,0,0,.45)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontFamily: 'var(--ff)', fontWeight: 700, fontSize: '0.92rem', marginBottom: 16 }}>Change password</div>
            <label style={lb}>CURRENT PASSWORD</label>
            <input type="password" style={fi} value={currentPass} onChange={e => setCurrentPass(e.target.value)} />
            <label style={lb}>NEW PASSWORD</label>
            <input type="password" style={fi} value={newPass} onChange={e => setNewPass(e.target.value)} />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button
                onClick={() => setPwOpen(false)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--bd2)',
                  borderRadius: 8,
                  background: 'transparent',
                  color: 'var(--t1)',
                  cursor: 'pointer',
                  fontFamily: 'var(--ff)',
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={pwBusy}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: 8,
                  background: 'var(--g)',
                  color: 'var(--gdk)',
                  cursor: 'pointer',
                  fontFamily: 'var(--ff)',
                  fontWeight: 700,
                  opacity: pwBusy ? 0.7 : 1,
                }}
              >
                {pwBusy ? 'Saving...' : 'Update password'}
              </button>
            </div>
          </div>
        </div>
      )}
      <PopupModal
        open={!!popup}
        title={popup?.title || 'Notice'}
        message={popup?.message || ''}
        kind={popup?.kind || 'info'}
        onClose={() => setPopup(null)}
      />
    </div>
  );
}
