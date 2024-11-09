"use server";
import { createClient } from "@/utils/supabase/server";

interface EventData {
  event_name?: string;
  event_description?: string;
  event_start_time?: string;
  event_end_time?: string;
  event_location?: string;
  event_street_address?: string;
  event_city?: string;
  event_state?: string;
  event_zip_code?: string;
  event_enable_additional_items?: boolean;
  event_date?: Date | string;
}

interface UpdateEventResult {
  data?: any[];
  error?: string;
}

const updateEvent = async (
  eventData: EventData,
  eventId: string,
): Promise<UpdateEventResult> => {
  console.log("Event Data:", eventData);
  console.log("Event ID:", eventId);
  try {
    if (eventData.event_date instanceof Date) {
      eventData.event_date = eventData.event_date.toISOString();
    }
    const supabase = createClient();
    const { data, error } = await supabase
      .from("events")
      .update(eventData)
      .eq("id", eventId)
      .select();

    console.log("Data:", data);

    if (error) {
      console.error("Error updating event:", error);
      return { error: error.message || "Error updating event" };
    }

    console.log("Update successful:", data);
    return { data };
  } catch (error) {
    console.error("Unexpected error updating event:", error);
    return { error: "Unexpected error updating event" };
  }
};

export default updateEvent;
