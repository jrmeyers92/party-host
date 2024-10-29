"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventType } from "@/types/Event";
import { Controller, useForm } from "react-hook-form";
interface SignUpFormProps {
  event: EventType;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ event }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      event_items: event.event_items,
    },
  });

  const onSubmit = (data: any) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("Updated event items:", data.event_items);
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
