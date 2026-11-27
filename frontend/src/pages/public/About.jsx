import { useEffect, useState } from 'react';
import api from '../../api/client';
import SmartImage from '../../components/ui/SmartImage';
export default function About() {
  const [data,setData]=useState({experience:[],certificates:[],appreciations:[]});
  useEffect(()=>{Promise.all([api.get('/experience'),api.get('/certificates'),api.get('/appreciations')]).then(([e,c,a])=>setData({experience:e.data.data.items||[],certificates:c.data.data.items||[],appreciations:a.data.data.items||[]}));},[]);
  return <div className="container-wide py-14"><h1 className="page-title">About & Achievements</h1><div className="mt-5 inline-block rounded-lg bg-accent-100 px-5 py-3 font-bold text-primary-900">[EDIT ME: Years of experience] years</div>
    <section className="mt-10"><h2 className="text-2xl font-bold text-primary-900">Experience</h2><div className="mt-5 border-l-2 border-primary-500">{data.experience.map(x=><article className="relative ml-5 pb-7" key={x._id}><span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-primary-500"/><strong>{x.role}</strong><p className="text-muted">{x.organization} · {x.startYear}–{x.endYear||'Present'}</p><p>{x.description}</p></article>)}</div></section>
    <section className="mt-10"><h2 className="text-2xl font-bold text-primary-900">Certificates</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">{data.certificates.map(c=><article className="card p-4" key={c._id}><SmartImage src={c.image} fallback="certificate" alt={c.title} className="h-52 w-full rounded-lg object-cover"/><h3 className="mt-3 font-bold">{c.title}</h3><p className="text-muted">{c.issuedBy}</p></article>)}</div></section>
    <section className="mt-10"><h2 className="text-2xl font-bold text-primary-900">Appreciation Corner</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{data.appreciations.map(a=><article className={`card p-5 ${a.isFeatured?'ring-2 ring-accent-500':''}`} key={a._id}><p>“{a.message}”</p><strong className="mt-4 block">{a.authorName}</strong><span className="text-muted">{a.authorRole}</span></article>)}</div></section>
  </div>;
}
