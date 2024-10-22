"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { Control, UseFormRegister, useFieldArray } from "react-hook-form";

interface ItemFieldArrayProps {
  nestIndex: number;
  control: Control<any>;
  register: UseFormRegister<any>;
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
        <div key={item.id} className="mb-4">
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
          <Button type="button" onClick={() => removeItem(itemIndex)}>
            Remove Item
          </Button>
        </div>
      ))}
      <Button type="button" onClick={() => appendItem({ name: "", who: "" })}>
        Add Item
      </Button>
    </div>
  );
};

export default ItemFieldArray;
