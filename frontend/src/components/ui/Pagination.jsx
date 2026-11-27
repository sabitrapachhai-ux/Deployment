export default function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.pages <= 1) return null;
  return <nav className="mt-6 flex items-center justify-center gap-3" aria-label="Pagination">
    <button className="btn btn-outline" disabled={pagination.page <= 1} onClick={() => onPage(pagination.page - 1)}>Previous</button>
    <span>Page {pagination.page} of {pagination.pages}</span>
    <button className="btn btn-outline" disabled={pagination.page >= pagination.pages} onClick={() => onPage(pagination.page + 1)}>Next</button>
  </nav>;
}
