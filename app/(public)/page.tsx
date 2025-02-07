import HeroSlider from "./_components/(section-1)/HeroSlide";
import { validateRequest } from "@/auth";

export default async function Home() {
  const { user } = await validateRequest();
  const userRole = user?.role ?? "USER";

  return (
    <div className="mt-20">
      {/* (section 1) */}
      <HeroSlider slides={[]} userRole={userRole} />
    </div>
  );
}
