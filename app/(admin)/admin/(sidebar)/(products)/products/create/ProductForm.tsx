"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createProduct } from "./actions";
import { useState } from "react";
import { toast } from "sonner";
import { CreateProductInput, createProductSchema } from "./validations";
import { ALLOWED_IMAGE_TYPES } from "./types";

export function CreateProductForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      productName: "",
      category: [],
      description: "",
      sellingPrice: 0,
      isPublished: true,
    },
  });

  async function onSubmit(data: CreateProductInput) {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("productImage", data.productImage);
      formData.append("productName", data.productName);
      data.category.forEach((cat) => formData.append("category", cat));
      formData.append("description", data.description);
      formData.append("sellingPrice", data.sellingPrice.toString());
      formData.append("isPublished", data.isPublished.toString());

      const result = await createProduct(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Product created successfully!");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="productImage"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept={ALLOWED_IMAGE_TYPES.join(",")}
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormDescription>
                  Upload a product image (max 10MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sellingPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={field.value}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter categories separated by commas"
                    onChange={(e) => {
                      const categories = e.target.value
                        .split(",")
                        .map((cat) => cat.trim())
                        .filter(Boolean);
                      field.onChange(categories);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Enter up to 5 categories, separated by commas
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Publish</FormLabel>
                  <FormDescription>
                    Make this product visible to customers
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter product description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="mt-6" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
