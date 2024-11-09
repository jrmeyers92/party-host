import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const fetchUser = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};

const fetchEvents = async (userId: string) => {
  const supabase = createClient();

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .gte("event_date", today) // Filter for today or future dates
    .limit(15); // Limit to 15 events

  return { events, error };
};

const Events = async () => {
  const user = await fetchUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const { events, error } = await fetchEvents(user.id);

  if (error) {
    console.error("Error fetching events: ", error);
    return <div>Error fetching events</div>;
  } else {
  }

  return (
    <div className="container">
      <div className="my-12 flex items-center justify-between">
        <p className="text-xl font-bold">Hi, {user.email}!</p>
        <Link href="/events/create" className={buttonVariants()}>
          Create an event
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {events &&
          events.map((event) => {
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

            const eventDate = new Date(event.event_date).toLocaleDateString(
              "en-US",
              {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              },
            );

            const today = new Date();
            const eventDateObj = new Date(event.event_date);

            // Calculate the difference in time
            const timeDifference = eventDateObj.getTime() - today.getTime();

            // Convert the difference in time to days
            const daysDifference = Math.ceil(
              timeDifference / (1000 * 3600 * 24),
            );

            return (
              <Card key={event.id} className="grid">
                <CardHeader>
                  <Badge className="absolute -translate-y-8 self-end">
                    {daysDifference} Days Away
                  </Badge>
                  <CardTitle className="text-2xl font-semibold">
                    {event.event_name}
                  </CardTitle>
                  <CardDescription>{event.event_description}</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/events/${event.id}`}
                    className={buttonVariants()}
                  >
                    View event
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
      </section>
    </div>
  );
};

export default Events;
