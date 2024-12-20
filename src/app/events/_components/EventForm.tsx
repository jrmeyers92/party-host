"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { eventSchema } from "@/schemas/event";
import createEvent from "@/server/actions/create-event";
import { EventType } from "@/types/Event";
import { createClient } from "@/utils/supabase/client";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CIcon, Minus, Plus } from "lucide-react";
import Link from "next/link";
import states from "../_data/States";

import updateEvent from "@/server/actions/update-event";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import ItemFieldArray from "./ItemFieldArray"; // Adjust the import path as needed

interface EventFormProps {
  event?: EventType | null;
  eventId?: string;
}

const EventForm: React.FC<EventFormProps> = ({ event, eventId }) => {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const user = supabase.auth.getUser();

  if (!user) {
    router.push("/login");
    return null;
  }

  const defaultEventItems = [
    {
      name: "",
      items: [
        {
          name: "",
          who: "",
        },
      ],
    },
  ];

  const defaultValues = {
    event_name: event?.event_name || "",
    event_description: event?.event_description || "",
    event_start_time: event?.event_start_time || "",
    event_end_time: event?.event_end_time || "",
    event_street_address: event?.event_street_address || "",
    event_city: event?.event_city || "",
    event_state: event?.event_state || "",
    event_zip_code: event?.event_zip_code || "",
    event_guest_count: event?.event_guest_count || "",
    event_enable_additional_items: event?.event_enable_additional_items || true,
    event_date: event ? new Date(event.event_date) : new Date(),
    event_items: event?.event_items || defaultEventItems,
    event_additional_items: event?.event_additional_items || [],
  };

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control: form.control,
    name: "event_items",
  });

  async function onSubmit(values: z.infer<typeof eventSchema>) {
    if (event) {
      try {
        const updatedEvent = await updateEvent(values, eventId!);
        toast({
          title: "Success",
          description: "Your event has been updated.",
        });
        if (updatedEvent.data && updatedEvent.data.length > 0) {
          router.push(`/events/${updatedEvent.data[0].id}`);
        }
      } catch (error) {
        console.error("Error updating event:", error);
        toast({
          title: "Error",
          description:
            "There was an error updating your event. Please try again.",
        });
      }
    } else {
      try {
        const newEvent = await createEvent(values);
        form.reset();
        toast({
          title: "Success",
          description: "Your event has been created.",
        });
        if (newEvent.data && newEvent.data.length > 0) {
          router.push(`/events/${newEvent.data[0].id}`);
        }
      } catch (error) {
        console.error("Error creating event:", error);
        toast({
          title: "Error",
          description:
            "There was an error creating your event. Please try again.",
        });
      }
    }
  }

  const renderFormField = (
    name: keyof z.infer<typeof eventSchema>,
    label: string,
    placeholder: string,
    type: string = "text",
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              type={type}
              value={
                field.value instanceof Date
                  ? field.value.toISOString().split("T")[0] // Convert Date to string
                  : Array.isArray(field.value)
                    ? JSON.stringify(field.value) // Convert array to string
                    : typeof field.value === "boolean"
                      ? field.value.toString() // Convert boolean to string
                      : field.value
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <section className="container my-20 flex flex-col justify-center">
      <h1 className="mb-6 text-center text-3xl">Create an Event!</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-2xl space-y-8"
        >
          {renderFormField(
            "event_name",
            "Event Name",
            "Maddie's Birthday Party",
          )}

          <FormField
            control={form.control}
            name="event_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Description (optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="We're all getting together to celebrate Maddie's 40th birthday."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="event_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {renderFormField("event_start_time", "Start Time", "", "time")}
            {renderFormField("event_end_time", "End Time", "", "time")}
          </div>
          {renderFormField("event_guest_count", "Guest Count", "", "number")}

          {renderFormField(
            "event_location",
            "Event Location (optional)",
            "Tower Grove Park",
          )}

          {renderFormField(
            "event_street_address",
            "Street Address (optional)",
            "123 Main St.",
          )}
          <div className="flex items-center gap-2">
            {renderFormField("event_city", "City (optional)", "Denver")}
            <FormField
              control={form.control}
              name="event_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State (optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            {renderFormField("event_zip_code", "Zip Code (optional)", "80210")}
          </div>

          <FormField
            control={form.control}
            name="event_enable_additional_items"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Enable guests to sign up for to bring assitional items that
                    are not on your curated list
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div>
            <h2 className="mb-4 mt-20 text-2xl">Sign up List</h2>
            {categoryFields.map((category, categoryIndex) => (
              <div key={category.id} className="border-b py-6">
                <div className="mb-4 flex justify-between">
                  <div className="flex flex-1 flex-col items-start justify-between gap-2 md:flex-row">
                    <Label
                      htmlFor={`event_items.${categoryIndex}.name`}
                      className="text-nowrap text-lg"
                    >
                      Category Name:
                    </Label>
                    <Input
                      className="text-xl"
                      {...form.register(`event_items.${categoryIndex}.name`)}
                      placeholder="Appetizers"
                    />
                  </div>
                </div>

                <div>
                  <ItemFieldArray
                    nestIndex={categoryIndex}
                    control={form.control}
                    register={form.register}
                  />
                </div>
                <Button
                  type="button"
                  className="mt-4"
                  onClick={() => removeCategory(categoryIndex)}
                  variant="destructive"
                >
                  <Minus />
                  Delete Category & Items
                </Button>
              </div>
            ))}

            <Button
              className="mt-4"
              type="button"
              variant="secondary"
              onClick={() =>
                appendCategory({ name: "", items: [{ name: "", who: "" }] })
              }
            >
              Add Category <Plus />
            </Button>
          </div>

          <Button
            type="submit"
            className="block w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? event
                ? "Updating..."
                : "Creating..."
              : event
                ? "Update Event"
                : "Create Event"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default EventForm;
