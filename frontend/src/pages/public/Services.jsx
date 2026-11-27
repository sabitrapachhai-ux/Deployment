import { useEffect, useState } from 'react';
import api from '../../api/client';
import EmptyState from '../../components/ui/EmptyState';
export default function Services() {
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  useEffect(()=>{api.get('/services?limit=100').then(({data})=>setItems(data.data.items||[])).catch(e=>setError(e.response?.data?.message||'Could not load services')).finally(()=>setLoading(false));},[]);
  return <div className="container-wide py-14"><h1 className="page-title">Services</h1><p className="mt-3 text-muted">Our repair services and starting points.</p>
    {loading?<div className="mt-7 grid gap-4 md:grid-cols-3">{[1,2,3].map(n=><div key={n} className="skeleton h-48"/>)}</div>:error?<EmptyState title="Unable to load" message={error}/>:!items.length?<EmptyState title="No services" message="Services will appear here when added."/>:<div className="mt-7 grid gap-4 md:grid-cols-3">{items.map(s=><article className="card p-6" key={s._id}><h2 className="text-xl font-bold text-primary-900">{s.title}</h2><p className="mt-3 text-muted">{s.description}</p>{s.startingPrice!=null&&<p className="mt-4 font-bold text-primary-500">Starting at NPR {s.startingPrice}</p>}</article>)}</div>}
  </div>;
}
