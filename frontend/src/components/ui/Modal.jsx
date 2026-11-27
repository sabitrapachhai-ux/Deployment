import { useEffect } from 'react';
export default function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open, onClose]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-primary-900/60 p-4" role="dialog" aria-modal="true" aria-label={title}>
    <div className="card max-h-[90vh] w-full max-w-2xl overflow-y-auto p-5">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-primary-900">{title}</h2><button className="btn btn-outline" onClick={onClose} aria-label="Close">×</button></div>
      {children}
    </div>
  </div>;
}
