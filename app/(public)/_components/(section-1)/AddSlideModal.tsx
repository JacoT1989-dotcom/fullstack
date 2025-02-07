"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateSlideInput } from "./types";

interface AddSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSlideInput) => void;
}

const bgColorOptions = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-red-500", label: "Red" },
];

const AddSlideModal: React.FC<AddSlideModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<CreateSlideInput>({
    title: "",
    description: "",
    bgColor: "",
    sliderImageurl: "",
    order: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      bgColor: "",
      sliderImageurl: "",
      order: 1,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Slide</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter slide title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sliderImageurl">Image URL</Label>
            <Input
              id="sliderImageurl"
              value={formData.sliderImageurl}
              onChange={(e) =>
                setFormData({ ...formData, sliderImageurl: e.target.value })
              }
              placeholder="Enter image URL"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter slide description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bgColor">Background Color</Label>
            <Select
              value={formData.bgColor}
              onValueChange={(value) =>
                setFormData({ ...formData, bgColor: value })
              }
              required
            >
              <SelectTrigger id="bgColor">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {bgColorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              min={1}
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value),
                })
              }
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Slide</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSlideModal;
