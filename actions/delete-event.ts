"use server";
import { createClient } from "@/utils/supabase/server";
import { error } from "console";

interface DeleteEventResponse {
  data?: string;
  error?: string;
}

const deleteEvent = async (id: string): Promise<DeleteEventResponse> => {
  const supabase = createClient();

  // Get supabase user
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return { error: userError?.message || "User not authenticated" };
  }

  // Get the event
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("user_id")
    .eq("id", id)
    .single();

  if (eventError || !event) {
    console.error("Error fetching event:", eventError);
    return { error: eventError?.message || "Error fetching event" };
  }

  // Check if the user is the owner of the event
  if (event.user_id !== user.user.id) {
    return { error: "User not authorized to delete this event" };
  }

  // Delete the event
  const { error: deleteError } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error deleting event:", deleteError);
    return { error: deleteError.message || "Error deleting event" };
  }

  return { data: "Event deleted" };
};

export default deleteEvent;
