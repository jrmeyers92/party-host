import { z } from "zod";

const eventItemSchema = z.object({
  name: z.string(),
  who: z.string().optional(),
  qty: z.string().optional(),
});

const eventCategorySchema = z.object({
  name: z.string(),
  items: z.array(eventItemSchema),
});

const eventCategoryListSchema = z.array(eventCategorySchema);
const additionalItemsSchema = z.array(eventItemSchema);

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
  event_enable_additional_items: z.boolean().optional(),
  event_guest_count: z.string().optional(),
  event_items: eventCategoryListSchema,
  event_additional_items: additionalItemsSchema.optional(),
});
