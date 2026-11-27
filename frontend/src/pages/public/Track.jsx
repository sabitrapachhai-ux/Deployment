import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import StatusBadge from '../../components/ui/StatusBadge';
import RepairProgress from '../../components/ui/RepairProgress';

const formatDeviceType = (device) => device?.replaceAll('_', ' ');

export default function Track() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [code,setCode]=useState(searchParams.get('code') || '');
  const [result,setResult]=useState(null);
  const [message,setMessage]=useState('');
  const [loading,setLoading]=useState(false);

  const lookup = useCallback(async (trackingCode) => {
    const normalizedCode = trackingCode.trim();
    if (!normalizedCode) return;
    setResult(null);
    setMessage('');
    setLoading(true);
    try {
      const {data} = await api.get(`/repairs/track/${encodeURIComponent(normalizedCode)}`);
      setResult(data.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not find this repair');
    } finally {
      setLoading(false);
    }
  }, []);

  const codeFromUrl = searchParams.get('code');
  useEffect(() => {
    if (codeFromUrl) {
      setCode(codeFromUrl);
      lookup(codeFromUrl);
    }
  }, [codeFromUrl, lookup]);

  const submit = (event) => {
    event.preventDefault();
    const normalizedCode = code.trim();
    if (normalizedCode) setSearchParams({ code: normalizedCode });
  };

  return <div className="container-wide py-14"><p className="eyebrow">Repair updates</p><h1 className="page-title mt-2">Track your repair</h1><p className="mt-3 max-w-2xl text-muted">Enter the tracking code from your repair slip to see the current stage.</p><form className="mt-7 max-w-xl" onSubmit={submit}><label className="font-bold" htmlFor="tracking-code">Tracking code</label><div className="mt-2 flex gap-2"><input id="tracking-code" className="field" value={code} onChange={e=>setCode(e.target.value)} required placeholder="RS-XXXXXX"/><button className="btn btn-accent" disabled={loading}>{loading?'Checking...':'Track'}</button></div></form>
    {message&&<p className="mt-6 rounded-lg bg-red-100 p-4 text-danger" role="alert">{message}</p>}
    {result&&<section className="card repair-result mt-8 p-5 md:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-muted">Repair tracking code</p><p className="mt-1 text-xl font-extrabold text-primary-900">{codeFromUrl}</p></div><StatusBadge value={result.status}/></div><p className="mt-5 text-lg"><strong>{result.brand} {result.model}</strong><span className="block text-sm capitalize text-muted">{formatDeviceType(result.device)}</span></p>
    {result.status==='not_repairable'?<div className="repair-notice mt-6" role="status"><strong>This repair cannot continue.</strong><p>The device is marked not repairable. Please contact the shop for next steps.</p></div>:<><RepairProgress status={result.status}/>{result.status==='waiting_for_parts'&&<div className="repair-notice is-waiting mt-6" role="status"><strong>Waiting for parts</strong><p>The repair is paused until the required parts arrive. The current stage will update when work resumes.</p></div>}<p className="mt-5 font-bold text-primary-900">{['repaired','delivered'].includes(result.status)?'Repaired ✓':'Not yet repaired'}</p></>}
    {result.expectedDate&&<p className="mt-5 text-sm text-muted">Expected date: {new Date(result.expectedDate).toLocaleDateString()}</p>}</section>}
  </div>;
}
