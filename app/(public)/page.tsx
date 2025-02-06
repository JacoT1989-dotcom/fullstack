import HeroSlider from "./_components/(section-1)/HeroSlide";
import { Slide } from "./_components/(section-1)/types";

// Example data - you might want to fetch this from an API or database
const heroSlides: Slide[] = [
  // You'll need to populate this with your slide data
];

export default function Home() {
  return (
    <div className="mt-20">
      {/* (section 1) */}
      <HeroSlider slides={heroSlides} />
    </div>
  );
}
