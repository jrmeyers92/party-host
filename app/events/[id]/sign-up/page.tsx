import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventType } from "@/types/Event";
import { createClient } from "@/utils/supabase/server";
import SignUpForm from "./SignUpForm";

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
  const { event, error }: { event: EventType; error: any } = await fetchEvent(
    params.id,
  );
  if (error) {
    console.error("Error fetching event: ", error);
    return <div>Error fetching event</div>;
  }

  console.log(event);
  console.log(event.event_items);

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

  const eventDate = new Date(event.event_date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle className="text-3xl">{event.event_name}</CardTitle>
        {event.event_description && (
          <p className="text-muted-foreground">{event.event_description}</p>
        )}
        <p>
          <span className="font-bold">Date:</span> {eventDate}
        </p>
        <p>
          <span className="font-bold">Start:</span> {eventStartTime}
        </p>
        <p>
          <span className="font-bold">End:</span> {eventEndTime}
        </p>
        <p className="mt-2">{event.event_street_address}</p>
        <p>
          {event.event_city}
          {event.event_state ? "," : ""} {event.event_state}{" "}
          {event.event_zip_code}
        </p>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold">Sign Up</h2>
        <p>Sign up to bring a dish to pass at this event.</p>
        <SignUpForm event={event} />
      </CardContent>
    </Card>
  );
}
