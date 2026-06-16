export default function VisualDesignGrid() {
  return (
    <div className="relative text-white min-h-screen p-4 md:p-8">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6">
        {/* Top Left Image + Text - full width on mobile */}
        <div className="col-span-1 md:col-start-2 md:col-span-6 row-start-1 lg:mt-50">
          <p className="text-base md:text-3xl font-semibold">Visual Vocabulary</p>
          <p className="text-xs md:text-2xl text-gray-400">Exhibition Guidelines</p>
          <img
            src="/Design-image6.svg"
            alt="Visual Vocabulary"
            className="mt-4  w-full h-auto object-cover md:right-0 lg:right-20 lg:relative"
          />
        </div>

        {/* Top Right Image - full width on mobile */}
        <div className="col-span-1 md:col-start-8 md:col-span-4 row-start-2 md:row-start-1 lg:mt-60 md:right-0 lg:right-36 relative left-15">
          <img
            src="/Design-image7.svg"
            alt="Product Display"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Bottom Left Image - full width on mobile */}
        <div className="col-span-1 md:col-start-2 md:col-span-4 row-start-3 md:row-start-2 md:mr-0 lg:mr-12 lg:mt-20">
          <img
            src="/Design-image8.svg"
            alt="Cosmetic Product Display"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Bottom Right Image + Text - full width on mobile */}
        <div className="col-span-1 md:col-start-8 md:col-span-6 row-start-4 md:row-start-2">
          <p className="text-base md:text-lg font-semibold">Print & Digital Design</p>
          <p className="text-xs md:text-sm text-gray-400">Collaterals</p>
          <img
            src="/Design-image9.svg"
            alt="Print & Digital Collaterals"
            className="mt-4 md:mt-0 w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}