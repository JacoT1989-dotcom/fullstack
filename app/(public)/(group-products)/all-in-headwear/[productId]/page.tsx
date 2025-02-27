import { getProductById } from "./actions";
import ProductDetails from "./ProductDetails";

interface ProductDetailsPageProps {
  params: {
    productId: string;
  };
}

const ProductDetailsPage = async ({ params }: ProductDetailsPageProps) => {
  const result = await getProductById(params.productId);

  if (!result.success || !result.product) {
    return (
      <div className="mt-20 container mx-auto px-4 text-center">
        <h1 className="text-2xl text-red-600">
          {result.error || "Failed to load product"}
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <ProductDetails product={result.product} />
    </div>
  );
};

export default ProductDetailsPage;
