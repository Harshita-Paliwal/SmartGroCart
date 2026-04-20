import React,{useEffect,useState} from 'react';
import {getPurchases,getPurchaseStats} from '../api';
import useResponsive from '../utils/useResponsive';

export default function HistoryPage(){
  const { isMobile, isTablet } = useResponsive();
  const [purchases,setPurchases]=useState<any[]>([]);
  const [stats,setStats]=useState<any>(null);
  const [expanded,setExpanded]=useState<string[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    getPurchases({limit:30}).then(r=>{setPurchases(r.data.purchases);setLoading(false);}).catch(()=>setLoading(false));
    getPurchaseStats().then(r=>setStats(r.data)).catch(()=>{});
  },[]);

  const toggle=(id:string)=>setExpanded(prev=>prev.includes(id)?prev.filter(item=>item!==id):[...prev,id]);
  const totalSpent=purchases.reduce((s,p)=>s+p.totalAmount,0);
  const avgOrder=purchases.length?Math.round(totalSpent/purchases.length):0;

  return(
    <div>
      <div style={{fontFamily:'var(--ff)',fontWeight:800,fontSize:'1.5rem',letterSpacing:'-0.04em',marginBottom:2}}>Purchase History</div>
      <div style={{fontSize:'0.76rem',color:'var(--t3)',marginBottom:20,fontFamily:'var(--ff)'}}>Click any order to expand</div>
      <div style={{display:'grid',gridTemplateColumns:isTablet?'1fr':'1fr 280px',gap:14,alignItems:'start'}}>
        <div>
          {loading?<div style={{color:'var(--t3)',fontFamily:'var(--ff)',fontSize:'0.82rem'}}>Loading...</div>
          :purchases.length===0?<div style={{background:'var(--s1)',border:'1px solid var(--bd)',borderRadius:'var(--r2)',padding:'48px 32px',textAlign:'center',color:'var(--t3)',fontFamily:'var(--ff)',fontSize:'0.82rem'}}>No purchases yet.<br/>Make your first order from Cart!</div>
          :purchases.map(p=>(
            <div key={p._id} style={{border:'1px solid var(--bd)',borderRadius:'var(--r)',marginBottom:8,overflow:'hidden'}}>
              <div onClick={()=>toggle(p._id)} style={{display:'flex',justifyContent:'space-between',alignItems:isMobile?'flex-start':'center',flexDirection:isMobile?'column':'row',padding:'11px 14px',background:'var(--s2)',cursor:'pointer',fontSize:'0.78rem',gap:8}}>
                <div>
                  <span style={{fontFamily:'var(--ff)',fontWeight:600}}>Order - {new Date(p.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span>
                  <span style={{color:'var(--t3)',marginLeft:8}}>{p.items.length} items</span>
                </div>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                  <span style={{color:'var(--g)',fontFamily:'var(--ff)',fontWeight:700}}>Rs.{p.totalAmount.toLocaleString()}</span>
                  <span style={{color:'var(--t3)',fontSize:'0.72rem'}}>{expanded.includes(p._id)?'▲':'▼'}</span>
                </div>
              </div>
              {expanded.includes(p._id)&&(
                <div style={{padding:'10px 14px'}}>
                  {p.items.map((item:any,i:number)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:'0.74rem',padding:'4px 0',borderBottom:i<p.items.length-1?'1px solid var(--bd)':'none',color:'var(--t3)'}}>
                      <span>{item.imageEmoji} {item.name} x{item.quantity}</span>
                      <span>Rs.{(item.price*item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div style={{textAlign:'right',paddingTop:8,fontSize:'0.8rem',fontWeight:700,color:'var(--g)',fontFamily:'var(--ff)'}}>Total: Rs.{p.totalAmount.toLocaleString()}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div>
          <div style={{background:'var(--s1)',border:'1px solid var(--bd)',borderRadius:'var(--r2)',padding:16,marginBottom:12}}>
            <div style={{fontFamily:'var(--ff)',fontSize:'0.8rem',fontWeight:700,marginBottom:12}}>Summary</div>
            {[['Total Orders',purchases.length],['Total Spent',`Rs.${totalSpent.toLocaleString()}`],['Avg Order',`Rs.${avgOrder.toLocaleString()}`]].map(([l,v])=>(
              <div key={l as string} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid var(--bd)',fontSize:'0.78rem'}}>
                <span style={{color:'var(--t3)'}}>{l}</span>
                <span style={{fontFamily:'var(--ff)',fontWeight:700}}>{String(v)}</span>
              </div>
            ))}
          </div>
          {stats?.categoryStats?.length>0&&(
            <div style={{background:'var(--s1)',border:'1px solid var(--bd)',borderRadius:'var(--r2)',padding:16}}>
              <div style={{fontFamily:'var(--ff)',fontSize:'0.8rem',fontWeight:700,marginBottom:12}}>By category</div>
              {stats.categoryStats.slice(0,6).map((c:any,i:number)=>{
                const max=stats.categoryStats[0]?.total||1;
                return(<div key={i} style={{marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',color:'var(--t3)',marginBottom:3,fontFamily:'var(--ff)'}}><span>{c._id}</span><span>Rs.{c.total.toLocaleString()}</span></div>
                  <div style={{height:4,background:'var(--bd)',borderRadius:2,overflow:'hidden'}}><div style={{height:'100%',width:`${Math.round((c.total/max)*100)}%`,background:'var(--g)',borderRadius:2}}/></div>
                </div>);
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
