import { useEffect,useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import AdminLayout from '../../components/layout/AdminLayout';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
export default function Messages(){
 const [items,setItems]=useState([]);const [pagination,setPagination]=useState();const [page,setPage]=useState(1);const [remove,setRemove]=useState(null);
 const load=()=>api.get(`/messages?page=${page}&limit=10`).then(({data})=>{setItems(data.data.items||[]);setPagination(data.data.pagination)}).catch(()=>{});
 useEffect(()=>{load()},[page]);
 const mark=async(item)=>{await api.patch(`/messages/${item._id}/read`);toast.success('Message marked read');load()};
 const removeItem=async()=>{await api.delete(`/messages/${remove._id}`);toast.success('Message deleted');setRemove(null);load()};
 return <AdminLayout><h1 className="text-3xl font-bold text-primary-900">Messages inbox</h1>{!items.length?<div className="mt-6"><EmptyState title="No messages" message="Contact form submissions will appear here."/></div>:<div className="mt-6 grid gap-4">{items.map(m=><article className={`card p-5 ${m.isRead?'':'border-l-4 border-primary-500'}`} key={m._id}><div className="flex flex-wrap justify-between gap-3"><div><strong>{m.name}</strong><p className="text-muted">{m.phone} · {m.email||'No email'}</p></div><span className="text-sm text-muted">{new Date(m.createdAt).toLocaleString()}</span></div><p className="mt-4">{m.message}</p><div className="mt-4 flex gap-2"><button className="btn btn-outline" disabled={m.isRead} onClick={()=>mark(m)}>{m.isRead?'Read':'Mark read'}</button><button className="btn bg-danger text-white" onClick={()=>setRemove(m)}>Delete</button></div></article>)}</div>}<Pagination pagination={pagination} onPage={setPage}/><ConfirmDialog open={!!remove} message={`Delete message from ${remove?.name}?`} onCancel={()=>setRemove(null)} onConfirm={removeItem}/></AdminLayout>;
}
