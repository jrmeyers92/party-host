"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventType } from "@/types/Event";
import { Minus, Plus } from "lucide-react";
import React from "react";
import { Control, UseFormRegister, useFieldArray } from "react-hook-form";

interface ItemFieldArrayProps {
  nestIndex: number;
  control: Control<EventType>;
  register: UseFormRegister<EventType>;
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
    name: `event_items.${nestIndex}.items` as const,
  });

  return (
    <div>
      {itemFields.map((item, itemIndex) => (
        <div
          key={item.id}
          className="mb-4 flex flex-col items-center gap-2 md:flex-row"
        >
          <div>
            <Label className="text-nowrap">Item Name</Label>
            <Input
              {...register(
                `event_items.${nestIndex}.items.${itemIndex}.name` as const,
              )}
              placeholder="Item Name"
            />
          </div>
          <div>
            <Label className="text-nowrap">Item Quantity (optional)</Label>
            <Input
              type="number"
              {...register(
                `event_items.${nestIndex}.items.${itemIndex}.qty` as const,
              )}
              placeholder="Item Quantity"
            />
          </div>
          <div>
            <Label className="text-nowrap">Who is bringing this?</Label>
            <Input
              {...register(
                `event_items.${nestIndex}.items.${itemIndex}.who` as const,
              )}
              placeholder="Who is bringing this?"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={() => removeItem(itemIndex)}
          >
            <Minus />
            Remove Item
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() => appendItem({ name: "", who: "" })}
      >
        <Plus /> Add Item
      </Button>
    </div>
  );
};

export default ItemFieldArray;
