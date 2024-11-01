import { z } from "zod";

const eventItemSchema = z.object({
  name: z.string(),
  who: z.string(),
  qty: z.string().optional(),
});

export const eventCategorySchema = z.object({
  name: z.string(),
  items: z.array(eventItemSchema),
});

export const eventCategoryListSchema = z.array(eventCategorySchema);

export const eventSchema = z.object({
  event_name: z.string().min(2).max(50),
  event_description: z.string().optional(),
  event_start_time: z.string(),
  event_end_time: z.string(),
  event_location: z.string().optional(),
  event_street_address: z.string().optional(),
  event_city: z.string().optional(),
  event_state: z.string().optional(),
  event_zip_code: z.string().optional(),
  event_date: z.date(),
  event_guest_count: z.string().optional(),
  event_items: eventCategoryListSchema,
});
