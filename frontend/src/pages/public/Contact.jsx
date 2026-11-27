import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import { shopDetails } from '../../config/shop';
export default function Contact() {
  const [form,setForm]=useState({name:'',phone:'',email:'',message:''});
  const submit=async(e)=>{e.preventDefault();try{await api.post('/messages',form);toast.success('Message sent');setForm({name:'',phone:'',email:'',message:''})}catch{}};
  const mapsUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopDetails.mapsQuery)}`;
  const mapEmbedUrl=`https://maps.google.com/maps?q=${encodeURIComponent(shopDetails.mapsQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  return <div className="container-wide py-14"><p className="eyebrow">Find and contact us</p><h1 className="page-title mt-2">Contact {shopDetails.name}</h1><div className="mt-7 grid gap-8 md:grid-cols-2"><form className="card space-y-4 p-6" onSubmit={submit}>
    {[['name','Name'],['phone','Phone'],['email','Email (optional)']].map(([key,label])=><label key={key}>{label}<input className="field mt-1" type={key==='email'?'email':'text'} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} required={key!=='email'}/></label>)}
    <label>Message<textarea className="field mt-1 min-h-32" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required/></label><button className="btn btn-accent">Send message</button>
  </form><div className="card p-5 md:p-6"><h2 className="text-xl font-bold text-primary-900">Shop details</h2><p className="mt-3"><strong>Phone:</strong> <a href={`tel:${shopDetails.phoneLink}`}>{shopDetails.phone}</a></p><p><strong>Address:</strong> {shopDetails.address}</p><p><strong>Hours:</strong> {shopDetails.hoursSummary}</p><p>{shopDetails.saturdayHours}</p><div className="mt-5 overflow-hidden rounded-xl border border-border"><iframe title={`Map location for ${shopDetails.name}`} className="h-72 w-full" src={mapEmbedUrl} loading="lazy"/></div><a className="btn btn-outline mt-4 w-full" href={mapsUrl} target="_blank" rel="noreferrer">Open location in Google Maps <span aria-hidden="true">↗</span></a></div></div></div>;
}
