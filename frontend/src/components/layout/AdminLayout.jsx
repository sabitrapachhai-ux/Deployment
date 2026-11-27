import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { shopDetails } from '../../config/shop';
export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const links=[['/admin','Dashboard'],['/admin/repairs','Repairs'],['/admin/inventory','Inventory'],['/admin/messages','Messages'],['/admin/content/services','Services'],['/admin/content/certificates','Certificates'],['/admin/content/experience','Experience'],['/admin/content/appreciations','Appreciations']];
  return <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]"><aside className="bg-primary-900 p-4 text-white"><Link className="block py-3 font-bold" to="/admin">{shopDetails.name} Admin</Link><nav className="flex overflow-x-auto md:block" aria-label="Admin navigation">{links.map(([to,label])=><NavLink key={to} to={to} end={to===' /admin'} className={({isActive})=>`block whitespace-nowrap rounded px-3 py-2 ${isActive?'bg-primary-700':'hover:bg-primary-700'}`}>{label}</NavLink>)}</nav><button className="btn mt-4 w-full bg-white/10" onClick={logout}>Log out</button></aside><main className="min-w-0 p-4 md:p-8"><div className="mb-6 text-right text-sm text-muted">{user?.name}</div>{children}</main></div>;
}
