import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import SmartImage from '../ui/SmartImage';
import { shopDetails } from '../../config/shop';

const links = [['/', 'Home'], ['/services','Services'], ['/in-stock','In Stock'], ['/track','Track Repair'], ['/about','About & Achievements'], ['/contact','Contact']];
export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return <>
    <header className="site-header sticky top-0 z-40">
      <div className="header-note"><div className="container-wide flex items-center justify-between"><span>Phone · Watch · Appliance Repair</span><span className="hidden sm:inline">{shopDetails.hoursSummary}</span></div></div>
      <div className="header-main">
       <div className="container-wide flex h-[76px] items-center justify-between gap-4">
        <Link to="/" className="brand-link flex shrink-0 items-center gap-2 font-bold text-primary-900"><SmartImage fallback="logo" alt="" className="h-11 w-11" /><span>{shopDetails.name}<small>Repair & Parts · Pyuthan</small></span></Link>
        <button className={`menu-toggle btn btn-outline md:hidden ${open ? 'is-open' : ''}`} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}>
          <span/><span/><span/>
        </button>
        <nav id="main-navigation" className={`main-navigation absolute left-0 right-0 top-[104px] border-b border-border bg-white p-4 md:static md:flex md:border-0 md:p-0 ${open ? 'is-open' : ''}`} aria-label="Main navigation">
          {links.map(([to,label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({isActive}) => `navigation-link px-3 py-3 text-sm font-bold ${isActive?'active text-primary-500':'text-primary-900'}`}>{label}</NavLink>)}
          <Link className="nav-cta hidden md:inline-flex" to="/track">Track a repair <span aria-hidden="true">→</span></Link>
        </nav>
       </div>
      </div>
    </header>
    <main><Outlet /></main>
    <footer className="mt-16 bg-primary-900 py-10 text-white"><div className="container-wide grid gap-6 md:grid-cols-3">
      <div><h2 className="font-bold">{shopDetails.name}</h2><p className="text-white/80">{shopDetails.address}</p></div>
      <div><h2 className="font-bold">Quick links</h2>{links.map(([to,label]) => <Link className="mr-3 block" key={to} to={to}>{label}</Link>)}</div>
      <div><h2 className="font-bold">Contact</h2><p><a href={`tel:${shopDetails.phoneLink}`}>{shopDetails.phone}</a></p><p>{shopDetails.hoursSummary}</p><p>{shopDetails.saturdayHours}</p></div>
    </div></footer>
    <Link className="btn btn-accent fixed bottom-4 right-4 z-40 shadow-lg md:hidden" to="/contact" aria-label="Contact the shop">Contact</Link>
  </>;
}
