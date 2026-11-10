// Hidden SVG filter definitions used by the water effect.
// #textWaterFilter is always included; pass withImageFilter for pages that also distort images.
export default function WaterFilterDefs({ withImageFilter = false }) {
  return (
    <svg className="absolute w-0 h-0 pointer-events-none">
      {withImageFilter && (
        <filter id="waterFilter">
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.008" numOctaves="1" result="noiseForImage" />
          <feDisplacementMap in="SourceGraphic" in2="noiseForImage" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      )}
      <filter id="textWaterFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.01" numOctaves="1" result="noiseForText" />
        <feDisplacementMap in="SourceGraphic" in2="noiseForText" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
