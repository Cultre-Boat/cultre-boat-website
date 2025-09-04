import Image from "next/image";

export default function MarketingApproach() {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between text-white p-8 md:p-16 gap-8 md:gap-16">
      {/* Left Side - Images */}
      <div className="relative flex items-center">
        {/* Background Image */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {/* Add background decorative SVGs */}
          <svg className="absolute top-10 left-10 w-16 h-16 opacity-50">
            {/* Replace this with your actual bubble SVG */}
            <circle cx="8" cy="8" r="8" fill="white" />
          </svg>
        </div>

        {/* Left Image 1 */}
        <div className="relative w-36 h-52 sm:w-48 sm:h-64 md:w-56 md:h-72 rounded-lg overflow-hidden">
          <Image
            src="/LIZ-PAUL-image6.svg"
            alt="Image 1"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        <div className="relative w-48 h-72 sm:w-64 sm:h-96 md:w-80 md:h-[420px] rounded-lg overflow-hidden z-10 mx-4 md:mx-6">
          <Image
            src="/LIZ-PAUL-image5.svg"
            alt="Image 2"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="relative w-36 h-52 sm:w-48 sm:h-64 md:w-56 md:h-72 rounded-lg overflow-hidden">
          <Image
            src="/LIZ-PAUL-main.svg"
            alt="Image 3"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="relative w-full md:w-1/2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Approach</h3>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-2">
          40+ Influencer Collaboration
        </p>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-1">
          37% Growth in Brand Retention.
        </p>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-1">
          10+ Celebrity Placements
        </p>

        {/* Lighthouse SVG */}
        <svg className="absolute bottom-4 right-4 w-20 h-20 opacity-30">
          {/* Replace with actual lighthouse SVG */}
          <rect x="5" y="5" width="20" height="40" fill="white" />
        </svg>
      </div>
    </div>
  );
}
