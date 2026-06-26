'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Banner from "@/components/home/Banner";
import FeaturedClasses from "@/components/home/FeaturedClasses";
import LatestPosts from "@/components/home/LatestPosts";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseUs from "@/components/home/WhyChooseUs";

// export default function Home() {
//   return (
//      <main>
//       <Banner />
//       <FeaturedClasses />
//       <LatestPosts />
//       <Testimonials />
//       <WhyChooseUs />
//     </main>
//   );
// }

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <main>
      <Banner />
      <FeaturedClasses />
      <WhyChooseUs />
      <LatestPosts />
      <Testimonials />
    </main>
  );
}