import ProductGrid from "./_components/ProductGrid";
import { getHeadwearProducts } from "./actions";

export default async function ProductsPage() {
  console.log("Page: Fetching headwear products");
  const { products, error } = await getHeadwearProducts();

  if (error) {
    console.error("Page: Error loading products:", error);
    return <div>Error loading products</div>;
  }

  console.log(`Page: Received ${products?.length || 0} products`);

  // Log a sample product if available
  if (products && products.length > 0) {
    console.log("Page: Sample product data:", {
      name: products[0].productName,
      imageUrl: products[0].productImgUrl,
      hasVariations: products[0].variations
        ? products[0].variations.length > 0
        : false,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Headwear Collection</h1>
      <ProductGrid products={products || []} />
    </div>
  );
}
