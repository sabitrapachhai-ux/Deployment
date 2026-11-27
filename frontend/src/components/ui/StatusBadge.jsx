const map = {
  received: ['Received', 'bg-slate-100 text-slate-700', '↘'],
  diagnosing: ['Diagnosing', 'bg-blue-100 text-blue-800', '⌕'],
  in_repair: ['In Repair', 'bg-amber-100 text-amber-800', '🔧'],
  waiting_for_parts: ['Waiting for Parts', 'bg-orange-100 text-orange-800', '◷'],
  repaired: ['Repaired ✓', 'bg-green-100 text-green-800', '✓'],
  delivered: ['Delivered', 'bg-emerald-100 text-emerald-900', '▣'],
  not_repairable: ['Not Repairable', 'bg-red-100 text-red-800', '×'],
  in_stock: ['In Stock', 'bg-green-100 text-green-800', '●'],
  low_stock: ['Low Stock', 'bg-amber-100 text-amber-800', '●'],
  out_of_stock: ['Out of Stock', 'bg-red-100 text-red-800', '●'],
};
export default function StatusBadge({ value }) {
  const [label, style, icon] = map[value] || [value, 'bg-slate-100 text-slate-700', '•'];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-bold ${style}`}><span aria-hidden="true">{icon}</span>{label}</span>;
}
