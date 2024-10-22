"use client";
import createEvent from "@/actions/create-event";
import { Button } from "@/components/ui/button";
import { Control, UseFormRegister } from "react-hook-form";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import states from "./states";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CIcon, SquareX } from "lucide-react";

import { Label } from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

interface FormValues {
  event_items: {
    name: string;
    items: {
      name: string;
      who: string;
    }[];
  }[];
}

interface ItemFieldArrayProps {
  nestIndex: number;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
}

const ItemFieldArray: React.FC<ItemFieldArrayProps> = ({
  nestIndex,
  control,
  register,
}) => {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `event_items.${nestIndex}.items` as const, // Array of items within a specific category
  });

  return (
    <div>
      {itemFields.map((item, itemIndex) => (
        <div key={item.id} className="my-2 flex items-center gap-2">
          <Input
            {...register(
              `event_items.${nestIndex}.items.${itemIndex}.name` as const,
            )}
            placeholder="Item Name"
          />
          <Input
            {...register(
              `event_items.${nestIndex}.items.${itemIndex}.who` as const,
            )}
            placeholder="Who is bringing this?"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => removeItem(itemIndex)}
          >
            Remove Item
          </Button>
        </div>
      ))}

      <Button
        className="my-2"
        type="button"
        onClick={() => appendItem({ name: "", who: "" })}
      >
        Add Item
      </Button>
    </div>
  );
};

const itemSchema = z.object({
  name: z.string(),
  who: z.string(),
});

const categorySchema = z.object({
  name: z.string(),
  items: z.array(itemSchema),
});

const ListSchema = z.array(categorySchema);

const formSchema = z.object({
  event_name: z.string().min(2).max(50),
  event_description: z.string().min(2).max(200),
  event_start_time: z.string(),
  event_end_time: z.string(),
  event_street_address: z.string().min(2).max(50),
  event_city: z.string().min(2).max(50),
  event_state: z.string().min(2).max(50),
  event_zip_code: z.string().min(2).max(50),
  event_date: z.date(),
  event_items: ListSchema,
});

const Page = () => {
  const router = useRouter();
  const { toast } = useToast();

  const defaultItems = [
    {
      name: "Appetizers",
      items: [
        {
          name: "chips",
          who: "",
        },
        {
          name: "salsa",
          who: "",
        },
      ],
    },
    {
      name: "Sides",
      items: [
        {
          name: "Mashed Potatoes",
          who: "",
        },
        {
          name: "Green Beans",
          who: "",
        },
      ],
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: "",
      event_description: "",
      event_start_time: "",
      event_end_time: "",
      event_street_address: "",
      event_city: "",
      event_state: "",
      event_zip_code: "",
      event_items: defaultItems,
    },
  });

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control: form.control,
    name: "event_items", // Array of categories
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      values.event_date = values.event_date.toString();
      console.log(typeof values.event_date.toString());
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

  const renderFormField = (
    name: keyof z.infer<typeof formSchema>,
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
    <section className="container flex justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <FormLabel>Event Description</FormLabel>
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
          {renderFormField(
            "event_street_address",
            "Street Address",
            "123 Main St.",
          )}
          <div className="flex items-center gap-2">
            {renderFormField("event_city", "City", "Denver")}
            <FormField
              control={form.control}
              name="event_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
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
            {renderFormField("event_zip_code", "Zip Code", "80210")}
          </div>

          {/* Other form fields like event_name, event_description can be here */}
          <div>
            <h2 className="mb-4 mt-20 text-2xl">Sign up List</h2>
            {categoryFields.map((category, categoryIndex) => (
              <div key={category.id}>
                <div className="my-4 flex justify-between">
                  {/* <h3>{category.name} </h3> */}
                  <div>
                    <Label>Category Name</Label>
                    <Input
                      {...form.register(`event_items.${categoryIndex}.name`)}
                      placeholder="Category Name"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeCategory(categoryIndex)}
                    variant="destructive"
                  >
                    <SquareX />
                  </Button>
                </div>

                {/* Items within each category */}
                <div>
                  <h4 className="text-lg">Items</h4>
                  <ItemFieldArray
                    nestIndex={categoryIndex}
                    control={form.control}
                    register={form.register}
                  />
                </div>
              </div>
            ))}

            {/* Add Category Button */}
            <Button
              type="button"
              onClick={() =>
                appendCategory({ name: "", items: [{ name: "", who: "" }] })
              }
            >
              Add Category
            </Button>
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default Page;
