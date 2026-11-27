export default function EmptyState({ title = 'Nothing here yet', message = 'No records to show.' }) {
  return <div className="card p-10 text-center"><h3 className="text-lg font-bold text-primary-900">{title}</h3><p className="text-muted">{message}</p></div>;
}
