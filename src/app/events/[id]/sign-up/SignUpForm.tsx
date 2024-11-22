"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import updateEventItems from "@/server/actions/sign-up";
import { EventType } from "@/types/Event";
import { Controller, useForm } from "react-hook-form";

interface SignUpFormProps {
  event: EventType;
  eventId: string;
}

interface FormValues {
  event_items: {
    name: string;
    items: {
      name: string;
      who?: string;
      qty?: string;
    }[];
  }[];
}

const SignUpForm: React.FC<SignUpFormProps> = ({ event, eventId }) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      event_items: event.event_items.map((category) => ({
        ...category,
        items: category.items.map((item) => ({
          ...item,
          who: item.who || "", // Ensure who is initialized
        })),
      })),
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await updateEventItems(
        { event_items: data.event_items },
        eventId,
      );
      if (result.error) {
        toast({
          title: "Failure",
          description: "There was an error updating the event items",
        });
        return;
      } else {
        toast({
          title: "Success",
          description: "Event items updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Failure",
        description: "There was an error updating the event items",
      });
    }
    window.location.reload();
  };

  return (
    <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
      {event.event_items.map((category, categoryIndex) => (
        <div key={category.name} className="mb-4">
          <h2 className="mb-2 text-lg">{category.name}</h2>
          {category.items.map((item, itemIndex) => (
            <div
              key={item.name}
              className="my-2 flex max-w-[400px] items-center justify-between"
            >
              <Input value={item.name} disabled />
              {!item.who && (
                <Controller
                  name={`event_items.${categoryIndex}.items.${itemIndex}.who`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Your name"
                      className="w-[200px]"
                    />
                  )}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default SignUpForm;
