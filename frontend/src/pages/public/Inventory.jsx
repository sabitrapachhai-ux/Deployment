import { useEffect, useState } from 'react';
import api from '../../api/client';
import SmartImage from '../../components/ui/SmartImage';
import StatusBadge from '../../components/ui/StatusBadge';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';

const demoProductImages = {
  screen: '/images/demo/phone-product.jpg',
  battery: '/images/products/batteries.png',
  charger: '/images/products/adapters.png',
  cable: '/images/products/charging-cable.png',
  case: '/images/demo/phone-product.jpg',
  strap: '/images/products/watch.png',
  spare_part: '/images/demo/repair-workshop.jpg',
  accessory: '/images/products/wired-earphones.png',
  other: '/images/products/bulbs.png',
};

export default function Inventory() {
  const [items,setItems]=useState([]); const [pagination,setPagination]=useState(); const [search,setSearch]=useState(''); const [category,setCategory]=useState(''); const [page,setPage]=useState(1); const [loading,setLoading]=useState(true);
  useEffect(()=>{setLoading(true);const params=new URLSearchParams({page,limit:12});if(search)params.set('search',search);if(category)params.set('category',category);api.get(`/inventory?${params}`).then(({data})=>{setItems(data.data.items||[]);setPagination(data.data.pagination)}).finally(()=>setLoading(false));},[search,category,page]);
  return <div className="container-wide catalog-page py-10 md:py-14"><div className="catalog-heading"><div><p className="eyebrow">Parts and accessories</p><h1 className="page-title mt-2">In Stock</h1><p className="mt-3 max-w-2xl text-muted">Browse current demo inventory. Stock labels update from the shop's inventory.</p></div><div className="catalog-count"><strong>{pagination?.total ?? items.length}</strong><span>sample listings</span></div></div><div className="catalog-filters mt-7 grid gap-4 sm:grid-cols-2"><label className="filter-field"><span>Search products</span><input className="field" value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}} placeholder="Try a product or brand"/></label><label className="filter-field"><span>Category</span><select className="field" value={category} onChange={e=>{setCategory(e.target.value);setPage(1)}}><option value="">All categories</option>{['screen','battery','charger','cable','case','strap','spare_part','accessory','other'].map(v=><option key={v} value={v}>{v.replace('_',' ')}</option>)}</select></label></div>
    {loading?<div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map(n=><div className="skeleton h-80" key={n}/>)}</div>:!items.length?<div className="mt-7"><EmptyState title="No products found" message="Try a different search or category."/></div>:<div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map(item=><article className="card product-card" key={item._id}><div className="product-photo"><SmartImage src={item.image||demoProductImages[item.category]} fallback="product" alt={item.name} className="h-full w-full object-cover"/><span className="product-category">{item.category.replace('_',' ')}</span></div><div className="product-info"><h2 className="font-bold text-primary-900">{item.name}</h2><p className="mt-1 text-sm text-muted">{item.brand}</p>{item.description&&<p className="product-description">{item.description}</p>}<div className="mt-4 flex items-center justify-between gap-3"><StatusBadge value={item.stockStatus}/><strong className="product-price">NPR {item.price}</strong></div></div></article>)}</div>}<Pagination pagination={pagination} onPage={setPage}/>
  </div>;
}
