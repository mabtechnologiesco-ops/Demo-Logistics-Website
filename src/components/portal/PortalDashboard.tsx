import { useState } from 'react';
import {
  Truck, MapPin, FileText, LogOut, ArrowLeft, Package, Plus, Trash2,
  CheckCircle2, Clock, AlertTriangle, XCircle, Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { usePortalData } from '@/lib/usePortalData';
import { ShipmentsTab } from './ShipmentsTab';
import { AddressesTab } from './AddressesTab';
import { InvoicesTab } from './InvoicesTab';

type Tab = 'shipments' | 'addresses' | 'invoices';

const TABS: { key: Tab; label: string; icon: typeof Truck }[] = [
  { key: 'shipments', label: 'Shipment History', icon: Package },
  { key: 'addresses', label: 'Saved Addresses', icon: MapPin },
  { key: 'invoices', label: 'Invoices', icon: FileText },
];

export function PortalDashboard({ onExit }: { onExit: () => void }) {
  const { user, signOut } = useAuth();
  const { shipments, addresses, invoices, loading, error, reload } = usePortalData();
  const [tab, setTab] = useState<Tab>('shipments');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-mist">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-navy-900/10 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-600 shadow-md shadow-accent-500/30">
              <Truck className="h-5 w-5 text-white" />
            </span>
            <div>
              <div className="font-display text-sm font-bold leading-tight text-navy-900">
                NEXORA<span className="text-accent-500"> PORTAL</span>
              </div>
              <div className="text-xs text-ink/50">Customer Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink/60 sm:block">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Back link */}
        <button
          onClick={onExit}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors hover:text-navy-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </button>

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            Manage your shipments, saved addresses, and invoices.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <SummaryCard icon={Package} label="Shipments" value={shipments.length} />
          <SummaryCard icon={MapPin} label="Addresses" value={addresses.length} />
          <SummaryCard
            icon={FileText}
            label="Open Invoices"
            value={invoices.filter((i) => i.status === 'Unpaid' || i.status === 'Overdue').length}
          />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-navy-900/5">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                tab === key
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'text-ink/60 hover:bg-mist hover:text-navy-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-ink/50">
            <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
            <p className="mt-3 text-sm">Loading your data…</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 px-6 py-8 text-center text-sm text-red-700">
            {error}
          </div>
        ) : (
          <>
            {tab === 'shipments' && <ShipmentsTab shipments={shipments} reload={reload} />}
            {tab === 'addresses' && <AddressesTab addresses={addresses} reload={reload} />}
            {tab === 'invoices' && <InvoicesTab invoices={invoices} shipments={shipments} />}
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Truck;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-navy-900/5 sm:p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-500">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <div className="text-xl font-bold text-navy-900 sm:text-2xl">{value}</div>
        <div className="truncate text-xs font-medium text-ink/55">{label}</div>
      </div>
    </div>
  );
}

// Export status badge helper for child components
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: typeof CheckCircle2; cls: string }> = {
    Delivered: { icon: CheckCircle2, cls: 'bg-green-50 text-green-700' },
    Paid: { icon: CheckCircle2, cls: 'bg-green-50 text-green-700' },
    'In Transit': { icon: Clock, cls: 'bg-blue-50 text-blue-700' },
    Pending: { icon: Clock, cls: 'bg-amber-50 text-amber-700' },
    Unpaid: { icon: Clock, cls: 'bg-amber-50 text-amber-700' },
    Delayed: { icon: AlertTriangle, cls: 'bg-orange-50 text-orange-700' },
    Overdue: { icon: AlertTriangle, cls: 'bg-red-50 text-red-700' },
    Cancelled: { icon: XCircle, cls: 'bg-gray-100 text-gray-600' },
  };
  const conf = map[status] ?? { icon: Clock, cls: 'bg-gray-100 text-gray-600' };
  const Icon = conf.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${conf.cls}`}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: typeof Plus;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-navy-900/15 bg-white px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mist text-ink/40">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-navy-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink/55">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
