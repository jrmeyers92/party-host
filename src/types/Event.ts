export type EventItem = {
  name: string;
  who: string;
  qty?: string;
};

export type EventCategory = {
  name: string;
  items: EventItem[];
};

export type EventType = {
  event_name: string;
  event_description?: string;
  event_start_time: string;
  event_end_time: string;
  event_location?: string;
  event_street_address?: string;
  event_city?: string;
  event_state?: string;
  event_zip_code?: string;
  event_guest_count?: string;
  event_date: Date; // Ensure this is Date
  event_items: EventCategory[];
};