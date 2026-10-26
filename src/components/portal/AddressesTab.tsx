import { useState, type FormEvent } from 'react';
import { MapPin, Plus, Pencil, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SavedAddress } from '@/lib/types';
import { EmptyState } from './PortalDashboard';
import { Modal, DeleteButton } from './ShipmentsTab';

export function AddressesTab({
  addresses,
  reload,
}: {
  addresses: SavedAddress[];
  reload: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy-900">Saved Delivery Addresses</h3>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="btn-primary !py-2.5"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No saved addresses"
          description="Save your frequently used delivery addresses here for quick access when booking shipments."
          action={
            <button onClick={() => setShowForm(true)} className="btn-primary !py-2.5">
              <Plus className="h-4 w-4" />
              Add Address
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="group relative rounded-xl bg-white p-5 shadow-sm ring-1 ring-navy-900/5 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-accent-500">
                  <MapPin className="h-5 w-5" />
                </span>
                {a.is_default && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent-500/10 px-2.5 py-1 text-xs font-semibold text-accent-600">
                    <Star className="h-3 w-3" />
                    Default
                  </span>
                )}
              </div>
              <h4 className="mt-3 text-base font-bold text-navy-900">{a.label}</h4>
              <p className="mt-1 text-sm font-medium text-ink/75">{a.recipient_name}</p>
              <div className="mt-2 text-sm leading-relaxed text-ink/60">
                <p>{a.street}</p>
                <p>{a.city}{a.postal_code ? ` ${a.postal_code}` : ''}</p>
                <p>{a.country}</p>
                {a.phone && <p className="mt-1">{a.phone}</p>}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-navy-900/5 pt-3">
                <button
                  onClick={() => { setEditing(a); setShowForm(true); }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-500 hover:text-accent-600"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <DeleteButton id={a.id} table="saved_addresses" reload={reload} />
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AddressForm
          address={editing}
          onClose={() => setShowForm(false)}
          onSaved={reload}
        />
      )}
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-navy-900/15 bg-white py-2.5 px-3.5 text-sm text-ink placeholder:text-ink/40 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30';

function AddressForm({
  address,
  onClose,
  onSaved,
}: {
  address: SavedAddress | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState({
    label: address?.label ?? '',
    recipient_name: address?.recipient_name ?? '',
    street: address?.street ?? '',
    city: address?.city ?? '',
    country: address?.country ?? '',
    postal_code: address?.postal_code ?? '',
    phone: address?.phone ?? '',
    is_default: address?.is_default ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.label.trim() || !form.recipient_name.trim() || !form.street.trim() || !form.city.trim() || !form.country.trim()) {
      setError('Label, recipient, street, city, and country are required.');
      return;
    }
    setSaving(true);
    // If setting as default, unset others first
    if (form.is_default && !address?.is_default) {
      await supabase.from('saved_addresses').update({ is_default: false }).eq('is_default', true);
    }
    const payload = {
      label: form.label.trim(),
      recipient_name: form.recipient_name.trim(),
      street: form.street.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      postal_code: form.postal_code.trim() || null,
      phone: form.phone.trim() || null,
      is_default: form.is_default,
    };
    const { error } = address
      ? await supabase.from('saved_addresses').update(payload).eq('id', address.id)
      : await supabase.from('saved_addresses').insert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    await onSaved();
    onClose();
  };

  return (
    <Modal title={address ? 'Edit Address' : 'Add Address'} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Label *">
            <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Warehouse A" className={inputCls} />
          </Field>
          <Field label="Recipient Name *">
            <input type="text" value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} placeholder="Contact name" className={inputCls} />
          </Field>
        </div>
        <Field label="Street *">
          <input type="text" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Street address" className={inputCls} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="City *">
            <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className={inputCls} />
          </Field>
          <Field label="Postal Code">
            <input type="text" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} placeholder="Postal code" className={inputCls} />
          </Field>
          <Field label="Country *">
            <input type="text" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className={inputCls} />
          </Field>
        </div>
        <Field label="Phone">
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Contact phone" className={inputCls} />
        </Field>
        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
            className="h-4 w-4 rounded border-navy-900/20 text-accent-500 focus:ring-accent-500"
          />
          <span className="text-sm font-medium text-navy-900">Set as default address</span>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-outline !py-2.5">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary !py-2.5 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Address'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy-900">{label}</span>
      {children}
    </label>
  );
}
