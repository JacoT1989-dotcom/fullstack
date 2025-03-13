"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Types
interface CartItem {
  id: string;
  quantity: number;
  variation: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    product: {
      id: string;
      productName: string;
    };
  };
}

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
}

export default function OrderSummary({ items, totalPrice }: OrderSummaryProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
        <h2 className="text-xl font-bold mb-6">Order Summary</h2>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <Link href="/products">
              <Button variant="outline">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded relative">
                    <Image
                      src={item.variation.imageUrl}
                      alt={item.variation.product.productName}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium">
                      {item.variation.product.productName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.variation.name}
                    </p>

                    <div className="flex items-center mt-1 justify-between">
                      <div className="flex items-center gap-2">
                        <select
                          className="border rounded h-7 text-sm"
                          value={item.quantity}
                          disabled
                          aria-label={`Quantity for ${item.variation.product.productName}`}
                          title="Quantity"
                        >
                          <option>{item.quantity}</option>
                        </select>
                        <button
                          className="text-red-500 text-sm"
                          type="button"
                          disabled
                        >
                          Remove
                        </button>
                      </div>
                      <span className="font-medium">
                        R{(item.variation.price * item.quantity).toFixed(2)}{" "}
                        each
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Subtotal: R
                      {(item.variation.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex items-center justify-between font-bold">
                <span>Total:</span>
                <span>R{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
