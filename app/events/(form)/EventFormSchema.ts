import { z } from "zod";

const itemSchema = z.object({
  name: z.string(),
  who: z.string(),
});

const categorySchema = z.object({
  name: z.string(),
  items: z.array(itemSchema),
});

const ListSchema = z.array(categorySchema);

export const formSchema = z.object({
  event_name: z.string().min(2).max(50),
  event_description: z.string().min(2).max(200),
  event_start_time: z.string(),
  event_end_time: z.string(),
  event_street_address: z.string().min(2).max(50),
  event_city: z.string().min(2).max(50),
  event_state: z.string().min(2).max(50),
  event_zip_code: z.string().min(2).max(50),
  event_date: z.date(),
  event_items: ListSchema,
});
