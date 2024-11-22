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
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-4xl">{event.event_name}</CardTitle>
          {event.event_description && (
            <p className="text-muted-foreground">{event.event_description}</p>
          )}
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-bold">When</h2>
          <p>
            <span className="font-bold">Date:</span> {eventDate}
          </p>
          <p>
            <span className="font-bold">Start:</span> {eventStartTime}
          </p>
          <p>
            <span className="font-bold">End:</span> {eventEndTime}
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-2xl font-bold">Where</h2>
          <p>{event.event_location}</p>
          <p className="mt-2">{event.event_street_address}</p>
          <p>
            {event.event_city}
            {event.event_state ? "," : ""} {event.event_state}{" "}
            {event.event_zip_code}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <h2 className="mb-2 text-2xl font-bold">Sign Up</h2>
        <p>
          Sign up to bring a dish to pass at this event. There are{" "}
          {event.event_guest_count} people invited to this event.
        </p>
        <SignUpForm event={event} eventId={params.id} />
      </CardContent>
    </Card>
  );
}
