export type ShipmentStatus = 'Pending' | 'In Transit' | 'Delivered' | 'Delayed' | 'Cancelled';
export type InvoiceStatus = 'Unpaid' | 'Paid' | 'Overdue' | 'Cancelled';

export interface Shipment {
  id: string;
  user_id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  service_type: string;
  status: ShipmentStatus | string;
  weight_kg: number | null;
  created_at: string;
  updated_at: string;
  delivered_at: string | null;
}

export interface SavedAddress {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  street: string;
  city: string;
  country: string;
  postal_code: string | null;
  phone: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  shipment_id: string | null;
  amount: number;
  currency: string;
  status: InvoiceStatus | string;
  issue_date: string;
  due_date: string | null;
  created_at: string;
}
