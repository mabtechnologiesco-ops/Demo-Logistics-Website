import { useState, type FormEvent } from 'react';
import { Package, Plus, Trash2, X, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Shipment } from '@/lib/types';
import { StatusBadge, EmptyState } from './PortalDashboard';

const SERVICE_TYPES = ['Road Freight', 'Sea Freight', 'Air Freight', 'Warehousing', 'Express / Last-Mile', 'Other'];
const STATUSES = ['Pending', 'In Transit', 'Delivered', 'Delayed', 'Cancelled'];

export function ShipmentsTab({
  shipments,
  reload,
}: {
  shipments: Shipment[];
  reload: () => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = shipments.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.tracking_number.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q) ||
      s.service_type.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink/35" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shipments…"
            className="w-full rounded-lg border border-navy-900/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
          />
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary !py-2.5">
          <Plus className="h-4 w-4" />
          Add Shipment
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No shipments yet"
          description="Track your shipments here. Add your first shipment record to get started."
          action={
            <button onClick={() => setShowForm(true)} className="btn-primary !py-2.5">
              <Plus className="h-4 w-4" />
              Add Shipment
            </button>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-navy-900/5 lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-900/10 bg-mist/50 text-left text-xs font-semibold uppercase tracking-wide text-ink/50">
                  <th className="px-5 py-3.5">Tracking #</th>
                  <th className="px-5 py-3.5">Route</th>
                  <th className="px-5 py-3.5">Service</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/5">
                {filtered.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-mist/40">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-navy-900">
                      {s.tracking_number}
                    </td>
                    <td className="px-5 py-4 text-ink/70">
                      <span className="block max-w-[200px] truncate">{s.origin}</span>
                      <span className="text-ink/40">→</span>
                      <span className="block max-w-[200px] truncate">{s.destination}</span>
                    </td>
                    <td className="px-5 py-4 text-ink/70">{s.service_type}</td>
                    <td className="px-5 py-4"><StatusBadge status={s.status} /></td>
                    <td className="px-5 py-4 text-ink/60">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <DeleteButton id={s.id} table="shipments" reload={reload} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtered.map((s) => (
              <div key={s.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-navy-900/5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-semibold text-navy-900">
                      {s.tracking_number}
                    </div>
                    <div className="mt-1 text-sm text-ink/70">
                      {s.origin} → {s.destination}
                    </div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-navy-900/5 pt-3">
                  <span className="text-xs text-ink/55">
                    {s.service_type} · {new Date(s.created_at).toLocaleDateString()}
                  </span>
                  <DeleteButton id={s.id} table="shipments" reload={reload} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showForm && (
        <ShipmentForm onClose={() => setShowForm(false)} onSaved={reload} />
      )}
    </div>
  );
}

function ShipmentForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState({
    tracking_number: '',
    origin: '',
    destination: '',
    service_type: 'Road Freight',
    status: 'Pending',
    weight_kg: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.tracking_number.trim() || !form.origin.trim() || !form.destination.trim()) {
      setError('Tracking number, origin, and destination are required.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('shipments').insert({
      tracking_number: form.tracking_number.trim(),
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      service_type: form.service_type,
      status: form.status,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await onSaved();
    onClose();
  };

  return (
    <Modal title="Add Shipment" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Tracking Number *">
          <input
            type="text"
            value={form.tracking_number}
            onChange={(e) => setForm({ ...form, tracking_number: e.target.value })}
            placeholder="e.g. NX-2026-00123"
            className={inputCls}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Origin *">
            <input
              type="text"
              value={form.origin}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
              placeholder="Pickup location"
              className={inputCls}
            />
          </Field>
          <Field label="Destination *">
            <input
              type="text"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              placeholder="Delivery location"
              className={inputCls}
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Service Type">
            <select
              value={form.service_type}
              onChange={(e) => setForm({ ...form, service_type: e.target.value })}
              className={inputCls}
            >
              {SERVICE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={inputCls}
            >
              {STATUSES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Weight (kg)">
            <input
              type="number"
              step="0.1"
              value={form.weight_kg}
              onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
              placeholder="0"
              className={inputCls}
            />
          </Field>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-outline !py-2.5">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary !py-2.5 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Shipment'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Shared helpers
const inputCls =
  'w-full rounded-lg border border-navy-900/15 bg-white py-2.5 px-3.5 text-sm text-ink placeholder:text-ink/40 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-900">{label}</span>
      {children}
    </label>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-900/60 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-navy-900/10 px-6 py-4">
          <h3 className="text-lg font-bold text-navy-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/50 transition-colors hover:bg-mist hover:text-navy-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function DeleteButton({
  id,
  table,
  reload,
}: {
  id: string;
  table: 'shipments' | 'saved_addresses' | 'invoices';
  reload: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const del = async () => {
    setBusy(true);
    await supabase.from(table).delete().eq('id', id);
    setBusy(false);
    await reload();
  };

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        aria-label="Delete"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={del}
        disabled={busy}
        className="rounded-md bg-red-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
      >
        {busy ? '…' : 'Delete'}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="rounded-md px-2 py-1 text-xs font-medium text-ink/50 hover:text-ink"
      >
        Cancel
      </button>
    </div>
  );
}
