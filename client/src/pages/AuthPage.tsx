import React, { useState } from 'react';
import { registerAPI, loginAPI } from '../api';
import { useAuth } from '../context/AuthContext';
interface Props { initialMode:'login'|'register'; onBack:()=>void; onSuccess:()=>void; }
const fi: React.CSSProperties = { width:'100%', padding:'10px 12px', background:'var(--s2)', border:'1px solid var(--bd)', borderRadius:8, color:'var(--t1)', fontSize:'0.85rem', outline:'none' };
const lb: React.CSSProperties = { fontSize:'0.68rem', color:'var(--t3)', fontFamily:'var(--ff)', letterSpacing:'0.07em', marginBottom:4, marginTop:12, display:'block' };
export default function AuthPage({ initialMode, onBack, onSuccess }: Props) {
  const { loginUser } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [err, setErr]   = useState('');
  const [busy, setBusy] = useState(false);
  const [lu, setLu] = useState(''); const [lp, setLp] = useState('');
  const [rn, setRn] = useState(''); const [ru, setRu] = useState('');
  const [rp, setRp] = useState(''); const [rfs, setRfs] = useState('4');
  const [ra, setRa] = useState('30');
  const [rb, setRb] = useState('8000');
  const [members, setMembers] = useState<{name:string;age:string;relation:string;diet:string}[]>([]);
  const addMember = () => setMembers([...members,{name:'',age:'',relation:'Spouse',diet:'No restriction'}]);
  const updMember = (i:number,k:string,v:string) => { const m=[...members]; (m[i] as any)[k]=v; setMembers(m); };
  const doLogin = async () => {
    if (!lu||!lp){setErr('Enter username and password');return;}
    setBusy(true);setErr('');
    try { const {data}=await loginAPI({username:lu,password:lp}); loginUser(data.token,data.user); onSuccess(); }
    catch(e:any){setErr(e.response?.data?.message||'Invalid username or password');}
    setBusy(false);
  };
  const doRegister = async () => {
    if (!rn||!ru||!rp){setErr('Name, username and password required');return;}
    if (rp.length<6){setErr('Password must be at least 6 characters');return;}
    if (!ra || Number.isNaN(parseInt(ra, 10))) { setErr('Please enter a valid age'); return; }
    setBusy(true);setErr('');
    try {
      const valid=members.filter(m=>m.name&&m.age);
      const {data}=await registerAPI({name:rn,age:parseInt(ra,10)||30,username:ru,password:rp,familySize:parseInt(rfs)||4,monthlyBudget:parseInt(rb)||8000,familyMembers:valid.map(m=>({...m,age:parseInt(m.age)}))});
      loginUser(data.token,data.user);onSuccess();
    } catch(e:any){setErr(e.response?.data?.message||'Registration failed');}
    setBusy(false);
  };
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',padding:20,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-120,left:'50%',transform:'translateX(-50%)',width:600,height:350,background:'radial-gradient(ellipse,rgba(34,197,94,.09) 0%,transparent 68%)',pointerEvents:'none'}}/>
      <div style={{width:'100%',maxWidth:440,background:'var(--s1)',border:'1px solid var(--bd)',borderRadius:'var(--r2)',padding:30,position:'relative',zIndex:1}}>
        <button onClick={onBack} style={{display:'flex',alignItems:'center',gap:5,fontSize:'0.76rem',color:'var(--t3)',background:'none',border:'none',cursor:'pointer',marginBottom:20,fontFamily:'var(--fb)'}}>← Back to home</button>
        <div style={{fontFamily:'var(--ff)',fontWeight:800,fontSize:'1.4rem',letterSpacing:'-0.04em',marginBottom:3}}>Smart<span style={{color:'var(--g)'}}>Gro</span>Cart</div>
        <div style={{fontSize:'0.76rem',color:'var(--t3)',fontFamily:'var(--ff)',marginBottom:22}}>{mode==='login'?'Sign in to your account':'Create your account'}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,background:'var(--s2)',padding:4,borderRadius:9,marginBottom:20}}>
          {(['login','register'] as const).map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr('');}} style={{padding:9,border:'none',borderRadius:7,background:mode===m?'var(--s3)':'transparent',color:mode===m?'var(--t1)':'var(--t3)',fontFamily:'var(--ff)',fontSize:'0.8rem',fontWeight:700,cursor:'pointer'}}>
              {m==='login'?'Login':'Register'}
            </button>
          ))}
        </div>
        {mode==='login'&&(
          <div>
            <label style={lb}>USERNAME</label>
            <input style={fi} value={lu} onChange={e=>setLu(e.target.value)} placeholder="your username" onKeyDown={e=>e.key==='Enter'&&doLogin()}/>
            <label style={lb}>PASSWORD</label>
            <input style={fi} type="password" value={lp} onChange={e=>setLp(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==='Enter'&&doLogin()}/>
          </div>
        )}
        {mode==='register'&&(
          <div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <div><label style={lb}>FULL NAME</label><input style={fi} value={rn} onChange={e=>setRn(e.target.value)} placeholder="Arjun Sharma"/></div>
              <div><label style={lb}>USERNAME</label><input style={fi} value={ru} onChange={e=>setRu(e.target.value)} placeholder="arjun99"/></div>
            </div>
            <label style={lb}>AGE</label>
            <input style={fi} type="number" min="0" max="120" value={ra} onChange={e=>setRa(e.target.value)} placeholder="30"/>
            <label style={lb}>PASSWORD</label>
            <input style={fi} type="password" value={rp} onChange={e=>setRp(e.target.value)} placeholder="min 6 characters"/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:12}}>
              <div><label style={lb}>FAMILY SIZE</label><input style={fi} type="number" value={rfs} onChange={e=>setRfs(e.target.value)} min="1" max="20"/></div>
              <div><label style={lb}>MONTHLY BUDGET (₹)</label><input style={fi} type="number" value={rb} onChange={e=>setRb(e.target.value)}/></div>
            </div>
            <div style={{marginTop:14,background:'var(--s2)',border:'1px solid var(--bd)',borderRadius:9,padding:12}}>
              <div style={{fontSize:'0.68rem',color:'var(--t3)',fontFamily:'var(--ff)',letterSpacing:'0.07em',marginBottom:9}}>FAMILY MEMBERS (optional)</div>
              {members.map((m,i)=>(
                <div key={i} style={{display:'flex',gap:6,marginBottom:6,alignItems:'center'}}>
                  <input style={{...fi,flex:1}} placeholder="Name" value={m.name} onChange={e=>updMember(i,'name',e.target.value)}/>
                  <input style={{...fi,width:58}} type="number" placeholder="Age" value={m.age} onChange={e=>updMember(i,'age',e.target.value)}/>
                  <select style={{...fi,width:88}} value={m.relation} onChange={e=>updMember(i,'relation',e.target.value)}>
                    {['Spouse','Child','Parent','Sibling','Other'].map(r=><option key={r}>{r}</option>)}
                  </select>
                  <button onClick={()=>setMembers(members.filter((_,x)=>x!==i))} style={{background:'none',border:'none',color:'var(--t3)',cursor:'pointer',fontSize:'0.95rem',padding:2}}>✕</button>
                </div>
              ))}
              <button onClick={addMember} style={{width:'100%',padding:7,border:'1px dashed var(--bd)',borderRadius:7,background:'transparent',color:'var(--t3)',fontSize:'0.75rem',cursor:'pointer',fontFamily:'var(--fb)'}}>+ Add family member</button>
            </div>
          </div>
        )}
        {err&&<div style={{color:'#f87171',fontSize:'0.76rem',marginTop:10,padding:'7px 11px',background:'rgba(248,113,113,.08)',borderRadius:7,fontFamily:'var(--ff)'}}>{err}</div>}
        <button onClick={mode==='login'?doLogin:doRegister} disabled={busy} style={{width:'100%',marginTop:18,padding:12,background:'var(--g)',border:'none',borderRadius:9,color:'var(--gdk)',fontFamily:'var(--ff)',fontWeight:800,fontSize:'0.9rem',cursor:'pointer',opacity:busy?0.7:1}}>
          {busy?'Loading…':mode==='login'?'Sign In →':'Create Account →'}
        </button>
      </div>
    </div>
  );
}
