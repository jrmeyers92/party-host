import EventForm from "@/app/events/_components/EventForm";
import { createClient } from "@/utils/supabase/server";

const getEventCount = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user.id);

  const { count: totalEvents, error: countError } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true }) // Only get the count, no data
    .eq("user_id", user.id);

  if (countError) {
    return { events: [], error: countError, totalEvents: 0 };
  }
  return { totalEvents };
};

const page = async () => {
  const { totalEvents } = await getEventCount();

  if (totalEvents >= 4) {
    return (
      <div>
        Event limit reached. Please upgrade to pro to create another event
      </div>
    );
  }

  return (
    <div>
      <EventForm />
    </div>
  );
};

export default page;
