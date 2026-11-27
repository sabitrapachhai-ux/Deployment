import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
export default function Login() {
  const { user, login }=useAuth(); const navigate=useNavigate(); const [form,setForm]=useState({email:'',password:''}); const [loading,setLoading]=useState(false);
  if(user)return <Navigate to="/admin" replace />;
  const submit=async(e)=>{e.preventDefault();setLoading(true);try{await login(form.email,form.password);toast.success('Logged in');navigate('/admin')}catch{}finally{setLoading(false)}};
  return <div className="grid min-h-screen place-items-center bg-primary-900 p-4"><form className="card w-full max-w-md p-6" onSubmit={submit}><h1 className="text-2xl font-bold text-primary-900">Admin login</h1><label className="mt-5 block">Email<input className="field mt-1" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></label><label className="mt-4 block">Password<input className="field mt-1" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></label><button className="btn btn-accent mt-5 w-full" disabled={loading}>{loading?'Signing in...':'Sign in'}</button></form></div>;
}
