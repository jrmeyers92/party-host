import { createClient } from "@/utils/supabase/server";

const fetchEvent = async (id: string) => {
  const supabase = createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  return { event, error };
};

export default async function Page({ params }: { params: { id: string } }) {
  const { event, error } = await fetchEvent(params.id);

  if (error) {
    console.error("Error fetching event: ", error);
    return <div>Error fetching event</div>;
  } else {
    const eventDate = new Date(event.event_date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const eventStartTime = new Date(
      `1970-01-01T${event.event_start_time}`,
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    const eventEndTime = new Date(
      `1970-01-01T${event.event_end_time}`,
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return (
      <section className="container my-12 flex w-full items-center justify-center">
        <div>
          <h1 className="text-4xl font-bold">{event.event_name}</h1>
          <p className="text-sm text-muted-foreground">
            {event.event_description}
          </p>
          <h2 className="mt-4 text-xl font-bold">When?</h2>
          <p>{eventDate}</p>
          <p>
            {eventStartTime} to {eventEndTime}
          </p>
          <h2 className="mt-4 text-xl font-bold">Where?</h2>
          <p>{event.event_street_address}</p>
          <p>
            {event.event_city}, {event.event_state} {event.event_zip_code}
          </p>
        </div>
      </section>
    );
  }
}
