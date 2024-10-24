"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
import ItemFieldArray from "./itemFieldArray";

interface CategoryFieldArrayProps {
  control: Control<any>;
  register: UseFormRegister<any>;
}

const CategoryFieldArray: React.FC<CategoryFieldArrayProps> = ({
  control,
  register,
}) => {
  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "event_items" as const,
  });

  return (
    <div>
      {categoryFields.map((category, categoryIndex) => (
        <div key={category.id} className="mb-8">
          <h3>Category {categoryIndex + 1}</h3>
          <Input
            {...register(`event_items.${categoryIndex}.name` as const)}
            placeholder="Category Name"
          />

          <ItemFieldArray
            nestIndex={categoryIndex}
            control={control}
            register={register}
          />

          <Button type="button" onClick={() => removeCategory(categoryIndex)}>
            Remove Category
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={() =>
          appendCategory({ name: "", items: [{ name: "", who: "" }] })
        }
      >
        Add Category
      </Button>
    </div>
  );
};

export default CategoryFieldArray;
