import { useState } from 'react';
import { FileText, Search } from 'lucide-react';
import type { Invoice, Shipment } from '@/lib/types';
import { StatusBadge, EmptyState } from './PortalDashboard';

export function InvoicesTab({
  invoices,
  shipments,
}: {
  invoices: Invoice[];
  shipments: Shipment[];
}) {
  const [query, setQuery] = useState('');

  const fmt = (amount: number, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  const shipmentMap = new Map(shipments.map((s) => [s.id, s.tracking_number]));

  const filtered = invoices.filter((i) => {
    const q = query.toLowerCase();
    return (
      i.invoice_number.toLowerCase().includes(q) ||
      i.status.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold text-navy-900">Your Invoices</h3>
        <div className="relative sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoices…"
            className="w-full rounded-lg border border-navy-900/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Your invoices will appear here once they are issued. This is a demo portal, so no real billing data is connected."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-navy-900/5 lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-900/10 bg-mist/50 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5">Shipment</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Issue Date</th>
                  <th className="px-5 py-3.5">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/5">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="transition-colors hover:bg-mist/40">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-navy-900">
                      {inv.invoice_number}
                    </td>
                    <td className="px-5 py-4 text-ink/60">
                      {inv.shipment_id ? (shipmentMap.get(inv.shipment_id) ?? '—') : '—'}
                    </td>
                    <td className="px-5 py-4 font-semibold text-navy-900">
                      {fmt(inv.amount, inv.currency)}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={inv.status} /></td>
                    <td className="px-5 py-4 text-ink/60">
                      {new Date(inv.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-ink/60">
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((inv) => (
              <div key={inv.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-navy-900/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-semibold text-navy-900">
                      {inv.invoice_number}
                    </div>
                    <div className="mt-1 text-lg font-bold text-navy-900">
                      {fmt(inv.amount, inv.currency)}
                    </div>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-navy-900/5 pt-3 text-xs text-ink/55">
                  <span>Issued {new Date(inv.issue_date).toLocaleDateString()}</span>
                  {inv.due_date && <span>Due {new Date(inv.due_date).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
