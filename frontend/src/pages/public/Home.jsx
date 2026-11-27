import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import SmartImage from '../../components/ui/SmartImage';
import StatusBadge from '../../components/ui/StatusBadge';
import { shopDetails } from '../../config/shop';

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

export default function Home() {
  const [services,setServices]=useState([]); const [stock,setStock]=useState([]); const [content,setContent]=useState({certificates:[],appreciations:[]});
  useEffect(()=>{Promise.all([api.get('/services'),api.get('/inventory?limit=4'),api.get('/certificates'),api.get('/appreciations')]).then(([s,i,c,a])=>{setServices(s.data.data.items||[]);setStock(i.data.data.items||[]);setContent({certificates:c.data.data.items||[],appreciations:a.data.data.items||[]})}).catch(()=>{});},[]);
  return <>
    <section className="hero-section text-white"><div className="container-wide grid items-center gap-10 py-12 md:grid-cols-[1fr_.95fr] md:py-16">
      <div className="hero-copy"><p className="hero-kicker">[EDIT ME: Shop headline]</p><h1 className="page-title mt-5 !text-white">Repair care for the devices you rely on.</h1><p className="mt-5 max-w-xl text-lg text-white/85">Mobile phones, watches, rice cookers, spare parts and accessories.</p><div className="mt-7 flex flex-wrap gap-3"><Link className="btn btn-accent" to="/track">Track my repair <span aria-hidden="true">→</span></Link><Link className="btn hero-secondary" to="/contact">Contact the shop</Link></div><div className="hero-trust"><span>Repair tracking</span><span>Clear stock status</span><span>Sample content ready to edit</span></div></div>
      <div className="hero-photo-wrap"><SmartImage src="/images/shop/storefront.png" fallback="hero" alt={`Front of ${shopDetails.name}`} className="hero-image h-72 w-full rounded-2xl object-cover md:h-[390px]" /><div className="hero-photo-caption"><span className="caption-dot"/><span>{shopDetails.name}</span></div></div>
    </div></section>
    <section className="container-wide home-section py-14"><div className="grid gap-6 md:grid-cols-2"><article className="card content-card overflow-hidden"><SmartImage src="/images/shop/inside-1.png" fallback="device" alt={`Inside view of ${shopDetails.name}`} className="h-72 w-full object-cover"/><div className="p-5"><h2 className="text-xl font-bold text-primary-900">Inside the shop</h2><p className="mt-2 text-muted">Spare parts and accessories available for everyday device repairs.</p></div></article><article className="card content-card overflow-hidden"><SmartImage src="/images/shop/inside-2.png" fallback="device" alt={`Product shelves at ${shopDetails.name}`} className="h-72 w-full object-cover"/><div className="p-5"><h2 className="text-xl font-bold text-primary-900">Parts & products</h2><p className="mt-2 text-muted">A clear view of the devices, parts and accessories at the centre.</p></div></article></div></section>
    <section className="container-wide home-section py-14"><h2 className="page-title text-center">Our services</h2><div className="mt-7 grid gap-4 md:grid-cols-3">{services.slice(0,6).map(s=><article className="card content-card p-5" key={s._id}><h3 className="text-lg font-bold text-primary-900">{s.title}</h3><p className="mt-2 text-muted">{s.description}</p></article>)}</div></section>
    <section className="home-section bg-accent-100 py-14"><div className="container-wide"><h2 className="page-title">Why choose us</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{['Clear repair updates','Visible stock status','[EDIT ME: Experience benefit]'].map(t=><div className="card content-card p-5" key={t}><h3 className="font-bold text-primary-900">{t}</h3><p className="mt-2 text-muted">[EDIT ME: Add a verified shop benefit.]</p></div>)}</div></div></section>
    <section className="container-wide home-section py-14"><h2 className="page-title">In stock highlights</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 md:grid-cols-4">{stock.map(item=><article className="card content-card p-4" key={item._id}><SmartImage src={item.image||demoProductImages[item.category]} fallback="product" alt={item.name} className="h-40 w-full rounded-lg object-cover"/><h3 className="mt-3 font-bold">{item.name}</h3><StatusBadge value={item.stockStatus}/></article>)}</div></section>
    <section className="container-wide home-section grid gap-6 pb-14 md:grid-cols-2"><div className="card content-card p-6"><h2 className="text-2xl font-bold text-primary-900">Appreciation corner</h2>{content.appreciations.slice(0,2).map(a=><p className="mt-4 border-l-4 border-accent-500 pl-4" key={a._id}>“{a.message}”<br/><strong>{a.authorName}</strong></p>)}</div><div className="card content-card p-6"><h2 className="text-2xl font-bold text-primary-900">Certificates</h2><div className="mt-4 grid grid-cols-2 gap-3">{content.certificates.slice(0,2).map(c=><SmartImage key={c._id} src={c.image} fallback="certificate" alt={c.title} className="h-36 w-full rounded-lg object-cover"/>)}</div></div></section>
  </>;
}
