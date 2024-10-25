"use server";
import { createClient } from "@/utils/supabase/server";

interface EventData {
  event_name: string;
  event_description: string;
  event_start_time: string;
  event_end_time: string;
  event_street_address: string;
  event_city: string;
  event_state: string;
  event_zip_code: string;
  event_date: Date | string;
}

const createEvent = async (eventData: EventData) => {
  try {
    eventData.event_date = eventData.event_date.toString();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("events")
      .insert([eventData])
      .select(); // Ensure the ID is returned

    if (error) {
      console.error("Error creating event: ", error);
      return { error: error.message || "Error creating event" };
    }

    return { data };
  } catch (error) {
    console.error("Unexpected error creating event: ", error);
    return { error: "Unexpected error creating event" };
  }
};

export default createEvent;
