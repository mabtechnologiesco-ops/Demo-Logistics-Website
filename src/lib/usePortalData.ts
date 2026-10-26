import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { Shipment, SavedAddress, Invoice } from '@/lib/types';

export function usePortalData() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const [s, a, i] = await Promise.all([
      supabase.from('shipments').select('*').order('created_at', { ascending: false }),
      supabase.from('saved_addresses').select('*').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').order('issue_date', { ascending: false }),
    ]);
    if (s.error || a.error || i.error) {
      setError(s.error?.message || a.error?.message || i.error?.message || 'Failed to load data.');
    } else {
      setShipments(s.data as Shipment[]);
      setAddresses(a.data as SavedAddress[]);
      setInvoices(i.data as Invoice[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return { shipments, addresses, invoices, loading, error, reload: loadAll };
}
