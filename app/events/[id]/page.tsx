import { buttonVariants } from "@/components/ui/button";

import { createClient } from "@/utils/supabase/server";
import { Pencil } from "lucide-react";
import Link from "next/link";
import ShareButton from "../(event components)/ShareButton";
import DeleteEventDialog from "./edit/DeleteEventDialog";
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
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  const { event, error } = await fetchEvent(params.id);

  let usersEvent;

  if (user?.data?.user?.id == event.user_id) {
    usersEvent = true;
  } else {
    usersEvent = false;
  }

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
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">{event.event_name}</h1>
            <div className="flex flex-col gap-2">
              {usersEvent && (
                <div className="flex flex-col gap-2">
                  <ShareButton />
                  <Link
                    href={`/events/${params.id}/edit`}
                    className={buttonVariants({ variant: "secondary" })}
                  >
                    <Pencil />
                    Edit Event
                  </Link>
                  <DeleteEventDialog eventId={params.id} />
                </div>
              )}
            </div>
          </div>
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

          {event.event_items && (
            <div>
              <h2 className="mb-4 mt-8 text-xl font-bold">
                Event Sign Up List
              </h2>
              {event.event_items.map((item: any) => (
                <div key={item.name} className="mb-3 flex flex-col">
                  <h3 className="text-lg">{item.name}</h3>
                  <ul>
                    {item.items.map((subItem: any) => (
                      <div key={subItem.name}>
                        <li
                          key={subItem.name}
                          className="text-muted-foreground"
                        >
                          {subItem.name} {subItem.who && ` - ${subItem.who}`}
                        </li>
                      </div>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }
}
