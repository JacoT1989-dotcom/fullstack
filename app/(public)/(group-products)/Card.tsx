import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { formatCurrency } from "./utils";

interface ProductCardProps {
  id: string;
  productName: string;
  category: string[];
  productImgUrl: string;
  description: string;
  sellingPrice: number;
}

export const ProductCard = ({
  productName,
  category,
  productImgUrl,
  description,
  sellingPrice,
}: ProductCardProps) => (
  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
    <CardHeader className="p-0">
      <div className="relative aspect-square">
        <Image
          src={productImgUrl}
          alt={productName}
          fill
          className="object-cover rounded-t-lg"
          sizes="(max-width: 640px) 100vw, 
                   (max-width: 768px) 50vw,
                   (max-width: 1024px) 33vw,
                   25vw"
        />
      </div>
    </CardHeader>
    <CardContent className="flex-grow p-4">
      <h3 className="font-semibold text-lg mb-1 truncate">{productName}</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        {category.map((cat) => (
          <span
            key={cat}
            className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full"
          >
            {cat}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <p className="text-lg font-bold text-primary">
        {formatCurrency(sellingPrice)}
      </p>
    </CardFooter>
  </Card>
);
