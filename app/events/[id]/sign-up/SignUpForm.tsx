"use client";
import updateEvent from "@/actions/update-event";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { EventType } from "@/types/Event";
import { Controller, useForm } from "react-hook-form";
interface SignUpFormProps {
  event: EventType;
  eventId: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ event, eventId }) => {
  const { toast } = useToast();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      event_items: event.event_items,
    },
  });

  const onSubmit = async (data: any) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("Updated event items:", data.event_items);
    console.log(event);
    try {
      const updatedEvent = await updateEvent(data, eventId);
      if (updatedEvent.error) {
        console.log("Error updating event:", updatedEvent.error);
        toast({
          title: "Failure",
          description: "There was an error updating the event",
        });
        return;
      } else {
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      }
    } catch (error) {
      console.error("Unexpected error updating event:", error);
      toast({
        title: "Failure",
        description: "There was an error updating the event",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {event.event_items.map((category, categoryIndex) => (
        <div key={category.name} className="mt-4">
          <h2 className="text-lg font-bold">{category.name}</h2>
          {category.items.map((item, itemIndex) => (
            <div
              key={item.name}
              className="checkboxWrapper my-2 grid max-w-[800px] grid-cols-2 items-center gap-4 text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Checkbox />
                <Label className="text-nowrap">{item.name}</Label>
              </div>
              <Controller
                name={`event_items.${categoryIndex}.items.${itemIndex}.who`}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Your name"
                    className="border-2"
                  />
                )}
              />
            </div>
          ))}
        </div>
      ))}
      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default SignUpForm;
