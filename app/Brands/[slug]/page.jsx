import Image from "next/image";
import { notFound } from "next/navigation";
import { IndustriesData } from "../Data.js";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(IndustriesData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = IndustriesData[slug];
  if (!brand) return {};
  return {
    title: brand.name,
    description: brand.description,
    alternates: { canonical: `/Brands/${slug}` },
  };
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const brand = IndustriesData[slug];
  if (!brand) notFound();

  const additionalImages = brand.additionalImages || brand.images.slice(0, 3);
  const metrics = brand.metrics || {};

  return (
    <div className="mt-16 text-white min-h-screen p-4 sm:p-6">
      <div className="mb-8 sm:mb-12 relative">
        <h1 className="text-3xl sm:text-5xl font-bold">{brand.name}</h1>
        <p className="text-base sm:text-lg mt-2 text-gray-400">{brand.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 mt-5 sm:mt-6">
          <div className="col-span-1 sm:col-span-7 relative aspect-[4/3]">
            <Image
              src={brand.images[0]}
              alt={brand.name}
              fill
              sizes="(min-width: 640px) 58vw, 100vw"
              className="object-contain"
              priority
            />
          </div>

          <div className="col-span-1 sm:col-span-5 flex flex-col justify-start sm:justify-center mt-4 sm:mt-0">
            {brand.points.map((point, index) => (
              <p key={index} className="text-base sm:text-lg mt-2 sm:mt-0">{point}</p>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-6 mt-6 sm:mt-8">
          <div className="col-span-1 sm:col-span-4">
            <h2 className="text-2xl sm:text-3xl font-semibold">{brand.overview.title}</h2>
            {brand.overview.points.map((point, index) => (
              <p key={index} className="text-base sm:text-lg text-gray-400 mt-2">{point}</p>
            ))}
          </div>

          <div className="col-span-1 sm:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 sm:mt-0">
            {brand.images.slice(1).map((img, index) => (
              <div key={img + index} className="relative aspect-[3/4]">
                <Image
                  src={img}
                  alt={`${brand.name} ${index + 2}`}
                  fill
                  sizes="(min-width: 640px) 22vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between text-white p-4 sm:p-6 md:p-10 gap-5 sm:gap-6 md:gap-10 mt-6 sm:mt-10">
          <div className="relative w-full h-60 sm:h-96 md:h-[650px]">
            <Image
              src={additionalImages[0] || brand.images[0]}
              alt={`${brand.name} campaign`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain rounded-lg"
            />
          </div>

          <div className="relative w-full md:w-1/2 mt-6 md:mt-0">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">APPROACH</h3>
            {[
              metrics.content || "40+ Influencer Collaboration",
              metrics.influencers || "40+ Influencer Collaboration",
              metrics.growth || "37% Growth in Brand Retention",
              metrics.celebrities || "10+ Celebrity Placements",
            ].map((line, i) => (
              <p key={i} className="text-lg sm:text-xl md:text-2xl font-semibold mt-4">{line}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
