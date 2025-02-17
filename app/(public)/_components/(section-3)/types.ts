export interface ProductCardProps {
  name: string;
  price: string;
  rating: number;
  image?: string; // Optional URL for the product image
}

export interface ProductSlideProps {
  products: ProductCardProps[];
  isMobile: boolean;
}

export type TabContent = {
  [key: number]: ProductCardProps[][];
};
