import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addFamilyMember, deleteFamilyMember, getFamilyMembers, updateFamilyMember } from '../api';

interface Member {
  _id?: string;
  memberId?: string;
  name: string;
  age: number;
  relation: string;
  diet: string;
  avatar?: string;
  requestedItems?: { name: string; requestedAt: string }[];
}

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
  marginBottom: 10,
};

const lb: React.CSSProperties = {
  fontSize: '0.66rem',
  color: 'var(--t3)',
  fontFamily: 'var(--ff)',
  letterSpacing: '0.06em',
};

export default function FamilyPage() {
  const { user, refreshUser } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', age: '', relation: 'Spouse', diet: 'No restriction', avatar: '' });
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [toast, setToast] = useState('');

  const load = async () => {
    try {
      const { data } = await getFamilyMembers();
      setMembers(data.familyMembers);
      await refreshUser();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 2200);
  };

  const initials = (n: string) => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

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

  const openAdd = () => {
    setMode('add');
    setEditingId(null);
    setForm({ name: '', age: '', relation: 'Spouse', diet: 'No restriction', avatar: '' });
    setModal(true);
  };

  const openEdit = (m: Member) => {
    setMode('edit');
    setEditingId(m._id || null);
    setForm({
      name: m.name,
      age: String(m.age),
      relation: m.relation,
      diet: m.diet,
      avatar: m.avatar || '',
    });
    setModal(true);
  };

  const handleAvatarChange = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file');
      return;
    }
    setAvatarBusy(true);
    try {
      const dataUrl = await readImage(file);
      setForm(prev => ({ ...prev, avatar: dataUrl }));
    } catch {
      showToast('Could not load image');
    }
    setAvatarBusy(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.age) {
      showToast('Enter name and age');
      return;
    }
    try {
      const payload = { ...form, age: parseInt(form.age, 10), avatar: form.avatar };
      if (mode === 'add') {
        await addFamilyMember(payload);
      } else if (editingId) {
        await updateFamilyMember(editingId, payload);
      }
      await load();
      setModal(false);
      setForm({ name: '', age: '', relation: 'Spouse', diet: 'No restriction', avatar: '' });
      showToast(mode === 'add' ? `${form.name} added!` : `${form.name} updated!`);
    } catch {
      // ignore
    }
  };

  const handleDel = async (id: string) => {
    try {
      await deleteFamilyMember(id);
      await load();
    } catch {
      // ignore
    }
  };

  const requestDelete = (member: Member) => {
    setDeleteTarget(member);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    await handleDel(deleteTarget._id);
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const self: Member = {
    name: user?.name || 'You',
    age: 30,
    relation: 'Account owner',
    diet: user?.preferences?.vegetarian ? 'Vegetarian' : 'No restriction',
    avatar: user?.avatar || '',
  };

  return (
    <div>
      <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em', marginBottom: 2 }}>Family Members</div>
      <div style={{ fontSize: '0.76rem', color: 'var(--t3)', marginBottom: 20, fontFamily: 'var(--ff)' }}>Manage household for smarter quantity suggestions</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'var(--s1)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 'var(--r)', padding: 14, textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: 'rgba(34,197,94,.15)', border: '1px solid rgba(34,197,94,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1rem', color: 'var(--g)', margin: '0 auto 8px' }}>
            {self.avatar ? <img src={self.avatar} alt={self.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials(self.name)}
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--ff)', marginBottom: 3 }}>{self.name}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--g)', fontFamily: 'var(--ff)' }}>Account owner</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--t3)', marginTop: 2 }}>{self.diet}</div>
        </div>

        {members.map(m => (
          <div key={m._id} style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r)', padding: 14, textAlign: 'center', position: 'relative' }}>
            <button
              onClick={() => requestDelete(m)}
              style={{ position: 'absolute', top: 6, right: 8, background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: '0.8rem', lineHeight: 1 }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--t3)')}
            >
              ✕
            </button>
            <button
              onClick={() => openEdit(m)}
              style={{ position: 'absolute', top: 6, left: 8, background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'var(--ff)' }}
            >
              Edit
            </button>
            <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1rem', color: 'var(--g)', margin: '0 auto 8px' }}>
              {m.avatar ? <img src={m.avatar} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials(m.name)}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--ff)', marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--t3)' }}>{m.relation} · Age {m.age}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--t3)', marginTop: 2 }}>{m.diet}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--g)', marginTop: 4, fontFamily: 'var(--ff)' }}>{m.requestedItems?.length || 0} requested</div>
          </div>
        ))}

        <button
          onClick={openAdd}
          style={{ background: 'transparent', border: '1px dashed var(--bd)', borderRadius: 'var(--r)', padding: 14, color: 'var(--t3)', cursor: 'pointer', fontFamily: 'var(--ff)', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 130 }}
          onMouseEnter={e => {
            (e.currentTarget as any).style.borderColor = 'var(--g)';
            (e.currentTarget as any).style.color = 'var(--g)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as any).style.borderColor = 'var(--bd)';
            (e.currentTarget as any).style.color = 'var(--t3)';
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>+</span>Add member
        </button>
      </div>

      <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 16 }}>
        <div style={{ fontFamily: 'var(--ff)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 10 }}>🧠 How family data improves suggestions</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--t3)', lineHeight: 2.1, fontFamily: 'var(--ff)' }}>
          👤 More members = higher quantity suggestions
          <br />
          🧒 Children profiles = kid-friendly product tags
          <br />
          🥗 Dietary prefs = vegetarian/vegan filtering
          <br />
          📊 Age groups = nutrition-aware recommendations
        </div>
      </div>

      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={e => e.target === e.currentTarget && setModal(false)}
        >
          <div style={{ background: 'var(--s1)', border: '1px solid var(--bd)', borderRadius: 'var(--r2)', padding: 24, width: 310 }}>
            <div style={{ fontFamily: 'var(--ff)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 14 }}>{mode === 'add' ? 'Add family member' : 'Edit family member'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1rem', color: 'var(--g)', flexShrink: 0 }}>
                {form.avatar ? <img src={form.avatar} alt="Member preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials(form.name || 'M')}
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 11px', border: '1px solid var(--bd2)', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--ff)', fontSize: '0.74rem', fontWeight: 700, color: 'var(--t1)' }}>
                {avatarBusy ? 'Loading...' : form.avatar ? 'Change photo' : 'Upload photo'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleAvatarChange(e.target.files?.[0])} />
              </label>
            </div>
            <div style={lb}>NAME</div>
            <input style={fi} placeholder="Priya" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={lb}>AGE</div>
                <input style={fi} type="number" placeholder="28" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
              </div>
              <div>
                <div style={lb}>RELATION</div>
                <select style={fi} value={form.relation} onChange={e => setForm({ ...form, relation: e.target.value })}>
                  {['Spouse', 'Child', 'Parent', 'Sibling', 'Other'].map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={lb}>DIETARY</div>
            <select style={{ ...fi, marginBottom: 18 }} value={form.diet} onChange={e => setForm({ ...form, diet: e.target.value })}>
              {['No restriction', 'Vegetarian', 'Vegan', 'Gluten free'].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setModal(false)} style={{ flex: 1, padding: 8, border: '1px solid var(--bd)', borderRadius: 8, background: 'transparent', color: 'var(--t3)', fontFamily: 'var(--ff)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSave} style={{ flex: 1, padding: 8, border: 'none', borderRadius: 8, background: 'var(--g)', color: 'var(--gdk)', fontFamily: 'var(--ff)', fontWeight: 700, cursor: 'pointer' }}>
                {mode === 'add' ? 'Add Member' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOpen && deleteTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.7)',
            zIndex: 210,
            display: 'grid',
            placeItems: 'center',
            padding: 16,
          }}
          onClick={e => e.target === e.currentTarget && setDeleteOpen(false)}
        >
          <div
            style={{
              width: 'min(380px, 100%)',
              background: 'var(--s1)',
              border: '1px solid var(--bd)',
              borderRadius: 'var(--r2)',
              padding: 20,
              boxShadow: '0 30px 80px rgba(0,0,0,.45)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontFamily: 'var(--ff)', fontWeight: 800, fontSize: '1rem', marginBottom: 8 }}>Remove member?</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--t3)', lineHeight: 1.5, marginBottom: 16 }}>
              This will permanently remove <strong style={{ color: 'var(--t1)' }}>{deleteTarget.name}</strong> from your family list.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setDeleteOpen(false)}
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
                onClick={confirmDelete}
                style={{
                  padding: '8px 14px',
                  border: 'none',
                  borderRadius: 9,
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'var(--s2)', border: '1px solid var(--bd2)', color: 'var(--t1)', padding: '9px 15px', borderRadius: 9, fontSize: '0.78rem', fontFamily: 'var(--ff)', zIndex: 999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
