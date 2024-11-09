import { createClient } from "@/utils/supabase/server";
import EventForm from "../../_components/EventForm";

const fetchEvent = async (id: string) => {
  console.log("edit");
  const supabase = createClient();

  const user = await supabase.auth.getUser();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (user?.data?.user?.id != event.user_id) {
    return { error: "User not authorized to edit this event" };
  }

  return { event, error };
};

const page = async ({ params }: { params: { id: string } }) => {
  // get id from url parameters
  const event = await fetchEvent(params.id);

  console.log(params.id);

  return (
    <div>
      <EventForm event={event.event} eventId={params.id} />
    </div>
  );
};

export default page;
