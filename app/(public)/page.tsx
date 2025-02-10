// page.tsx
import { validateRequest } from "@/auth";
import { getSlides } from "./_components/(section-1)/_crud-actions/get-slides-actions";
import HeroSlider from "./_components/(section-1)/HeroSlide";

export default async function Home() {
  // Only get slides on initial server-side render
  const [initialSlidesResponse, { user }] = await Promise.all([
    getSlides(),
    validateRequest(),
  ]);

  const userRole = user?.role ?? "USER";

  return (
    <div className="mt-20">
      <HeroSlider
        userRole={userRole}
        initialSlides={initialSlidesResponse.data || []} // Pass initial data
      />
    </div>
  );
}
