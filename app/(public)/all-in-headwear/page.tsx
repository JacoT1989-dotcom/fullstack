// app/products/page.tsx
import { getHeadwearProducts } from "./actions";
import ProductGrid from "./ProductGrid";

export default async function ProductsPage() {
  const { products, error } = await getHeadwearProducts();

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6 px-4">Headwear Collection</h1>
      <ProductGrid products={products || []} />
    </div>
  );
}
