"use server";
import { createClient } from "@/utils/supabase/server";

interface EventItem {
  name: string;
  who?: string;
  qty?: string;
}

interface EventCategory {
  name: string;
  items: EventItem[];
}

interface UpdateEventItemsData {
  event_items: EventCategory[];
}

interface UpdateEventResult {
  data?: any[];
  error?: string;
}

const updateEventItems = async (
  eventItemsData: UpdateEventItemsData,
  eventId: string,
): Promise<UpdateEventResult> => {
  try {
    const supabase = createClient();

    // Fetch the current event items
    const { data: currentEvent, error: fetchError } = await supabase
      .from("events")
      .select("event_items")
      .eq("id", eventId)
      .single();

    if (fetchError) {
      console.error("Error fetching current event items:", fetchError);
      return {
        error: fetchError.message || "Error fetching current event items",
      };
    }

    // Merge the new event items with the current event items
    const mergedEventItems = currentEvent.event_items.map(
      (category: EventCategory, categoryIndex: number) => ({
        ...category,
        items: category.items.map((item: EventItem, itemIndex: number) => ({
          ...item,
          who:
            item.who ||
            eventItemsData.event_items[categoryIndex].items[itemIndex].who,
        })),
      }),
    );

    // Update the event items
    const { data, error } = await supabase
      .from("events")
      .update({ event_items: mergedEventItems })
      .eq("id", eventId)
      .select();

    if (error) {
      console.error("Error updating event items:", error);
      return { error: error.message || "Error updating event items" };
    }

    return { data };
  } catch (error) {
    console.error("Unexpected error updating event items:", error);
    return { error: "Unexpected error updating event items" };
  }
};

export default updateEventItems;
