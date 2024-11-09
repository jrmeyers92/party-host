"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import updateEvent from "@/server/actions/update-event";
import { EventCategory, EventType } from "@/types/Event";
import { useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";

interface SignUpFormProps {
  event: EventType;
  eventId: string;
}

interface FormValues {
  event_name?: string;
  event_description?: string;
  event_start_time?: string;
  event_end_time?: string;
  event_location?: string;
  event_street_address?: string;
  event_city?: string;
  event_state?: string;
  event_zip_code?: string;
  event_guest_count?: string;
  event_enable_additional_items?: boolean;
  event_date?: Date;
  event_items: {
    name: string;
    items: {
      name: string;
      who?: string;
      qty?: string;
      checked?: boolean;
    }[];
  }[];
  event_additional_items: {
    name: string;
    who: string;
  }[];
}

const SignUpForm: React.FC<SignUpFormProps> = ({ event, eventId }) => {
  const [somethingElse, setSomethingElse] = useState(false);
  const { toast } = useToast();
  const { control, handleSubmit, register, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        event_items: event.event_items.map((category) => ({
          ...category,
          items: category.items.map((item) => ({
            ...item,
            checked: false,
          })),
        })),
        event_additional_items: event.event_additional_items || [],
      },
    });

  const { fields, append } = useFieldArray({
    control,
    name: "event_additional_items",
  });

  const onSubmit = async (data: FormValues) => {
    // Preserve all items, marking unchecked items with an empty string only if they don't already have a value
    data.event_items.forEach((category) => {
      category.items.forEach((item) => {
        if (!item.checked && !item.who) {
          item.who = "";
        }
      });
    });

    try {
      const updatedEvent = await updateEvent(data, eventId);
      if (updatedEvent.error) {
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
      toast({
        title: "Failure",
        description: "There was an error updating the event",
      });
    }
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {event.event_items.map((category, categoryIndex) => (
        <div key={category.name} className="mt-4">
          <h2 className="text-lg font-bold">{category.name}</h2>
          {category.items.map((item, itemIndex) => (
            <div key={item.name}>
              <div
                key={item.name}
                className="checkboxWrapper my-2 grid max-w-[800px] grid-cols-2 items-center gap-4 text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  {!item.who && (
                    <Controller
                      name={`event_items.${categoryIndex}.items.${itemIndex}.checked`}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (!checked) {
                              setValue(
                                `event_items.${categoryIndex}.items.${itemIndex}.who`,
                                "",
                              );
                            }
                          }}
                        />
                      )}
                    />
                  )}
                  <Label className="text-nowrap">{item.name}</Label>
                </div>

                {item.who && <p>{item.who}</p>}
                {!item.who &&
                  watch(
                    `event_items.${categoryIndex}.items.${itemIndex}.checked`,
                  ) && (
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
                  )}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="my-4">
        {event.event_enable_additional_items && (
          <>
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold">
                Want to bring something else?
              </h2>
              <div className="flex items-center gap-2">
                <Label className="text-nowrap">Yes</Label>
                <Checkbox
                  onCheckedChange={(checkedState) =>
                    setSomethingElse(checkedState as boolean)
                  }
                />
              </div>
            </div>
            {somethingElse && (
              <div className="my-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="my-2 flex max-w-[800px] justify-between gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-1/2">
                      {field.name ? (
                        <p>{field.name}</p>
                      ) : (
                        <Input
                          placeholder="Green Beans"
                          className="border-2"
                          {...register(`event_additional_items.${index}.name`)}
                        />
                      )}
                    </div>
                    <div className="w-1/2">
                      {field.who ? (
                        <p>{field.who}</p>
                      ) : (
                        <Input
                          placeholder="Jane Doe"
                          className="border-2"
                          {...register(`event_additional_items.${index}.who`)}
                        />
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => append({ name: "", who: "" })}
                >
                  Add Another Item
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default SignUpForm;
