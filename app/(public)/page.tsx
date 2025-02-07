import { validateRequest } from "@/auth";
import { getSlides } from "./_components/(section-1)/get-slides-actions";
import HeroSlider from "./_components/(section-1)/HeroSlide";

export default async function Home() {
  const [slidesResponse, { user }] = await Promise.all([
    getSlides(),
    validateRequest(),
  ]);

  const userRole = user?.role ?? "USER";

  return (
    <div className="mt-20">
      <HeroSlider userRole={userRole} />
    </div>
  );
}
