import { createClient } from "@/utils/supabase/server";
import { useParams } from "next/navigation";

const fetchEvent = async (id: string) => {
  const supabase = createClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  return { event, error };
};

const page = async ({ params }: { params: { id: string } }) => {
  // get id from url parameters
  const event = await fetchEvent(params.id);
  console.log(event);

  return <div>My Post: {params.id}</div>;
};

export default page;
