// app/products/page.tsx
import ProductGrid from "./_components/ProductGrid";
import { getHeadwearProducts } from "./actions";

export default async function ProductsPage() {
  const { products, error } = await getHeadwearProducts();

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Headwear Collection</h1>
      <ProductGrid products={products || []} />
    </div>
  );
}
