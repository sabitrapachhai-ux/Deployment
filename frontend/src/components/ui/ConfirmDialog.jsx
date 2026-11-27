export default function ConfirmDialog({ open, title = 'Confirm deletion', message, onCancel, onConfirm }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[60] grid place-items-center bg-primary-900/60 p-4" role="dialog" aria-modal="true">
    <div className="card w-full max-w-md p-6"><h2 className="text-lg font-bold text-primary-900">{title}</h2><p className="my-4 text-muted">{message}</p>
      <div className="flex justify-end gap-3"><button className="btn btn-outline" onClick={onCancel}>Cancel</button><button className="btn bg-danger text-white" onClick={onConfirm}>Delete</button></div>
    </div>
  </div>;
}
