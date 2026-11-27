import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import AdminLayout from '../../components/layout/AdminLayout';
import StatusBadge from '../../components/ui/StatusBadge';
export default function Dashboard(){
 const [stats,setStats]=useState(null); const [recent,setRecent]=useState([]);
 useEffect(()=>{Promise.all([api.get('/stats'),api.get('/repairs?limit=5')]).then(([s,r])=>{setStats(s.data.data);setRecent(r.data.data.items||[])}).catch(()=>{});},[]);
 const cards=stats?[['Total jobs',stats.totalJobs],['In repair',stats.repairStatusCounts.in_repair],['Repaired today',stats.repairedToday],['Out of stock',stats.stockStatusCounts.out_of_stock],['Unread messages',stats.unreadMessages]]:[];
 return <AdminLayout><h1 className="text-3xl font-bold text-primary-900">Dashboard</h1><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{cards.map(([label,value])=><div className="card p-5" key={label}><p className="text-muted">{label}</p><strong className="text-2xl text-primary-900">{value}</strong></div>)}</div><section className="card mt-8 overflow-x-auto p-5"><div className="mb-4 flex justify-between"><h2 className="font-bold">Recent jobs</h2><Link className="text-primary-500" to="/admin/repairs">View all</Link></div><table className="w-full min-w-[650px] text-left"><thead><tr><th>Code</th><th>Customer</th><th>Device</th><th>Status</th></tr></thead><tbody>{recent.map(r=><tr key={r._id} className="border-t"><td>{r.trackingCode}</td><td>{r.customerName}</td><td>{r.brand} {r.model}</td><td><StatusBadge value={r.repairStatus}/></td></tr>)}</tbody></table></section></AdminLayout>;
}
