import { Link } from 'react-router-dom';
export default function NotFound(){return <div className="container-wide grid min-h-[70vh] place-items-center text-center"><div><h1 className="page-title">404</h1><p className="mt-3 text-muted">This page could not be found.</p><Link className="btn btn-primary mt-5" to="/">Go home</Link></div></div>}
